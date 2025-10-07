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
import { Record } from '../../../shared/interfaces/record.interface';
import { competitionsActions } from '../../../store/competitions/competitions.actions';
import { competitionsFeature } from '../../../store/competitions/competitions.store';
import { contentTypesActions } from '../../../store/content-types/content-types.actions';
import { contentTypesFeature } from '../../../store/content-types/content-types.store';
import { nationalTeamsActions } from '../../../store/national-teams/national-teams.actions';
import { nationalTeamsFeature } from '../../../store/national-teams/national-teams.store';
import { recordsActions } from '../../../store/records/records.actions';
import { recordsFeature } from '../../../store/records/records.store';
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
  templateUrl: './records-list.component.html',
})
export class RecordsListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly records = this.store.selectSignal(recordsFeature.selectRecords);
  readonly sports = this.store.selectSignal(sportsFeature.selectSports);
  readonly contentTypes = this.store.selectSignal(contentTypesFeature.selectContentTypes);
  readonly nationalTeams = this.store.selectSignal(nationalTeamsFeature.selectNationalTeams);
  readonly competitions = this.store.selectSignal(competitionsFeature.selectCompetitions);
  readonly isLoading = this.store.selectSignal(recordsFeature.selectLoading);

  readonly recordsWithNames = computed(() => {
    const records = this.records() || [];
    const sports = this.sports() || [];
    const contentTypes = this.contentTypes() || [];
    const nationalTeams = this.nationalTeams() || [];
    const competitions = this.competitions() || [];

    return records.map((record) => ({
      ...record,
      sportName: sports.find((s) => s.id === record.sportId)?.name || null,
      contentTypeName: contentTypes.find((c) => c.id === record.contentTypeId)?.name || null,
      nationalTeamName: nationalTeams.find((n) => n.id === record.nationalTeamId)?.name || null,
      competitionName: competitions.find((c) => c.id === record.competitionId)?.name || null,
    }));
  });

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.store.dispatch(recordsActions.loadRecords({}));
    this.store.dispatch(SportsActions.loadSports({}));
    this.store.dispatch(contentTypesActions.loadContentTypes({}));
    this.store.dispatch(nationalTeamsActions.loadNationalTeams({}));
    this.store.dispatch(competitionsActions.loadCompetitions({}));
  }

  addRecord() {
    this.router.navigate(['/cms/records/create']);
  }

  editRecord(record: Record) {
    this.router.navigate(['/cms/records/edit', record.id]);
  }

  deleteRecord(record: Record) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${record.title}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(recordsActions.deleteRecord({ id: record.id }));
      },
    });
  }
}
