import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

// This is the root of the angular app. We redirect everyone to task initially on load for first time, and then login if not logged in
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  constructor(private authService: AuthService) {}
  protected readonly title = signal('Task Manager');
  ngOnInit() {
    // If the session cookie is still valid, restore the user
    this.authService.fetchCurrentUser().subscribe({
      error: () => {} // Not logged in — silently ignore
    });
  }
}
