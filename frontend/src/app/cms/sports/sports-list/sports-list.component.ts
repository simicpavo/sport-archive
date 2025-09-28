import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Sport } from '../../../shared/interfaces/sport.interface';
import { SportsActions } from '../../../store/sports/sports.actions';
import { sportsFeature } from '../../../store/sports/sports.store';

@Component({
  selector: 'app-sports-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './sports-list.component.html',
})
export class SportsListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly sports = this.store.selectSignal(sportsFeature.selectSports);
  readonly isLoading = this.store.selectSignal(sportsFeature.selectLoading);

  get sportsArray(): Sport[] {
    return [...(this.sports() || [])];
  }

  ngOnInit() {
    this.store.dispatch(SportsActions.loadSports({}));
  }

  addSport() {
    this.router.navigate(['/cms/sports/create']);
  }

  editSport(sport: Sport) {
    this.router.navigate(['/cms/sports/edit', sport.id]);
  }

  deleteSport(sport: Sport) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${sport.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(SportsActions.deleteSport({ id: sport.id }));
      },
    });
  }
}
