import { Routes } from '@angular/router';

export const clubsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./clubs-list/clubs-list.component').then((m) => m.ClubsListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./clubs-form/clubs-form.component').then((m) => m.ClubsFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./clubs-form/clubs-form.component').then((m) => m.ClubsFormComponent),
  },
];
