import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AvailableSlotsComponent } from './components/available-slots/available-slots.component';
import { BookAppointmentComponent } from './components/book-appointment/book-appointment.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { AdminSlotsComponent } from './components/admin-slots/admin-slots.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'available-slots', component: AvailableSlotsComponent },
  { path: 'book-appointment/:slotId', component: BookAppointmentComponent },
  { path: 'confirmation/:id', component: ConfirmationComponent },
  { path: 'admin-slots', component: AdminSlotsComponent },
  { path: '**', redirectTo: '' }
];
