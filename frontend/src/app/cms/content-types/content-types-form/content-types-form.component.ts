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
  CreateContentTypeDto,
  FormState,
  UpdateContentTypeDto,
} from '../../../shared/interfaces/content-type.interface';
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
    ProgressSpinnerModule,
  ],
  providers: [],
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

  readonly contentTypeForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly submitButtonText = computed(() =>
    this.isEditMode() ? 'Update Content Type' : 'Create Content Type',
  );
  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Edit Content Type' : 'Create New Content Type',
  );

  ngOnInit() {
    this.loadContentTypeData();
  }

  constructor() {
    effect(() => {
      const contentType = this.selectedContentType();
      if (contentType) {
        const formValue = { name: contentType.name };
        this.contentTypeForm.patchValue(formValue);
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

    const formValue = this.contentTypeForm.value as FormState;

    if (this.isEditMode()) {
      const updateData: UpdateContentTypeDto = { name: formValue.name };
      this.store.dispatch(
        contentTypesActions.updateContentType({
          id: this.contentTypeId()!,
          contentType: updateData,
        }),
      );
    } else {
      const createData: CreateContentTypeDto = { name: formValue.name };
      this.store.dispatch(contentTypesActions.createContentType({ contentType: createData }));
    }

    this.navigateToContentTypesList();
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
