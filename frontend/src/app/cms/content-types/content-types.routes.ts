import { Routes } from '@angular/router';

export const contentTypesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./content-types-list/content-types-list.component').then(
        (m) => m.ContentTypesListComponent,
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./content-types-form/content-types-form.component').then(
        (m) => m.ContentTypesFormComponent,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./content-types-form/content-types-form.component').then(
        (m) => m.ContentTypesFormComponent,
      ),
  },
];
