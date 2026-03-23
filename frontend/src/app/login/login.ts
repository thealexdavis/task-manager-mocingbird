import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  encapsulation: ViewEncapsulation.None
})
export class Login implements OnInit, OnDestroy {
  email = '';
  password = '';
  error = '';

  private userSub: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Redirect to /task if the user is (or becomes) authenticated.
    // Checks user subscription and if the current user is an actual user. If so redirects to /task to prevent multiple logins
    this.userSub = this.authService.currentUser$
      .pipe(filter(user => !!user))
      .subscribe(() => this.router.navigate(['/task']));
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  // Submit function logic. Checks for errors and then runs the logic of login through AuthService API call
  onSubmit() {
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/task']),
      error: (err) => {
        this.error = err.error?.error || 'Login failed';
        this.cdr.detectChanges();
      }
    });
  }
}