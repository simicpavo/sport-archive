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
import { Record } from '../../../shared/interfaces/record.interface';
import { recordsActions } from '../../../store/records/records.actions';
import { recordsFeature } from '../../../store/records/records.store';

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
    TableEmptyMessageComponent,
    PageHeaderComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './records-list.component.html',
})
export class RecordsListComponent implements OnInit {
  private readonly store = inject(Store);
  protected readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly records = this.store.selectSignal(recordsFeature.selectRecords);
  readonly isLoading = this.store.selectSignal(recordsFeature.selectLoading);

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.store.dispatch(recordsActions.loadRecords({}));
  }

  addRecord() {
    this.router.navigate(['/cms/records/create']);
  }

  editRecord(record: Record) {
    this.router.navigate(['/cms/records/edit', record.id]);
  }

  deleteRecord(record: Record) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${record.title}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(recordsActions.deleteRecord({ id: record.id }));
      },
    });
  }
}
