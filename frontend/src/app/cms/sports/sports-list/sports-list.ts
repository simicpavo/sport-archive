import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { finalize } from 'rxjs/operators';
import { Sport } from '../sport.interface';
import { SportsService } from '../sports.service';

@Component({
  selector: 'app-sports-list',
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
  providers: [ConfirmationService, MessageService],
  templateUrl: './sports-list.html',
})
export class SportsListComponent implements OnInit {
  private readonly sportsService = inject(SportsService);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly sports = signal<Sport[]>([]);
  readonly isLoading = signal(false);

  ngOnInit() {
    this.loadSports();
  }

  private loadSports() {
    this.isLoading.set(true);

    this.sportsService
      .getSports()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.sports.set(response.data);
        },
        error: (error) => {
          console.error('Error loading sports:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load sports',
          });
        },
      });
  }

  onAddSport() {
    this.router.navigate(['/cms/sports/create']);
  }

  onEditSport(sport: Sport) {
    this.router.navigate(['/cms/sports/edit', sport.id]);
  }

  onDeleteSport(sport: Sport) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${sport.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.isLoading.set(true);

        this.sportsService
          .deleteSport(sport.id)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => this.isLoading.set(false)),
          )
          .subscribe({
            next: () => {
              // Remove the sport from the current list instead of reloading
              const updatedSports = this.sports().filter((s: Sport) => s.id !== sport.id);
              this.sports.set(updatedSports);

              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `"${sport.name}" deleted successfully`,
                life: 3000,
              });
            },
            error: (error) => {
              console.error('Error deleting sport:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete sport',
                life: 5000,
              });
            },
          });
      },
    });
  }
}
