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
import { Competition } from '../../../shared/interfaces/competition.interface';
import { competitionsActions } from '../../../store/competitions/competitions.actions';
import { competitionsFeature } from '../../../store/competitions/competitions.store';

@Component({
  selector: 'app-competitions-list',
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
  ],
  providers: [ConfirmationService],
  templateUrl: './competitions-list.component.html',
})
export class CompetitionsListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly competitions = this.store.selectSignal(competitionsFeature.selectCompetitions);
  readonly isLoading = this.store.selectSignal(competitionsFeature.selectLoading);

  ngOnInit() {
    this.store.dispatch(competitionsActions.loadCompetitions({}));
  }

  addCompetition() {
    this.router.navigate(['/cms/competitions/create']);
  }

  editCompetition(competition: Competition) {
    this.router.navigate(['/cms/competitions/edit', competition.id]);
  }

  deleteCompetition(competition: Competition) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${competition.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(competitionsActions.deleteCompetition({ id: competition.id }));
      },
    });
  }
}
