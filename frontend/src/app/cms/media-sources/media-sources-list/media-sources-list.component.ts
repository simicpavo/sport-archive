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
import { TableEmptyMessageComponent } from '../../../shared/components/empty-message.component';
import { PageHeaderComponent } from '../../../shared/components/header.component';
import { NavigationSidebarComponent } from '../../../shared/components/navigation-sidebar.component';
import { MediaSource } from '../../../shared/interfaces/media-source.interface';
import { mediaSourcesActions } from '../../../store/media-sources/media-sources.actions';
import { mediaSourcesFeature } from '../../../store/media-sources/media-sources.store';

@Component({
  selector: 'app-media-sources-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    TableEmptyMessageComponent,
    PageHeaderComponent,
    NavigationSidebarComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './media-sources-list.component.html',
})
export class MediaSourcesListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly mediaSources = this.store.selectSignal(mediaSourcesFeature.selectMediaSources);
  readonly isLoading = this.store.selectSignal(mediaSourcesFeature.selectLoading);

  ngOnInit() {
    this.store.dispatch(mediaSourcesActions.loadMediaSources({}));
  }

  addMediaSource() {
    this.router.navigate(['/cms/media-sources/create']);
  }

  editMediaSource(mediaSource: MediaSource) {
    this.router.navigate(['/cms/media-sources/edit', mediaSource.id]);
  }

  deleteMediaSource(mediaSource: MediaSource) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${mediaSource.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(mediaSourcesActions.deleteMediaSource({ id: mediaSource.id }));
      },
    });
  }
}
