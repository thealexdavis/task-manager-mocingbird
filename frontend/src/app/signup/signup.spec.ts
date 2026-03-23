import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { Signup } from './signup';
import { AuthService } from '../auth.service';

const VALID_FORM = {
  first_name: 'Test',
  last_name: 'user',
  email: 'test@example.com',
  password: 'password123',
  password_confirmation: 'password123'
};

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let authService: { signup: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = { signup: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  // Submit with server errors and return rendered .error
  function submitWithErrors(errors: string[]) {
    authService.signup.mockReturnValue(
      throwError(() => ({ error: { errors } }))
    );
    component.onSubmit();
    fixture.detectChanges();
    return fixture.debugElement.queryAll(By.css('.error'));
  }

  // Checking if component is created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Successful account creation navigates to /task
  it('navigates to /task after successful signup', () => {
    authService.signup.mockReturnValue(of({ user: { id: 1 } }));

    component.form = { ...VALID_FORM };
    component.onSubmit();

    expect(authService.signup).toHaveBeenCalledWith(VALID_FORM);
    expect(router.navigate).toHaveBeenCalledWith(['/task']);
  });

  // Server rejects a missing required field
  it('shows error when a required field is missing', () => {
    const errorEls = submitWithErrors(["First name can't be blank"]);

    expect(errorEls.length).toBe(1);
    expect(errorEls[0].nativeElement.textContent).toContain("First name can't be blank");
  });

  // Server rejects a duplicate email
  it('shows error when email is already taken', () => {
    const errorEls = submitWithErrors(['Email has already been taken']);

    expect(errorEls.length).toBe(1);
    expect(errorEls[0].nativeElement.textContent).toContain('Email has already been taken');
  });

  // Server rejects a password shorter than 8 characters
  it('shows error when password is too short', () => {
    const errorEls = submitWithErrors(['Password is too short (minimum is 8 characters)']);

    expect(errorEls.length).toBe(1);
    expect(errorEls[0].nativeElement.textContent).toContain('Password is too short');
  });

  // Server rejects mismatched password confirmation
  it('shows error when password confirmation does not match', () => {
    const errorEls = submitWithErrors(["Password confirmation doesn't match Password"]);

    expect(errorEls.length).toBe(1);
    expect(errorEls[0].nativeElement.textContent).toContain("Password confirmation doesn't match");
  });

  // Multiple errors render as separate elements
  it('renders multiple errors as separate elements', () => {
    const errorEls = submitWithErrors([
      "First name can't be blank",
      "Password is too short (minimum is 8 characters)"
    ]);

    expect(errorEls.length).toBe(2);
  });

  // Fallback when server returns no errors array
  it('shows fallback error when server returns no errors array', () => {
    authService.signup.mockReturnValue(throwError(() => ({ error: {} })));
    component.onSubmit();
    fixture.detectChanges();

    expect(component.errors).toEqual(['Signup failed']);
  });
});
