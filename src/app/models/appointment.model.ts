export interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  providerId: number;
  providerName: string;
}

export interface Appointment {
  id: number;
  slotId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  slot?: TimeSlot;
}

export interface CreateAppointmentRequest {
  slotId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  notes?: string;
}

export interface Provider {
  id: number;
  name: string;
  specialty: string;
  email: string;
}
