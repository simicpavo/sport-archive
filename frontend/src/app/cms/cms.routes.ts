import { Routes } from '@angular/router';

export const cmsRoutes: Routes = [
  {
    path: 'sports',
    loadChildren: () => import('./sports/sports.routes').then((m) => m.sportsRoutes),
  },
  { path: '', redirectTo: 'sports', pathMatch: 'full' },
];
