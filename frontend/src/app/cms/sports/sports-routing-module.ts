import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SportsFormComponent } from './sports-form/sports-form';
import { SportsListComponent } from './sports-list/sports-list';

const routes: Routes = [
  { path: '', component: SportsListComponent },
  { path: 'create', component: SportsFormComponent },
  { path: 'edit/:id', component: SportsFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SportsRoutingModule {}
