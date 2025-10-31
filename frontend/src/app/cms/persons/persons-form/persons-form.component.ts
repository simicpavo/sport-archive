import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
import { personsActions } from '../../../store/persons/persons.actions';
import { personsFeature } from '../../../store/persons/persons.store';

@Component({
  selector: 'app-persons-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    LoadingSpinnerComponent,
    DatePickerModule,
  ],
  templateUrl: './persons-form.component.html',
})
export class PersonsFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = this.store.selectSignal(personsFeature.selectLoading);
  readonly personId = signal<string | null>(null);
  readonly selectedPerson = this.store.selectSignal(personsFeature.selectSelectedPerson);
  readonly isEditMode = computed(() => this.personId() !== null);

  readonly personForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    nickname: [''],
    birthDate: new FormControl<Date | null>(null, [Validators.required]),
    nationality: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      if (this.selectedPerson() && this.isEditMode()) {
        untracked(() => {
          this.personForm.patchValue({
            firstName: this.selectedPerson()?.firstName,
            lastName: this.selectedPerson()?.lastName,
            nickname: this.selectedPerson()?.nickname,
            birthDate: this.selectedPerson()?.birthDate
              ? new Date(this.selectedPerson()!.birthDate)
              : null,
            nationality: this.selectedPerson()?.nationality,
          });
        });
        this.personForm.markAsPristine();
      }
    });
  }

  ngOnInit() {
    this.loadPersonData();
  }

  private loadPersonData() {
    const personId = this.route.snapshot.paramMap.get('id');
    this.personId.set(personId);

    if (personId) {
      this.store.dispatch(personsActions.loadPersons({ id: personId }));
    }
  }

  onSubmit() {
    this.markAllFieldsAsTouched();
    if (!this.personForm.valid) {
      return;
    }

    const formValue = this.personForm.getRawValue();

    const personData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      nickname: formValue.nickname,
      birthDate: formValue.birthDate!,
      nationality: formValue.nationality,
    };

    if (this.isEditMode()) {
      this.store.dispatch(
        personsActions.updatePerson({
          id: this.personId()!,
          person: personData,
        }),
      );
    } else {
      this.store.dispatch(
        personsActions.createPerson({
          person: personData,
        }),
      );
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.personForm.controls).forEach((key) => {
      this.personForm.get(key)?.markAsTouched();
    });
  }

  protected navigateToPersonsList() {
    this.router.navigate(['/cms/persons']);
  }
}
