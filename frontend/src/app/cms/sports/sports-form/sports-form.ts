import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  templateUrl: './sports-form.html',
})
export class SportsFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = this.store.selectSignal(sportsFeature.selectLoading);
  readonly sportId = signal<string | null>(null);
  readonly selectedSport = this.store.selectSignal(sportsFeature.selectSelectedSport);
  readonly originalFormValue = signal<FormState>({ name: '' });
  readonly currentFormValue = signal<FormState>({ name: '' });
  readonly isFormValid = signal(false);
  readonly isEditMode = computed(() => this.sportId() !== null);

  readonly sportForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly canSubmit = computed(() => {
    const isValid = this.isFormValid();

    if (!this.isEditMode()) {
      return isValid;
    }

    // In edit mode, check if form is valid and has changes
    const currentValue = this.currentFormValue();
    const originalValue = this.originalFormValue();
    const hasChanges = currentValue.name !== originalValue.name;

    const result = isValid && hasChanges;

    return result;
  });

  readonly submitButtonText = computed(() => (this.isEditMode() ? 'Update Sport' : 'Create Sport'));
  readonly pageTitle = computed(() => (this.isEditMode() ? 'Edit Sport' : 'Create New Sport'));

  ngOnInit() {
    this.loadSportData();
    this.setupFormChangeTracking();
  }

  private setupFormChangeTracking() {
    this.sportForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.currentFormValue.set(value as FormState);
    });

    this.sportForm.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.isFormValid.set(this.sportForm.valid);
    });

    this.currentFormValue.set(this.sportForm.value as FormState);
    this.isFormValid.set(this.sportForm.valid);
  }

  constructor() {
    // Effect to watch selectedSport changes
    effect(() => {
      const sport = this.selectedSport();
      if (sport) {
        const formValue = { name: sport.name };
        this.sportForm.patchValue(formValue);
        this.originalFormValue.set(formValue);
        this.currentFormValue.set(formValue);
        this.sportForm.markAsPristine();
      }
    });
  }

  private loadSportData() {
    const sportId = this.route.snapshot.paramMap.get('id');
    this.sportId.set(sportId);

    if (sportId) {
      this.store.dispatch(SportsActions.loadSports({ id: sportId }));
    }
  }

  onSubmit() {
    if (!this.canSubmit()) {
      this.markAllFieldsAsTouched();
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

  onCancel() {
    this.navigateToSportsList();
  }

  // Form validation helpers
  isFieldInvalid(fieldName: keyof FormState): boolean {
    const field = this.sportForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: keyof FormState): string {
    const field = this.sportForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.sportForm.controls).forEach((key) => {
      this.sportForm.get(key)?.markAsTouched();
    });
  }

  private getFieldDisplayName(fieldName: keyof FormState): string {
    const displayNames: Record<keyof FormState, string> = {
      name: 'Name',
    };
    return displayNames[fieldName];
  }

  private navigateToSportsList() {
    this.router.navigate(['/cms/sports']);
  }
}
