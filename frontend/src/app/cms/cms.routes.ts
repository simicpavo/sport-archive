import { Routes } from '@angular/router';

export const cmsRoutes: Routes = [
  {
    path: 'sports',
    loadChildren: () => import('./sports/sports.routes').then((m) => m.sportsRoutes),
  },
  {
    path: 'content-types',
    loadChildren: () =>
      import('./content-types/content-types.routes').then((m) => m.contentTypesRoutes),
  },
  { path: '', redirectTo: 'sports', pathMatch: 'full' },
];
