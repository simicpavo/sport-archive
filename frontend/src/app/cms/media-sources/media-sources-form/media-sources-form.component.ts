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
  CreateMediaSourceDto,
  FormState,
  UpdateMediaSourceDto,
} from '../../../shared/interfaces/media-source.interface';
import { mediaSourcesActions } from '../../../store/media-sources/media-sources.actions';
import { mediaSourcesFeature } from '../../../store/media-sources/media-sources.store';

@Component({
  selector: 'app-media-sources-form',
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
  templateUrl: './media-sources-form.component.html',
})
export class MediaSourcesFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = this.store.selectSignal(mediaSourcesFeature.selectLoading);
  readonly mediaSourceId = signal<string | null>(null);
  readonly selectedMediaSource = this.store.selectSignal(
    mediaSourcesFeature.selectSelectedMediaSource,
  );
  readonly isEditMode = computed(() => this.mediaSourceId() !== null);

  readonly mediaSourceForm = this.fb.group({
    baseUrl: ['', [Validators.required, Validators.minLength(2)]],
    urlPath: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly submitButtonText = computed(() =>
    this.isEditMode() ? 'Update Media Source' : 'Create Media Source',
  );
  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Edit Media Source' : 'Create New Media Source',
  );

  ngOnInit() {
    this.loadMediaSourceData();
  }

  constructor() {
    effect(() => {
      const mediaSource = this.selectedMediaSource();
      if (mediaSource) {
        const formValue = {
          baseUrl: mediaSource.baseUrl,
          urlPath: mediaSource.urlPath,
          name: mediaSource.name,
        };
        this.mediaSourceForm.patchValue(formValue);
        this.mediaSourceForm.markAsPristine();
      }
    });
  }

  private loadMediaSourceData() {
    const mediaSourceId = this.route.snapshot.paramMap.get('id');
    this.mediaSourceId.set(mediaSourceId);

    if (mediaSourceId) {
      this.store.dispatch(mediaSourcesActions.loadMediaSources({ id: mediaSourceId }));
    }
  }

  onSubmit() {
    this.markAllFieldsAsTouched();
    if (!this.mediaSourceForm.valid) {
      return;
    }

    const formValue = this.mediaSourceForm.value as FormState;

    if (this.isEditMode()) {
      const updateData: UpdateMediaSourceDto = {
        baseUrl: formValue.baseUrl,
        urlPath: formValue.urlPath,
        name: formValue.name,
      };
      this.store.dispatch(
        mediaSourcesActions.updateMediaSource({
          id: this.mediaSourceId()!,
          mediaSource: updateData,
        }),
      );
    } else {
      const createData: CreateMediaSourceDto = {
        baseUrl: formValue.baseUrl,
        urlPath: formValue.urlPath,
        name: formValue.name,
      };
      this.store.dispatch(mediaSourcesActions.createMediaSource({ mediaSource: createData }));
    }

    this.navigateToMediaSourcesList();
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.mediaSourceForm.controls).forEach((key) => {
      this.mediaSourceForm.get(key)?.markAsTouched();
    });
  }

  protected navigateToMediaSourcesList() {
    this.router.navigate(['/cms/media-sources']);
  }
}
