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
import { ToastModule } from 'primeng/toast';
import {
  CreatePersonDto,
  FormState,
  UpdatePersonDto,
} from '../../../shared/interfaces/person.interface';
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
    ProgressSpinnerModule,
    DatePickerModule,
  ],
  providers: [],
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

  readonly personForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    nickname: [''],
    birthDate: [null as Date | null, [Validators.required]],
    nationality: ['', [Validators.required]],
  });

  readonly submitButtonText = computed(() =>
    this.isEditMode() ? 'Update Person' : 'Create Person',
  );
  readonly pageTitle = computed(() => (this.isEditMode() ? 'Edit Person' : 'Create New Person'));

  get arePropertiesUnchanged(): boolean {
    return (
      this.personForm.get('firstName')?.value === this.selectedPerson()?.firstName &&
      this.personForm.get('lastName')?.value === this.selectedPerson()?.lastName &&
      this.personForm.get('nickname')?.value === this.selectedPerson()?.nickname &&
      this.personForm.get('birthDate')?.value === this.selectedPerson()?.birthDate &&
      this.personForm.get('nationality')?.value === this.selectedPerson()?.nationality
    );
  }

  constructor() {
    effect(() => {
      const person = this.selectedPerson();
      if (person) {
        const formValue = {
          firstName: person.firstName,
          lastName: person.lastName,
          nickname: person.nickname,
          birthDate: person.birthDate,
          nationality: person.nationality,
        };
        this.personForm.patchValue(formValue);
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

    const formValue = this.personForm.value as FormState;

    if (this.isEditMode()) {
      const updateData: UpdatePersonDto = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        nickname: formValue.nickname,
        birthDate: formValue.birthDate,
        nationality: formValue.nationality,
      };
      this.store.dispatch(
        personsActions.updatePerson({ id: this.personId()!, person: updateData }),
      );
    } else {
      const createData: CreatePersonDto = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        nickname: formValue.nickname,
        birthDate: formValue.birthDate,
        nationality: formValue.nationality,
      };
      this.store.dispatch(personsActions.createPerson({ person: createData }));
    }

    this.navigateToPersonsList();
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
