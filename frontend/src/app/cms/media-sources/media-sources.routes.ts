import { Routes } from '@angular/router';

export const mediaSourcesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./media-sources-list/media-sources-list.component').then(
        (m) => m.MediaSourcesListComponent,
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./media-sources-form/media-sources-form.component').then(
        (m) => m.MediaSourcesFormComponent,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./media-sources-form/media-sources-form.component').then(
        (m) => m.MediaSourcesFormComponent,
      ),
  },
];
