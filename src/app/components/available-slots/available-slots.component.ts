import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { TimeSlot } from '../../models/appointment.model';

@Component({
  selector: 'app-available-slots',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './available-slots.component.html',
  styleUrls: ['./available-slots.component.css']
})
export class AvailableSlotsComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly router = inject(Router);

  selectedDate = signal<string>(this.getTodayDate());
  selectedProvider = signal<number | null>(null);
  slots = signal<TimeSlot[]>([]);
  groupedSlots = computed(() => this.groupSlotsByProvider());

  loading = computed(() => this.appointmentService.loading());
  error = computed(() => this.appointmentService.error());

  ngOnInit(): void {
    this.loadSlots();
    this.appointmentService.getProviders().subscribe();
  }

  loadSlots(): void {
    const date = this.selectedDate();
    const providerId = this.selectedProvider();
    
    this.appointmentService.getAvailableSlots(date, providerId ?? undefined).subscribe({
      next: (slots) => {
        this.slots.set(slots);
      },
      error: (err) => {
        console.error('Error loading slots:', err);
      }
    });
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate.set(input.value);
    this.loadSlots();
  }

  onProviderChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value ? parseInt(select.value, 10) : null;
    this.selectedProvider.set(value);
    this.loadSlots();
  }

  bookSlot(slot: TimeSlot): void {
    this.router.navigate(['/book-appointment', slot.id]);
  }

  private groupSlotsByProvider(): Map<string, TimeSlot[]> {
    const grouped = new Map<string, TimeSlot[]>();
    
    this.slots().forEach(slot => {
      const providerName = slot.providerName;
      if (!grouped.has(providerName)) {
        grouped.set(providerName, []);
      }
      grouped.get(providerName)!.push(slot);
    });
    
    return grouped;
  }

  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
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

  get providers() {
    return this.appointmentService.providers();
  }
}
