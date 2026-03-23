import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { App } from './app';
import { AuthService } from './auth.service';
import { routes } from './app.routes';

describe('App', () => {
  const authServiceStub = {
    fetchCurrentUser: vi.fn(() => of({ user: null })),
    isLoggedIn: true,
  };

  beforeEach(async () => {
    authServiceStub.fetchCurrentUser.mockClear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        provideLocationMocks(),
        { provide: AuthService, useValue: authServiceStub },
      ],
    }).compileComponents();
  });

  // Testing if app is created
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Testing if it calls the fetchCurrentUser action on load so we can authenticate and redirect
  it('should call fetchCurrentUser on init', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(authServiceStub.fetchCurrentUser).toHaveBeenCalled();
  });

  // Tesing if we redirect to appropriate place from base route
  it('should redirect to /task by default', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    await router.navigate(['/']);
    expect(location.path()).toBe('/task');
  });
});
