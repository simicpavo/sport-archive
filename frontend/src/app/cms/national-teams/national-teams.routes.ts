import { Routes } from '@angular/router';

export const nationalTeamsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./national-teams-list/national-teams-list.component').then(
        (m) => m.NationalTeamsListComponent,
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./national-teams-form/national-teams-form.component').then(
        (m) => m.NationalTeamsFormComponent,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./national-teams-form/national-teams-form.component').then(
        (m) => m.NationalTeamsFormComponent,
      ),
  },
];
