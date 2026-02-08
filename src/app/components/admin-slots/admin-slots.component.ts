import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { TimeSlot } from '../../models/appointment.model';

@Component({
  selector: 'app-admin-slots',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-slots.component.html',
  styleUrls: ['./admin-slots.component.css']
})
export class AdminSlotsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);

  slots = signal<TimeSlot[]>([]);
  showAddForm = signal(false);
  editingSlot = signal<TimeSlot | null>(null);
  slotForm!: FormGroup;
  submitted = signal(false);
  
  loading = computed(() => this.appointmentService.loading());
  error = computed(() => this.appointmentService.error());
  providers = computed(() => this.appointmentService.providers());

  reloadProviders(): void {
    this.loadProviders();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSlots();
    this.loadProviders();
  }

  private initializeForm(): void {
    this.slotForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      providerId: ['', Validators.required],
      providerName: ['', Validators.required],
      isAvailable: [true]
    });
  }

  private loadSlots(): void {
    this.appointmentService.getAllSlots().subscribe({
      next: (slots) => {
        this.slots.set(slots);
      },
      error: (err) => {
        console.error('Error loading slots:', err);
      }
    });
  }

  private loadProviders(): void {
    console.log('Loading providers...');
    this.appointmentService.getProviders().subscribe({
      next: (providers) => {
        console.log('Providers loaded:', providers);
      },
      error: (err) => {
        console.error('Error loading providers:', err);
      }
    });
  }

  onProviderChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const providerId = parseInt(select.value, 10);
    const provider = this.providers().find(p => p.id === providerId);
    
    if (provider) {
      this.slotForm.patchValue({
        providerName: provider.name
      });
    }
  }

  openAddForm(): void {
    console.log('Opening add form, providers:', this.providers());
    this.showAddForm.set(true);
    this.editingSlot.set(null);
    this.slotForm.reset({ isAvailable: true });
    this.submitted.set(false);
  }

  openEditForm(slot: TimeSlot): void {
    this.editingSlot.set(slot);
    this.showAddForm.set(true);
    this.slotForm.patchValue({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      providerId: slot.providerId,
      providerName: slot.providerName,
      isAvailable: slot.isAvailable
    });
    this.submitted.set(false);
  }

  closeForm(): void {
    this.showAddForm.set(false);
    this.editingSlot.set(null);
    this.slotForm.reset();
    this.submitted.set(false);
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.slotForm.invalid) {
      this.markFormGroupTouched(this.slotForm);
      return;
    }

    const slotData = this.slotForm.value;
    const editingSlot = this.editingSlot();

    if (editingSlot) {
      this.appointmentService.updateSlot(editingSlot.id, slotData).subscribe({
        next: () => {
          this.loadSlots();
          this.closeForm();
        },
        error: (err) => {
          console.error('Error updating slot:', err);
        }
      });
    } else {
      this.appointmentService.createSlot(slotData).subscribe({
        next: () => {
          this.loadSlots();
          this.closeForm();
        },
        error: (err) => {
          console.error('Error creating slot:', err);
        }
      });
    }
  }

  deleteSlot(slot: TimeSlot): void {
    if (confirm(`Are you sure you want to delete the slot for ${this.formatDate(slot.date)} at ${this.formatTime(slot.startTime)}?`)) {
      this.appointmentService.deleteSlot(slot.id).subscribe({
        next: () => {
          this.loadSlots();
        },
        error: (err) => {
          console.error('Error deleting slot:', err);
        }
      });
    }
  }

  toggleAvailability(slot: TimeSlot): void {
    this.appointmentService.updateSlot(slot.id, { isAvailable: !slot.isAvailable }).subscribe({
      next: () => {
        this.loadSlots();
      },
      error: (err) => {
        console.error('Error updating slot:', err);
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
    const field = this.slotForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted()));
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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
