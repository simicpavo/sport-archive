import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import {
  CreateSportDto,
  FormState,
  UpdateSportDto,
} from '../../../shared/interfaces/sport.interface';
import { SportsActions } from '../../../store/sports/sports.actions';
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
    ProgressSpinnerModule,
  ],
  providers: [],
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

  readonly sportForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly submitButtonText = computed(() => (this.isEditMode() ? 'Update Sport' : 'Create Sport'));
  readonly pageTitle = computed(() => (this.isEditMode() ? 'Edit Sport' : 'Create New Sport'));

  get isNameUnchanged(): boolean {
    return this.sportForm.get('name')?.value === this.selectedSport()?.name;
  }

  constructor() {
    effect(() => {
      const sport = this.selectedSport();
      if (sport) {
        const formValue = { name: sport.name };
        this.sportForm.patchValue(formValue);
        this.sportForm.markAsPristine();
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
      this.store.dispatch(SportsActions.loadSports({ id: sportId }));
    }
  }

  onSubmit() {
    this.markAllFieldsAsTouched();
    if (!this.sportForm.valid) {
      return;
    }

    const formValue = this.sportForm.value as FormState;

    if (this.isEditMode()) {
      const updateData: UpdateSportDto = { name: formValue.name };
      this.store.dispatch(SportsActions.updateSport({ id: this.sportId()!, sport: updateData }));
    } else {
      const createData: CreateSportDto = { name: formValue.name };
      this.store.dispatch(SportsActions.createSport({ sport: createData }));
    }

    this.navigateToSportsList();
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
