import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Sending data back to the backend and returning the user
  signup(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/signup`, data, { withCredentials: true })
      .pipe(tap((res: any) => this.currentUserSubject.next(res.user)));
  }

  // Handles posting login credentials
  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(tap((res: any) => this.currentUserSubject.next(res.user)));
  }

  // Ends session and logs out
  logout(): void {
    this.http
      .delete(`${this.apiUrl}/auth/logout`, { withCredentials: true })
      .subscribe({
        complete: () => {
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
        }
      });
  }

  // Get the current user
  fetchCurrentUser(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/profile`, { withCredentials: true })
      .pipe(tap((res: any) => this.currentUserSubject.next(res.user)));
  }

  // Checks if user is logged in
  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}