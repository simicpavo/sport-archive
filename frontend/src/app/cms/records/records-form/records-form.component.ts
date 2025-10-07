import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import {
  CreateRecordDto,
  FormState,
  UpdateRecordDto,
} from '../../../shared/interfaces/record.interface';
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
  selector: 'app-national-teams-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    SelectModule,
    DatePickerModule,
  ],
  templateUrl: './records-form.component.html',
})
export class RecordsFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = this.store.selectSignal(recordsFeature.selectLoading);
  readonly recordId = signal<string | null>(null);
  readonly isEditMode = computed(() => this.recordId() !== null);
  readonly selectedRecord = this.store.selectSignal(recordsFeature.selectSelectedRecord);
  readonly sports = this.store.selectSignal(sportsFeature.selectSports);
  readonly contentTypes = this.store.selectSignal(contentTypesFeature.selectContentTypes);
  readonly competitions = this.store.selectSignal(competitionsFeature.selectCompetitions);
  readonly nationalTeams = this.store.selectSignal(nationalTeamsFeature.selectNationalTeams);

  readonly recordsForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(2)]],
    date: [null as Date | null],
    sportId: ['', [Validators.required]],
    competitionId: [''],
    nationalTeamId: [''],
    contentTypeId: ['', [Validators.required]],
  });

  readonly submitButtonText = computed(() =>
    this.isEditMode() ? 'Update Record' : 'Create Record',
  );
  readonly pageTitle = computed(() => (this.isEditMode() ? 'Edit Record' : 'Create New Record'));

  ngOnInit() {
    this.loadRecordData();
  }

  constructor() {
    effect(() => {
      const record = this.selectedRecord();
      if (record && this.isEditMode()) {
        const formValue = {
          title: record.title,
          description: record.description,
          sportId: record.sportId,
          competitionId: record.competitionId,
          nationalTeamId: record.nationalTeamId,
          contentTypeId: record.contentTypeId,
          date: record.date,
        };

        setTimeout(() => {
          this.recordsForm.patchValue(formValue);
          this.recordsForm.markAsPristine();
        });
      }
    });
  }

  private loadRecordData() {
    const recordId = this.route.snapshot.paramMap.get('id');
    this.recordId.set(recordId);

    this.store.dispatch(SportsActions.loadSports({}));
    this.store.dispatch(competitionsActions.loadCompetitions({}));
    this.store.dispatch(nationalTeamsActions.loadNationalTeams({}));
    this.store.dispatch(contentTypesActions.loadContentTypes({}));

    if (recordId) {
      this.store.dispatch(recordsActions.loadRecords({ id: recordId }));
    }
  }

  onSubmit() {
    this.markAllFieldsAsTouched();
    if (!this.recordsForm.valid) {
      return;
    }

    const formValue = this.recordsForm.value as FormState;

    if (this.isEditMode()) {
      const updateData: UpdateRecordDto = {
        title: formValue.title,
        description: formValue.description,
        sportId: formValue.sportId,
        competitionId: formValue.competitionId,
        nationalTeamId: formValue.nationalTeamId,
        contentTypeId: formValue.contentTypeId,
        date: formValue.date,
      };
      this.store.dispatch(
        recordsActions.updateRecord({
          id: this.recordId()!,
          record: updateData,
        }),
      );
    } else {
      const createData: CreateRecordDto = {
        title: formValue.title,
        description: formValue.description,
        sportId: formValue.sportId,
        competitionId: formValue.competitionId,
        nationalTeamId: formValue.nationalTeamId,
        contentTypeId: formValue.contentTypeId,
        date: formValue.date,
      };
      this.store.dispatch(recordsActions.createRecord({ record: createData }));
    }

    setTimeout(() => {
      this.navigateToRecordsList();
    }, 100);
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.recordsForm.controls).forEach((key) => {
      this.recordsForm.get(key)?.markAsTouched();
    });
  }

  protected navigateToRecordsList() {
    this.router.navigate(['/cms/records']).then(() => {
      this.store.dispatch(recordsActions.loadRecords({}));
    });
  }
}
