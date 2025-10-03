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
import { NationalTeam } from '../../../shared/interfaces/national-team.interface';
import { nationalTeamsActions } from '../../../store/national-teams/national-teams.actions';
import { nationalTeamsFeature } from '../../../store/national-teams/national-teams.store';
import { SportsActions } from '../../../store/sports/sports.actions';
import { sportsFeature } from '../../../store/sports/sports.store';

@Component({
  selector: 'app-content-types-list',
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
  templateUrl: './national-teams-list.component.html',
})
export class NationalTeamsListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly nationalTeams = this.store.selectSignal(nationalTeamsFeature.selectNationalTeams);
  readonly sports = this.store.selectSignal(sportsFeature.selectSports);
  readonly isLoading = this.store.selectSignal(nationalTeamsFeature.selectLoading);

  readonly nationalTeamsWithSportNames = computed(() => {
    const teams = this.nationalTeams() || [];
    const sports = this.sports() || [];

    return teams.map((team) => ({
      ...team,
      sportName: sports.find((s) => s.id === team.sportId)?.name || 'Unknown Sport',
    }));
  });

  ngOnInit() {
    this.store.dispatch(nationalTeamsActions.loadNationalTeams({}));
    this.store.dispatch(SportsActions.loadSports({}));
  }

  addNationalTeam() {
    this.router.navigate(['/cms/national-teams/create']);
  }

  editNationalTeam(nationalTeam: NationalTeam) {
    this.router.navigate(['/cms/national-teams/edit', nationalTeam.id]);
  }

  deleteNationalTeam(nationalTeam: NationalTeam) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${nationalTeam.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(nationalTeamsActions.deleteNationalTeam({ id: nationalTeam.id }));
      },
    });
  }
}
