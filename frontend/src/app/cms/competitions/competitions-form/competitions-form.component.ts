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
import { FormState } from '../../../shared/interfaces/competition.interface';
import { competitionsActions } from '../../../store/competitions/competitions.actions';
import { competitionsFeature } from '../../../store/competitions/competitions.store';
import { sportsActions } from '../../../store/sports/sports.actions';
import { sportsFeature } from '../../../store/sports/sports.store';

@Component({
  selector: 'app-competitions-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './competitions-form.component.html',
})
export class CompetitionsFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = this.store.selectSignal(competitionsFeature.selectLoading);
  readonly competitionId = signal<string | null>(null);
  readonly selectedCompetition = this.store.selectSignal(
    competitionsFeature.selectSelectedCompetition,
  );
  readonly isEditMode = computed(() => this.competitionId() !== null);
  readonly sports = this.store.selectSignal(sportsFeature.selectSports);

  readonly competitionForm = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    season: this.fb.nonNullable.control(''),
    startDate: this.fb.control<Date | null>(null),
    endDate: this.fb.control<Date | null>(null),
    sportId: this.fb.nonNullable.control('', [Validators.required]),
  });

  constructor() {
    effect(() => {
      if (this.selectedCompetition() && this.isEditMode()) {
        setTimeout(() => {
          this.competitionForm.patchValue({
            name: this.selectedCompetition()?.name,
            season: this.selectedCompetition()?.season,
            startDate: this.selectedCompetition()?.startDate,
            endDate: this.selectedCompetition()?.endDate,
            sportId: this.selectedCompetition()?.sportId,
          });
          this.competitionForm.markAsPristine();
        });
      }
    });
  }

  ngOnInit() {
    this.loadCompetitionData();
  }

  private loadCompetitionData() {
    const competitionId = this.route.snapshot.paramMap.get('id');
    this.competitionId.set(competitionId);

    this.store.dispatch(sportsActions.loadSports({}));

    if (competitionId) {
      this.store.dispatch(competitionsActions.loadCompetitions({ id: competitionId }));
    }
  }

  onSubmit() {
    this.markAllFieldsAsTouched();
    if (!this.competitionForm.valid) {
      return;
    }

    const formValue = this.competitionForm.value as FormState;

    if (this.isEditMode()) {
      this.store.dispatch(
        competitionsActions.updateCompetition({
          id: this.competitionId()!,
          competition: {
            name: formValue.name,
            season: formValue.season,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            sportId: formValue.sportId,
          },
        }),
      );
    } else {
      this.store.dispatch(
        competitionsActions.createCompetition({
          competition: {
            name: formValue.name,
            season: formValue.season,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            sportId: formValue.sportId,
          },
        }),
      );
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.competitionForm.controls).forEach((key) => {
      this.competitionForm.get(key)?.markAsTouched();
    });
  }

  protected navigateToCompetitionsList() {
    this.router.navigate(['/cms/competitions']);
  }
}
