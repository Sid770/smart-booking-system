import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  appointment = signal<Appointment | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAppointment();
  }

  private loadAppointment(): void {
    const appointmentId = this.route.snapshot.paramMap.get('id');
    
    if (appointmentId) {
      const id = parseInt(appointmentId, 10);
      
      this.appointmentService.getAppointmentById(id).subscribe({
        next: (appointment) => {
          this.appointment.set(appointment);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading appointment:', err);
          this.error.set('Failed to load appointment details.');
          this.loading.set(false);
        }
      });
    } else {
      this.error.set('Invalid appointment ID.');
      this.loading.set(false);
    }
  }

  formatTime(time: string): string {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goToSlots(): void {
    this.router.navigate(['/available-slots']);
  }

  printConfirmation(): void {
    window.print();
  }
}
