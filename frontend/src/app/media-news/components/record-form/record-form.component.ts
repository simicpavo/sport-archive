import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MediaNews } from '../../../models/media-news.interface';
import { RecordFormService } from '../../../services/forms/record-form.service';
import { competitionsFeature } from '../../../store/competitions/competitions.store';
import { contentTypesFeature } from '../../../store/content-types/content-types.store';
import { nationalTeamsFeature } from '../../../store/national-teams/national-teams.store';
import { recordsActions } from '../../../store/records/records.actions';
import { recordsFeature } from '../../../store/records/records.store';
import { sportsFeature } from '../../../store/sports/sports.store';

@Component({
  selector: 'app-record-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    CardModule,
  ],
  templateUrl: './record-form.component.html',
  providers: [RecordFormService],
})
export class RecordFormComponent implements OnInit {
  newsItem = input<MediaNews | null>(null);
  closed = output<void>();

  private readonly store = inject(Store);
  private readonly recordFormService = inject(RecordFormService);

  readonly recordsForm = this.recordFormService.recordsForm;
  readonly isSaving = this.store.selectSignal(recordsFeature.selectSaving);

  readonly sports = this.store.selectSignal(sportsFeature.selectSports);
  readonly contentTypes = this.store.selectSignal(contentTypesFeature.selectContentTypes);
  readonly competitions = this.store.selectSignal(competitionsFeature.selectCompetitions);
  readonly nationalTeams = this.store.selectSignal(nationalTeamsFeature.selectNationalTeams);

  constructor() {
    effect(() => {
      const item = this.newsItem();
      if (item) {
        this.recordsForm.patchValue({
          title: item.title ?? '',
          description: item.content ?? '',
        });
        this.recordsForm.markAsPristine();
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(
      recordsActions.initializeRecordForm({
        recordId: undefined,
      }),
    );
  }

  onSubmit() {
    this.recordFormService.submit();
  }

  onCancel() {
    this.closed.emit();
  }
}
