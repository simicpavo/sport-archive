import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./media-news/media-news.component').then((m) => m.MediaNewsComponent),
      },
      {
        path: 'cms',
        loadChildren: () => import('./cms/cms.routes').then((m) => m.cmsRoutes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
