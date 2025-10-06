import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Competition } from '../../../shared/interfaces/competition.interface';
import { competitionsActions } from '../../../store/competitions/competitions.actions';
import { competitionsFeature } from '../../../store/competitions/competitions.store';
import { SportsActions } from '../../../store/sports/sports.actions';
import { sportsFeature } from '../../../store/sports/sports.store';

@Component({
  selector: 'app-competitions-list',
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
  templateUrl: './competitions-list.component.html',
})
export class CompetitionsListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly competitions = this.store.selectSignal(competitionsFeature.selectCompetitions);
  readonly sports = this.store.selectSignal(sportsFeature.selectSports);
  readonly isLoading = this.store.selectSignal(competitionsFeature.selectLoading);

  readonly competitionsWithSportNames = computed(() => {
    const competitions = this.competitions() || [];
    const sports = this.sports() || [];

    return competitions.map((competition) => ({
      ...competition,
      sportName: sports.find((s) => s.id === competition.sportId)?.name || 'Unknown Sport',
    }));
  });

  ngOnInit() {
    this.store.dispatch(competitionsActions.loadCompetitions({}));
    this.store.dispatch(SportsActions.loadSports({}));
  }

  addCompetition() {
    this.router.navigate(['/cms/competitions/create']);
  }

  editCompetition(competition: Competition) {
    this.router.navigate(['/cms/competitions/edit', competition.id]);
  }

  deleteCompetition(competition: Competition) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${competition.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(competitionsActions.deleteCompetition({ id: competition.id }));
      },
    });
  }
}
