import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, untracked } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { RecordFormService } from '../../../services/forms/record-form.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
import { competitionsFeature } from '../../../store/competitions/competitions.store';
import { contentTypesFeature } from '../../../store/content-types/content-types.store';
import { nationalTeamsFeature } from '../../../store/national-teams/national-teams.store';
import { recordsActions } from '../../../store/records/records.actions';
import { recordsFeature } from '../../../store/records/records.store';
import { sportsFeature } from '../../../store/sports/sports.store';

@Component({
  selector: 'app-records-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    LoadingSpinnerComponent,
    SelectModule,
    DatePickerModule,
    TextareaModule,
  ],
  templateUrl: './records-form.component.html',
  providers: [RecordFormService],
})
export class RecordsFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  private readonly recordFormService = inject(RecordFormService);

  readonly isLoading = this.store.selectSignal(recordsFeature.selectLoading);
  readonly isSaving = this.store.selectSignal(recordsFeature.selectSaving);
  readonly selectedRecord = this.store.selectSignal(recordsFeature.selectSelectedRecord);
  readonly recordId = this.recordFormService.recordId;
  readonly isEditMode = this.recordFormService.isEditMode;
  readonly sports = this.store.selectSignal(sportsFeature.selectSports);
  readonly contentTypes = this.store.selectSignal(contentTypesFeature.selectContentTypes);
  readonly competitions = this.store.selectSignal(competitionsFeature.selectCompetitions);
  readonly nationalTeams = this.store.selectSignal(nationalTeamsFeature.selectNationalTeams);

  readonly recordsForm = this.recordFormService.recordsForm;

  ngOnInit() {
    this.recordFormService.redirectToCms.set(true);
    this.loadRecordData();
  }

  constructor() {
    effect(() => {
      if (this.selectedRecord() && this.isEditMode()) {
        untracked(() => {
          this.recordsForm.patchValue({
            title: this.selectedRecord()?.title,
            description: this.selectedRecord()?.description,
            date: this.selectedRecord()?.date ? new Date(this.selectedRecord()!.date!) : null,
            sportId: this.selectedRecord()?.sportId,
            competitionId: this.selectedRecord()?.competitionId,
            nationalTeamId: this.selectedRecord()?.nationalTeamId,
            contentTypeId: this.selectedRecord()?.contentTypeId,
          });
        });
        this.recordsForm.markAsPristine();
      }
    });
  }

  private loadRecordData() {
    const recordId = this.route.snapshot.paramMap.get('id');
    this.recordId.set(recordId);

    this.store.dispatch(recordsActions.initializeRecordForm({ recordId: recordId ?? undefined }));
  }

  onSubmit() {
    this.recordFormService.submit();
  }
}
