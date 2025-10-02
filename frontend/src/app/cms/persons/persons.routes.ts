import { Routes } from '@angular/router';

export const personsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./persons-list/persons-list.component').then((m) => m.PersonsListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./persons-form/persons-form.component').then((m) => m.PersonsFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./persons-form/persons-form.component').then((m) => m.PersonsFormComponent),
  },
];
