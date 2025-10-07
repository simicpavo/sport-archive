import { Routes } from '@angular/router';

export const recordsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./records-list/records-list.component').then((m) => m.RecordsListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./records-form/records-form.component').then((m) => m.RecordsFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./records-form/records-form.component').then((m) => m.RecordsFormComponent),
  },
];
