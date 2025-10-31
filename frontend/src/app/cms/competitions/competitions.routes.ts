import { Routes } from '@angular/router';

export const competitionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./competitions-list/competitions-list.component').then(
        (m) => m.CompetitionsListComponent,
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./competitions-form/competitions-form.component').then(
        (m) => m.CompetitionsFormComponent,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./competitions-form/competitions-form.component').then(
        (m) => m.CompetitionsFormComponent,
      ),
  },
];
