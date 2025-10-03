import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { CreateClubDto, FormState, UpdateClubDto } from '../../../shared/interfaces/club.interface';
import { clubsActions } from '../../../store/clubs/clubs.actions';
import { clubsFeature } from '../../../store/clubs/clubs.store';
import { SportsActions } from '../../../store/sports/sports.actions';
import { sportsFeature } from '../../../store/sports/sports.store';

@Component({
  selector: 'app-national-teams-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    SelectModule,
  ],
  providers: [],
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

  readonly clubForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    sportId: ['', [Validators.required]],
  });

  readonly submitButtonText = computed(() => (this.isEditMode() ? 'Update Club' : 'Create Club'));
  readonly pageTitle = computed(() => (this.isEditMode() ? 'Edit Club' : 'Create New Club'));

  ngOnInit() {
    this.loadClubData();
  }

  constructor() {
    effect(() => {
      const club = this.selectedClub();
      if (club && this.isEditMode()) {
        const formValue = {
          name: club.name,
          sportId: club.sportId,
        };

        setTimeout(() => {
          this.clubForm.patchValue(formValue);
          this.clubForm.markAsPristine();
        }, 0);
      }
    });
  }

  private loadClubData() {
    const clubId = this.route.snapshot.paramMap.get('id');
    this.clubId.set(clubId);

    this.store.dispatch(SportsActions.loadSports({}));

    if (clubId) {
      this.store.dispatch(clubsActions.loadClubs({ id: clubId }));
    }
  }

  onSubmit() {
    this.markAllFieldsAsTouched();
    if (!this.clubForm.valid) {
      return;
    }

    const formValue = this.clubForm.value as FormState;

    if (this.isEditMode()) {
      const updateData: UpdateClubDto = {
        name: formValue.name,
        sportId: formValue.sportId,
      };
      this.store.dispatch(
        clubsActions.updateClub({
          id: this.clubId()!,
          club: updateData,
        }),
      );
    } else {
      const createData: CreateClubDto = {
        name: formValue.name,
        sportId: formValue.sportId,
      };
      this.store.dispatch(clubsActions.createClub({ club: createData }));
    }

    setTimeout(() => {
      this.navigateToClubsList();
    }, 100);
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.clubForm.controls).forEach((key) => {
      this.clubForm.get(key)?.markAsTouched();
    });
  }

  protected navigateToClubsList() {
    this.router.navigate(['/cms/clubs']).then(() => {
      this.store.dispatch(clubsActions.loadClubs({}));
    });
  }
}
