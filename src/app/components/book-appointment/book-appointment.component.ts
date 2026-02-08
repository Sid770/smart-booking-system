import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { TimeSlot, CreateAppointmentRequest } from '../../models/appointment.model';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  slotId = signal<number | null>(null);
  selectedSlot = signal<TimeSlot | null>(null);
  bookingForm!: FormGroup;
  submitted = signal(false);
  bookingSuccess = signal(false);
  bookingError = signal<string | null>(null);

  loading = computed(() => this.appointmentService.loading());

  serviceTypes = [
    'General Consultation',
    'Follow-up Visit',
    'Health Checkup',
    'Vaccination',
    'Diagnostic Test',
    'Therapy Session',
    'Emergency Care',
    'Other'
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.loadSlotDetails();
  }

  private initializeForm(): void {
    this.bookingForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]+$/)]],
      serviceType: ['', Validators.required],
      notes: ['']
    });
  }

  private loadSlotDetails(): void {
    const slotIdParam = this.route.snapshot.paramMap.get('slotId');
    
    if (slotIdParam) {
      const id = parseInt(slotIdParam, 10);
      this.slotId.set(id);
      
      // Load the specific slot details
      this.appointmentService.getAvailableSlots().subscribe({
        next: (slots) => {
          const slot = slots.find(s => s.id === id);
          if (slot) {
            this.selectedSlot.set(slot);
            if (!slot.isAvailable) {
              this.bookingError.set('This slot is no longer available. Please select another slot.');
            }
          } else {
            this.bookingError.set('Slot not found.');
          }
        },
        error: (err) => {
          console.error('Error loading slot:', err);
          this.bookingError.set('Failed to load slot details.');
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.bookingError.set(null);

    if (this.bookingForm.invalid) {
      this.markFormGroupTouched(this.bookingForm);
      return;
    }

    const slotId = this.slotId();
    if (!slotId) {
      this.bookingError.set('Invalid slot ID.');
      return;
    }

    const request: CreateAppointmentRequest = {
      slotId,
      ...this.bookingForm.value
    };

    this.appointmentService.bookAppointment(request).subscribe({
      next: (appointment) => {
        this.bookingSuccess.set(true);
        setTimeout(() => {
          this.router.navigate(['/confirmation', appointment.id]);
        }, 2000);
      },
      error: (err) => {
        console.error('Booking error:', err);
        this.bookingError.set(err.message || 'Failed to book appointment. Please try again.');
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted()));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      return `${this.getFieldLabel(fieldName)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      customerName: 'Name',
      customerEmail: 'Email',
      customerPhone: 'Phone',
      serviceType: 'Service Type'
    };
    return labels[fieldName] || fieldName;
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

  goBack(): void {
    this.router.navigate(['/available-slots']);
  }
}
