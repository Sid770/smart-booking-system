import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Smart Appointment Booking System';
  currentRoute: string = '';

  navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/available-slots', label: 'Available Slots', icon: '📅' },
    { path: '/book-appointment', label: 'Book Now', icon: '✅' },
    { path: '/admin-slots', label: 'Admin', icon: '⚙️' }
  ];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  isActive(path: string): boolean {
    return this.currentRoute === path;
  }
}
