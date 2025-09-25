import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sports',
    loadChildren: () => import('./sports/sports-module').then((m) => m.SportsModule),
  },
  { path: '', redirectTo: 'sports', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsRoutingModule {}
