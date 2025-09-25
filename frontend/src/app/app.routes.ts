import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/news',
    pathMatch: 'full',
  },
  {
    path: 'news',
    loadComponent: () =>
      import('./media-news/media-news.component').then((m) => m.MediaNewsComponent),
  },
  {
    path: 'cms',
    loadChildren: () => import('./cms/cms-module').then((m) => m.CmsModule),
  },
  {
    path: '**',
    redirectTo: '/news',
  },
];
