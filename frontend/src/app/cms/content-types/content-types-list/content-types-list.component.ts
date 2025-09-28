import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ContentType } from '../../../shared/interfaces/content-type.interface';
import { contentTypesActions } from '../../../store/content-types/content-types.actions';
import { contentTypesFeature } from '../../../store/content-types/content-types.store';

@Component({
  selector: 'app-content-types-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './content-types-list.component.html',
})
export class ContentTypesListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly contentTypes = this.store.selectSignal(contentTypesFeature.selectContentTypes);
  readonly isLoading = this.store.selectSignal(contentTypesFeature.selectLoading);

  get contentTypesArray(): ContentType[] {
    return [...(this.contentTypes() || [])];
  }

  ngOnInit() {
    this.store.dispatch(contentTypesActions.loadContentTypes({}));
  }

  addContentType() {
    this.router.navigate(['/cms/content-types/create']);
  }

  editContentType(contentType: ContentType) {
    this.router.navigate(['/cms/content-types/edit', contentType.id]);
  }

  deleteContentType(contentType: ContentType) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${contentType.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(contentTypesActions.deleteContentType({ id: contentType.id }));
      },
    });
  }
}
