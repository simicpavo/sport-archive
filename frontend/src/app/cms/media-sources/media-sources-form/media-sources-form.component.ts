import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
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
    LoadingSpinnerComponent,
  ],
  templateUrl: './media-sources-form.component.html',
})
export class MediaSourcesFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);

  readonly isLoading = this.store.selectSignal(mediaSourcesFeature.selectLoading);
  readonly mediaSourceId = signal<string | null>(null);
  readonly selectedMediaSource = this.store.selectSignal(
    mediaSourcesFeature.selectSelectedMediaSource,
  );
  readonly isEditMode = computed(() => this.mediaSourceId() !== null);

  readonly mediaSourceForm = this.fb.nonNullable.group({
    baseUrl: ['', [Validators.required, Validators.minLength(2)]],
    urlPath: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit() {
    this.loadMediaSourceData();
  }

  constructor() {
    effect(() => {
      if (this.selectedMediaSource() && this.isEditMode()) {
        untracked(() => {
          this.mediaSourceForm.patchValue({
            baseUrl: this.selectedMediaSource()?.baseUrl,
            urlPath: this.selectedMediaSource()?.urlPath,
            name: this.selectedMediaSource()?.name,
          });
        });
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

    const formValue = this.mediaSourceForm.getRawValue();

    if (this.isEditMode()) {
      this.store.dispatch(
        mediaSourcesActions.updateMediaSource({
          id: this.mediaSourceId()!,
          mediaSource: {
            baseUrl: formValue.baseUrl,
            urlPath: formValue.urlPath,
            name: formValue.name,
          },
        }),
      );
    } else {
      this.store.dispatch(
        mediaSourcesActions.createMediaSource({
          mediaSource: {
            baseUrl: formValue.baseUrl,
            urlPath: formValue.urlPath,
            name: formValue.name,
          },
        }),
      );
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.mediaSourceForm.controls).forEach((key) => {
      this.mediaSourceForm.get(key)?.markAsTouched();
    });
  }
}
