import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/auth/login';
import { RegisterComponent } from './pages/auth/register';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'members', loadComponent: () => import('./pages/members/members').then(m => m.MembersComponent) },
  { path: 'trainers', loadComponent: () => import('./pages/trainers/trainers').then(m => m.TrainersComponent) },
  { path: 'plans', loadComponent: () => import('./pages/plans/plans').then(m => m.PlansComponent) },
  { path: 'machines', loadComponent: () => import('./pages/machines/machines').then(m => m.MachinesComponent) }
];
