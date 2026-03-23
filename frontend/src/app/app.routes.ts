import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'signup', loadComponent: () => import('./signup/signup').then(m => m.Signup) },
  { path: 'login',  loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'task',   loadComponent: () => import('./task/task').then(m => m.Task), canActivate: [AuthGuard] },
  { path: '', redirectTo: 'task', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
