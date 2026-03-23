import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// This is the return of the task item
export interface TaskItem {
  id: number;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// What we send to task API
export interface TaskPayload {
  title: string;
  description?: string;
  due_date?: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  // Base level URL for the APIs in Ruby on Rails backend
  private apiUrl = 'http://localhost:3000/api/v1';
  private opts = { withCredentials: true };

  constructor(private http: HttpClient) {}

  // Get all tasks for the user
  getTasks(): Observable<{ tasks: TaskItem[] }> {
    return this.http.get<{ tasks: TaskItem[] }>(`${this.apiUrl}/tasks`, this.opts);
  }

  // Create task
  createTask(payload: TaskPayload): Observable<{ task: TaskItem }> {
    return this.http.post<{ task: TaskItem }>(`${this.apiUrl}/tasks`, { task: payload }, this.opts);
  }

  // Update specific task
  updateTask(id: number, payload: Partial<TaskPayload>): Observable<{ task: TaskItem }> {
    return this.http.patch<{ task: TaskItem }>(`${this.apiUrl}/tasks/${id}`, { task: payload }, this.opts);
  }

  // Delete a task
  deleteTask(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/tasks/${id}`, this.opts);
  }
}
