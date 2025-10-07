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
  {
    path: 'national-teams',
    loadChildren: () =>
      import('./national-teams/national-teams.routes').then((m) => m.nationalTeamsRoutes),
  },
  {
    path: 'clubs',
    loadChildren: () => import('./clubs/clubs.routes').then((m) => m.clubsRoutes),
  },
  {
    path: 'persons',
    loadChildren: () => import('./persons/persons.routes').then((m) => m.personsRoutes),
  },
  {
    path: 'competitions',
    loadChildren: () =>
      import('./competitions/competitions.routes').then((m) => m.competitionsRoutes),
  },
  {
    path: 'records',
    loadChildren: () => import('./records/records.routes').then((m) => m.recordsRoutes),
  },
  { path: '', redirectTo: 'sports', pathMatch: 'full' },
];
