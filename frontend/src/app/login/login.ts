import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  encapsulation: ViewEncapsulation.None
})
export class Login {
  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

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