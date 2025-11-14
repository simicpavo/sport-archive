import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
import { clubsActions } from '../../../store/clubs/clubs.actions';
import { clubsFeature } from '../../../store/clubs/clubs.store';
import { sportsActions } from '../../../store/sports/sports.actions';
import { sportsFeature } from '../../../store/sports/sports.store';

@Component({
  selector: 'app-clubs-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    SelectModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './clubs-form.component.html',
})
export class ClubsFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = this.store.selectSignal(clubsFeature.selectLoading);
  readonly clubId = signal<string | null>(null);
  readonly isEditMode = computed(() => this.clubId() !== null);
  readonly selectedClub = this.store.selectSignal(clubsFeature.selectSelectedClub);
  readonly sports = this.store.selectSignal(sportsFeature.selectSports);

  readonly clubForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    sportId: ['', [Validators.required]],
  });

  ngOnInit() {
    this.loadClubData();
  }

  constructor() {
    effect(() => {
      if (this.isEditMode() && this.selectedClub()) {
        untracked(() => {
          this.clubForm.patchValue({
            name: this.selectedClub()?.name,
            sportId: this.selectedClub()?.sportId,
          });
          this.clubForm.markAsPristine();
        });
      }
    });
  }

  private loadClubData() {
    const clubId = this.route.snapshot.paramMap.get('id');
    this.clubId.set(clubId);

    this.store.dispatch(sportsActions.loadSports({}));

    if (clubId) {
      this.store.dispatch(clubsActions.loadClubs({ id: clubId }));
    }
  }

  onSubmit() {
    this.markAllFieldsAsTouched();
    if (!this.clubForm.valid) {
      return;
    }

    const formValue = this.clubForm.getRawValue();

    if (this.isEditMode()) {
      this.store.dispatch(
        clubsActions.updateClub({
          id: this.clubId()!,
          club: { name: formValue.name, sportId: formValue.sportId },
        }),
      );
    } else {
      this.store.dispatch(
        clubsActions.createClub({ club: { name: formValue.name, sportId: formValue.sportId } }),
      );
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.clubForm.controls).forEach((key) => {
      this.clubForm.get(key)?.markAsTouched();
    });
  }

  protected navigateToClubsList() {
    this.router.navigate(['/cms/clubs']);
  }
}
