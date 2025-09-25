import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';
import { CreateSportDto, FormState, UpdateSportDto } from '../sport.interface';
import { SportsService } from '../sports.service';

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
  providers: [MessageService],
  templateUrl: './sports-form.html',
})
export class SportsFormComponent implements OnInit {
  private readonly sportsService = inject(SportsService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly sportId = signal<string | null>(null);
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

  private loadSportData() {
    const sportId = this.route.snapshot.paramMap.get('id');
    this.sportId.set(sportId);

    if (sportId) {
      this.isLoading.set(true);

      this.sportsService
        .getSportById(sportId)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.isLoading.set(false)),
        )
        .subscribe({
          next: (sport) => {
            const formValue = { name: sport.name };
            this.sportForm.patchValue(formValue);
            this.originalFormValue.set(formValue); // Store original value
            this.currentFormValue.set(formValue); // Set current value
            this.sportForm.markAsPristine();
          },
          error: (error) => {
            console.error('Error loading sport:', error);
            this.showErrorMessage('Failed to load sport data');
          },
        });
    }
  }

  onSubmit() {
    if (!this.canSubmit()) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.sportForm.value as FormState;

    const operation$ = this.isEditMode()
      ? this.updateSport(formValue)
      : this.createSport(formValue);

    operation$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          const message = this.isEditMode()
            ? 'Sport updated successfully'
            : 'Sport created successfully';
          this.showSuccessMessage(message);
          this.navigateToSportsList();
        },
        error: (error) => {
          console.error('Error saving sport:', error);
          const message = this.isEditMode() ? 'Failed to update sport' : 'Failed to create sport';
          this.showErrorMessage(message);
        },
      });
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

  // Private helper methods
  private createSport(formValue: FormState) {
    const createData: CreateSportDto = {
      name: formValue.name,
    };
    return this.sportsService.createSport(createData);
  }

  private updateSport(formValue: FormState) {
    const updateData: UpdateSportDto = {
      name: formValue.name,
    };
    return this.sportsService.updateSport(this.sportId()!, updateData);
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

  private showSuccessMessage(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail,
    });
  }

  private showErrorMessage(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail,
    });
  }

  private navigateToSportsList() {
    this.router.navigate(['/cms/sports']);
  }
}
