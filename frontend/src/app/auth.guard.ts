import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  // This is protecting unauthenticated users from accessing routes we don't want them to
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    // Already resolved in memory — allow immediately
    if (this.authService.isLoggedIn) return true;

    // On a fresh page load the BehaviorSubject is null even with a valid session
    // cookie. Ask the server to verify before blocking the user.
    return this.authService.fetchCurrentUser().pipe(
      map(() => true),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
