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
import { NationalTeam } from '../../../shared/interfaces/national-team.interface';
import { nationalTeamsActions } from '../../../store/national-teams/national-teams.actions';
import { nationalTeamsFeature } from '../../../store/national-teams/national-teams.store';

@Component({
  selector: 'app-national-teams-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    TooltipModule,
    TableEmptyMessageComponent,
    PageHeaderComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './national-teams-list.component.html',
})
export class NationalTeamsListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly nationalTeams = this.store.selectSignal(nationalTeamsFeature.selectNationalTeams);
  readonly isLoading = this.store.selectSignal(nationalTeamsFeature.selectLoading);

  ngOnInit() {
    this.store.dispatch(nationalTeamsActions.loadNationalTeams({}));
  }

  addNationalTeam() {
    this.router.navigate(['/cms/national-teams/create']);
  }

  editNationalTeam(nationalTeam: NationalTeam) {
    this.router.navigate(['/cms/national-teams/edit', nationalTeam.id]);
  }

  deleteNationalTeam(nationalTeam: NationalTeam) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${nationalTeam.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(nationalTeamsActions.deleteNationalTeam({ id: nationalTeam.id }));
      },
    });
  }
}
