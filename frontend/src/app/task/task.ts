import { Component, OnInit, ViewEncapsulation, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../auth.service';
import { TaskService, TaskItem } from '../task.service';

// FormsModule does two-way binding
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task.html',
  styleUrl: './task.css',
  encapsulation: ViewEncapsulation.None
})
export class Task implements OnInit {

  // Any of the signals automatically updates on the html portion when changed
  // The current signed in user
  currentUser   = signal<User | null>(null);
  // List of tasks
  tasks         = signal<TaskItem[]>([]);
  // Currently loading tasks
  loadingTasks  = signal(true);

  // Are we viewing the task
  viewingTask   = signal<TaskItem | null>(null);
  //Are we showing the form
  showForm      = signal(false);
  // Are we editing the task
  editingTask   = signal<TaskItem | null>(null);
  // Are we submitting
  formSubmitting = signal(false);
  // Are we deleting
  isDeleting    = signal(false);
  // Is there an error
  formError     = signal('');

  // Which column are we sorting by, filtering by, and in what direction
  sortColumn    = signal<'title' | 'due_date' | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  filterStatus  = signal('');

  // Basic variables, not signals
  formTitle       = '';
  formDescription = '';
  formDueDate     = '';
  formStatus      = 'pending';

  readonly statusOptions = ['pending', 'in_progress', 'completed', 'canceled', 'blocked'];

  // List of tasks. This may be filtered and sorted.
  displayedTasks = computed(() => {
    const status = this.filterStatus();
    let list = status
      ? this.tasks().filter(t => t.status === status)
      : [...this.tasks()];

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === 'asc' ? 1 : -1;
      list.sort((a, b) => {
        const aVal = (a[col] ?? '').toString().toLowerCase();
        const bVal = (b[col] ?? '').toString().toLowerCase();
        return aVal < bVal ? -dir : aVal > bVal ? dir : 0;
      });
    }
    return list;
  });

  constructor(private authService: AuthService, private taskService: TaskService) {}

  // Checks for current logged in user and loads the tasks
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => this.currentUser.set(user));
    this.loadTasks();
  }

  // Gets list of tasks for the current user
  loadTasks() {
    this.loadingTasks.set(true);
    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.tasks.set(res.tasks);
        this.loadingTasks.set(false);
      },
      error: () => this.loadingTasks.set(false)
    });
  }

  // Basic look for the view of the task, opening or closing
  openView(task: TaskItem) { this.viewingTask.set(task); }
  closeView()              { this.viewingTask.set(null); }

  // Logging the user out, authService logs out
  logOutUser() { this.authService.logout(); }

  // Activating the add task form
  openAddForm() {
    this.viewingTask.set(null);
    this.editingTask.set(null);
    this.formTitle = '';
    this.formDescription = '';
    this.formDueDate = '';
    this.formStatus = 'pending';
    this.formError.set('');
    this.showForm.set(true);
  }

  // Activating the edit task form
  openEditForm(task: TaskItem) {
    this.viewingTask.set(null);
    this.editingTask.set(task);
    this.formTitle       = task.title;
    this.formDescription = task.description ?? '';
    this.formDueDate     = task.due_date ?? '';
    this.formStatus      = task.status;
    this.formError.set('');
    this.showForm.set(true);
  }

  // Closing the form
  cancelForm() {
    this.showForm.set(false);
    this.editingTask.set(null);
    this.formError.set('');
  }

  // Submitting the form
  submitForm() {
    if (!this.formTitle.trim()) {
      this.formError.set('Title is required.');
      return;
    }
    this.formSubmitting.set(true);
    this.formError.set('');

    // The data we are sending via the API
    const payload = {
      title:       this.formTitle.trim(),
      description: this.formDescription.trim() || undefined,
      due_date:    this.formDueDate || undefined,
      status:      this.formStatus
    };

    // Checking if we are editing and submitting via the task service. Otherwise we are creating.
    const editing = this.editingTask();
    if (editing) {
      this.taskService.updateTask(editing.id, payload).subscribe({
        next: (res) => {
          this.tasks.update(list => list.map(t => t.id === res.task.id ? res.task : t));
          this.formSubmitting.set(false);
          this.cancelForm();
        },
        error: (err) => {
          this.formError.set(err.error?.errors?.join(', ') || 'Failed to update task.');
          this.formSubmitting.set(false);
        }
      });
    } else {
      this.taskService.createTask(payload).subscribe({
        next: (res) => {
          this.tasks.update(list => [res.task, ...list]);
          this.formSubmitting.set(false);
          this.cancelForm();
        },
        error: (err) => {
          this.formError.set(err.error?.errors?.join(', ') || 'Failed to create task.');
          this.formSubmitting.set(false);
        }
      });
    }
  }

  // Deleting the task
  deleteTask(task: TaskItem) {
    if (!confirm(`Delete "${task.title}"?`)) return;
    this.isDeleting.set(true);
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks.update(list => list.filter(t => t.id !== task.id));
        this.isDeleting.set(false);
        this.viewingTask.set(null);
      },
      error: () => {
        this.isDeleting.set(false);
        alert('Failed to delete task.');
      }
    });
  }

  // Setting the sort column and the direction
  setSort(column: 'title' | 'due_date') {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  // Fixing the date for the user to be formatted pretty
  formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString();
  }

  // Only showing the first 50 characters of the description on the table
  truncate(text: string | null, max = 50): string {
    if (!text) return '—';
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  // Turning the status of the task into a more human readable pretty format
  formatStatus(status: string): string {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
