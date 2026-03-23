import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { Login } from './login';
import { AuthService } from '../auth.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = { login: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  // Can initiate without error
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Able to log in successfully and go to /task
  it('navigates to /task on successful login', () => {
    authService.login.mockReturnValue(of({ user: { id: 1 } }));

    component.email = 'user@example.com';
    component.password = 'password123';
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('user@example.com', 'password123');
    expect(router.navigate).toHaveBeenCalledWith(['/task']);
  });

  // Shows error message if you have a bad log in
  it('shows error message on failed login', () => {
    authService.login.mockReturnValue(
      throwError(() => ({ error: { error: 'Invalid email or password' } }))
    );

    component.onSubmit();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain('Invalid email or password');
  });

  // Shows default error message if no error message returned
  it('shows fallback error when server returns no message', () => {
    authService.login.mockReturnValue(throwError(() => ({ error: {} })));

    component.onSubmit();
    fixture.detectChanges();

    expect(component.error).toBe('Login failed');
  });

  // Checking if a link to sign-up page exists and is accessible.
  it('has a link to the sign-up page', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/signup"]'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.textContent).toContain('Sign up');
  });
});
