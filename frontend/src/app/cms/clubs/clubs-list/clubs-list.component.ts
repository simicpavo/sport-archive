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
import { Club } from '../../../shared/interfaces/club.interface';
import { clubsActions } from '../../../store/clubs/clubs.actions';
import { clubsFeature } from '../../../store/clubs/clubs.store';
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
  templateUrl: './clubs-list.component.html',
})
export class ClubsListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly clubs = this.store.selectSignal(clubsFeature.selectClubs);
  readonly sports = this.store.selectSignal(sportsFeature.selectSports);
  readonly isLoading = this.store.selectSignal(clubsFeature.selectLoading);

  readonly clubsWithSportNames = computed(() => {
    const clubs = this.clubs() || [];
    const sports = this.sports() || [];

    return clubs.map((club) => ({
      ...club,
      sportName: sports.find((s) => s.id === club.sportId)?.name || 'Unknown club',
    }));
  });

  ngOnInit() {
    this.store.dispatch(clubsActions.loadClubs({}));
    this.store.dispatch(SportsActions.loadSports({}));
  }

  addClub() {
    this.router.navigate(['/cms/clubs/create']);
  }

  editClub(club: Club) {
    this.router.navigate(['/cms/clubs/edit', club.id]);
  }

  deleteClub(club: Club) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${club.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(clubsActions.deleteClub({ id: club.id }));
      },
    });
  }
}
