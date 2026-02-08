import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TimeSlot, Appointment, CreateAppointmentRequest, Provider } from '../models/appointment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Signals for state management
  availableSlots = signal<TimeSlot[]>([]);
  appointments = signal<Appointment[]>([]);
  providers = signal<Provider[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Get available slots
  getAvailableSlots(date?: string, providerId?: number): Observable<TimeSlot[]> {
    this.loading.set(true);
    this.error.set(null);
    
    let url = `${this.apiUrl}/slots/available`;
    const params: string[] = [];
    
    if (date) params.push(`date=${date}`);
    if (providerId) params.push(`providerId=${providerId}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<TimeSlot[]>(url).pipe(
      tap(slots => {
        this.availableSlots.set(slots);
        this.loading.set(false);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Book an appointment
  bookAppointment(request: CreateAppointmentRequest): Observable<Appointment> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, request).pipe(
      tap(appointment => {
        this.loading.set(false);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Get appointments
  getAppointments(): Observable<Appointment[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`).pipe(
      tap(appointments => {
        this.appointments.set(appointments);
        this.loading.set(false);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Get appointment by ID
  getAppointmentById(id: number): Observable<Appointment> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<Appointment>(`${this.apiUrl}/appointments/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError(this.handleError.bind(this))
    );
  }

  // Cancel appointment
  cancelAppointment(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.delete<void>(`${this.apiUrl}/appointments/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError(this.handleError.bind(this))
    );
  }

  // Admin: Create slot
  createSlot(slot: Omit<TimeSlot, 'id'>): Observable<TimeSlot> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.post<TimeSlot>(`${this.apiUrl}/slots`, slot).pipe(
      tap(() => this.loading.set(false)),
      catchError(this.handleError.bind(this))
    );
  }

  // Admin: Update slot
  updateSlot(id: number, slot: Partial<TimeSlot>): Observable<TimeSlot> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.put<TimeSlot>(`${this.apiUrl}/slots/${id}`, slot).pipe(
      tap(() => this.loading.set(false)),
      catchError(this.handleError.bind(this))
    );
  }

  // Admin: Delete slot
  deleteSlot(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.delete<void>(`${this.apiUrl}/slots/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError(this.handleError.bind(this))
    );
  }

  // Get all slots (admin)
  getAllSlots(): Observable<TimeSlot[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<TimeSlot[]>(`${this.apiUrl}/slots`).pipe(
      tap(slots => {
        this.availableSlots.set(slots);
        this.loading.set(false);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Get providers
  getProviders(): Observable<Provider[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<Provider[]>(`${this.apiUrl}/providers`).pipe(
      tap(providers => {
        this.providers.set(providers);
        this.loading.set(false);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.loading.set(false);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    
    this.error.set(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
