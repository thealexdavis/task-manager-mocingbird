import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  encapsulation: ViewEncapsulation.None
})
export class Signup {
  // The signup form fields
  form = { first_name: '', last_name: '', email: '', password: '', password_confirmation: '' };
  // Any errors
  errors: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Submitting signup form through API
  onSubmit() {
    this.errors = [];
    this.authService.signup(this.form).subscribe({
      next: () => this.router.navigate(['/task']),
      error: (err) => {
        this.errors = err.error?.errors ?? ['Signup failed'];
        this.cdr.detectChanges();
      }
    });
  }
}