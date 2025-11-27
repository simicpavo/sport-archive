import { computed, inject, Injectable, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { recordsActions } from '../../store/records/records.actions';

@Injectable({
  providedIn: 'root',
})
export class RecordFormService {
  private fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly recordId = signal<string | null>(null);
  readonly isEditMode = computed(() => this.recordId() !== null);
  readonly redirectToCms = signal<boolean>(false);

  public readonly recordsForm = this.fb.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    description: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    date: this.fb.control<Date | null>(null),
    sportId: this.fb.nonNullable.control('', [Validators.required]),
    contentTypeId: this.fb.nonNullable.control('', [Validators.required]),
    competitionId: this.fb.control(''),
    nationalTeamId: this.fb.control(''),
  });

  public submit() {
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
    } else {
      this.store.dispatch(
        recordsActions.createRecord({ record: recordData, redirectToCms: this.redirectToCms() }),
      );
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.recordsForm.controls).forEach((key) => {
      this.recordsForm.get(key)?.markAsTouched();
    });
  }
}
