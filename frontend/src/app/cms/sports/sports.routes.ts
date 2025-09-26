import { Routes } from '@angular/router';

export const sportsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sports-list/sports-list').then((m) => m.SportsListComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./sports-form/sports-form').then((m) => m.SportsFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./sports-form/sports-form').then((m) => m.SportsFormComponent),
  },
];
