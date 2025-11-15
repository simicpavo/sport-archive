import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
import { CreateRecordDto } from '../../../shared/interfaces/record.interface';
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
    ToastModule,
    LoadingSpinnerComponent,
    SelectModule,
    DatePickerModule,
    TextareaModule,
  ],
  templateUrl: './records-form.component.html',
})
export class RecordsFormComponent implements OnInit {
  initialData = input<{ title?: string; description?: string } | null>(null);
  recordSaved = output<CreateRecordDto>();
  recordCancelled = output<void>();

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
    title: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    description: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    date: this.fb.control<Date | null>(null),
    sportId: this.fb.nonNullable.control('', [Validators.required]),
    contentTypeId: this.fb.nonNullable.control('', [Validators.required]),
    competitionId: this.fb.control(''),
    nationalTeamId: this.fb.control(''),
  });

  ngOnInit() {
    this.loadRecordData();
  }

  constructor() {
    effect(() => {
      const initial = this.initialData();
      if (initial) {
        untracked(() => {
          this.recordsForm.patchValue({
            title: initial.title || '',
            description: initial.description || '',
          });
        });
      }
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
    this.markAllFieldsAsTouched();
    if (!this.recordsForm.valid) {
      return;
    }

    const formValue = this.recordsForm.getRawValue();

    const recordData = {
      title: formValue.title,
      description: formValue.description,
      sportId: formValue.sportId,
      competitionId: formValue.competitionId || undefined,
      nationalTeamId: formValue.nationalTeamId || undefined,
      contentTypeId: formValue.contentTypeId,
      date: formValue.date || undefined,
    };

    if (this.isEditMode()) {
      this.store.dispatch(
        recordsActions.updateRecord({
          id: this.recordId()!,
          record: recordData,
        }),
      );
    } else if (this.initialData()) {
      this.recordSaved.emit(recordData);
    } else {
      this.store.dispatch(recordsActions.createRecord({ record: recordData }));
    }
  }

  cancelClick(): void {
    if (this.initialData()) {
      this.recordCancelled.emit();
    } else {
      this.router.navigate(['/cms/records']);
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.recordsForm.controls).forEach((key) => {
      this.recordsForm.get(key)?.markAsTouched();
    });
  }
}
