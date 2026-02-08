import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private readonly router = inject(Router);

  features = [
    {
      icon: 'calendar',
      title: 'View Available Slots',
      description: 'Browse through available appointment slots from multiple providers and find the perfect time for you.'
    },
    {
      icon: 'check',
      title: 'Book Instantly',
      description: 'Quick and easy booking process with instant confirmation. No waiting, no hassle.'
    },
    {
      icon: 'shield',
      title: 'Prevent Double Booking',
      description: 'Advanced conflict detection system ensures no overlapping schedules or double bookings.'
    },
    {
      icon: 'settings',
      title: 'Admin Management',
      description: 'Comprehensive admin panel to manage slots, view bookings, and control availability.'
    }
  ];

  navigateToSlots(): void {
    this.router.navigate(['/available-slots']);
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin-slots']);
  }
}
