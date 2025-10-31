import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
import { sportsActions } from '../../../store/sports/sports.actions';
import { sportsFeature } from '../../../store/sports/sports.store';

@Component({
  selector: 'app-sports-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './sports-form.component.html',
})
export class SportsFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = this.store.selectSignal(sportsFeature.selectLoading);
  readonly sportId = signal<string | null>(null);
  readonly selectedSport = this.store.selectSignal(sportsFeature.selectSelectedSport);
  readonly isEditMode = computed(() => this.sportId() !== null);

  readonly sportForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    effect(() => {
      if (this.isEditMode() && this.selectedSport()) {
        untracked(() => {
          this.sportForm.patchValue({
            name: this.selectedSport()?.name,
          });
          this.sportForm.markAsPristine();
        });
      }
    });
  }

  ngOnInit() {
    this.loadSportData();
  }

  private loadSportData() {
    const sportId = this.route.snapshot.paramMap.get('id');
    this.sportId.set(sportId);

    if (sportId) {
      this.store.dispatch(sportsActions.loadSports({ id: sportId }));
    }
  }

  onSubmit() {
    this.markAllFieldsAsTouched();
    if (!this.sportForm.valid) {
      return;
    }

    const formValue = this.sportForm.getRawValue();

    if (this.isEditMode()) {
      this.store.dispatch(
        sportsActions.updateSport({ id: this.sportId()!, sport: { name: formValue.name } }),
      );
    } else {
      this.store.dispatch(sportsActions.createSport({ sport: { name: formValue.name } }));
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.sportForm.controls).forEach((key) => {
      this.sportForm.get(key)?.markAsTouched();
    });
  }

  protected navigateToSportsList() {
    this.router.navigate(['/cms/sports']);
  }
}
