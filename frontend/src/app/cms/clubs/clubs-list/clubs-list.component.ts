import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TableEmptyMessageComponent } from '../../../shared/components/empty-message.component';
import { PageHeaderComponent } from '../../../shared/components/header.component';
import { Club } from '../../../shared/interfaces/club.interface';
import { clubsActions } from '../../../store/clubs/clubs.actions';
import { clubsFeature } from '../../../store/clubs/clubs.store';

@Component({
  selector: 'app-clubs-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    TooltipModule,
    PageHeaderComponent,
    TableEmptyMessageComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './clubs-list.component.html',
})
export class ClubsListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly clubs = this.store.selectSignal(clubsFeature.selectClubs);
  readonly isLoading = this.store.selectSignal(clubsFeature.selectLoading);

  ngOnInit() {
    this.store.dispatch(clubsActions.loadClubs({}));
  }

  addClub() {
    this.router.navigate(['/cms/clubs/create']);
  }

  editClub(club: Club) {
    this.router.navigate(['/cms/clubs/edit', club.id]);
  }

  deleteClub(club: Club) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${club.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(clubsActions.deleteClub({ id: club.id }));
      },
    });
  }
}
