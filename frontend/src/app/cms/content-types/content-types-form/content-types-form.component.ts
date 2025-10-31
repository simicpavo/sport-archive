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
import { contentTypesActions } from '../../../store/content-types/content-types.actions';
import { contentTypesFeature } from '../../../store/content-types/content-types.store';

@Component({
  selector: 'app-content-types-form',
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
  templateUrl: './content-types-form.component.html',
})
export class ContentTypesFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = this.store.selectSignal(contentTypesFeature.selectLoading);
  readonly contentTypeId = signal<string | null>(null);
  readonly selectedContentType = this.store.selectSignal(
    contentTypesFeature.selectSelectedContentType,
  );
  readonly isEditMode = computed(() => this.contentTypeId() !== null);

  readonly contentTypeForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit() {
    this.loadContentTypeData();
  }

  constructor() {
    effect(() => {
      if (this.selectedContentType() && this.isEditMode()) {
        untracked(() => {
          this.contentTypeForm.patchValue({
            name: this.selectedContentType()!.name,
          });
        });
        this.contentTypeForm.markAsPristine();
      }
    });
  }

  private loadContentTypeData() {
    const contentTypeId = this.route.snapshot.paramMap.get('id');
    this.contentTypeId.set(contentTypeId);

    if (contentTypeId) {
      this.store.dispatch(contentTypesActions.loadContentTypes({ id: contentTypeId }));
    }
  }

  onSubmit() {
    this.markAllFieldsAsTouched();
    if (!this.contentTypeForm.valid) {
      return;
    }

    const formValue = this.contentTypeForm.getRawValue();

    if (this.isEditMode()) {
      this.store.dispatch(
        contentTypesActions.updateContentType({
          id: this.contentTypeId()!,
          contentType: { name: formValue.name },
        }),
      );
    } else {
      this.store.dispatch(
        contentTypesActions.createContentType({ contentType: { name: formValue.name } }),
      );
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.contentTypeForm.controls).forEach((key) => {
      this.contentTypeForm.get(key)?.markAsTouched();
    });
  }

  protected navigateToContentTypesList() {
    this.router.navigate(['/cms/content-types']);
  }
}
