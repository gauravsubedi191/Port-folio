import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/profile',
    loadComponent: () => import('./features/admin/profile/profile-management.component').then(m => m.ProfileManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/skills',
    loadComponent: () => import('./features/admin/skills/skills-management.component').then(m => m.SkillsManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/projects',
    loadComponent: () => import('./features/admin/projects/projects-management.component').then(m => m.ProjectsManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/experience',
    loadComponent: () => import('./features/admin/experience/experience-management.component').then(m => m.ExperienceManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/messages',
    loadComponent: () => import('./features/admin/messages/messages-management.component').then(m => m.MessagesManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

