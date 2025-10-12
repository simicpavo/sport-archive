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
import { nationalTeamsActions } from '../../../store/national-teams/national-teams.actions';
import { nationalTeamsFeature } from '../../../store/national-teams/national-teams.store';
import { sportsActions } from '../../../store/sports/sports.actions';
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
  templateUrl: './national-teams-form.component.html',
})
export class NationalTeamsFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = this.store.selectSignal(nationalTeamsFeature.selectLoading);
  readonly nationalTeamId = signal<string | null>(null);
  readonly isEditMode = computed(() => this.nationalTeamId() !== null);
  readonly selectedNationalTeam = this.store.selectSignal(
    nationalTeamsFeature.selectSelectedNationalTeam,
  );
  readonly sports = this.store.selectSignal(sportsFeature.selectSports);

  readonly nationalTeamForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    sportId: ['', [Validators.required]],
  });

  ngOnInit() {
    this.loadNationalTeamData();
  }

  constructor() {
    effect(() => {
      if (this.selectedNationalTeam() && this.isEditMode()) {
        setTimeout(() => {
          this.nationalTeamForm.patchValue({
            name: this.selectedNationalTeam()?.name,
            sportId: this.selectedNationalTeam()?.sportId,
          });
        });
        this.nationalTeamForm.markAsPristine();
      }
    });
  }

  private loadNationalTeamData() {
    const nationalTeamId = this.route.snapshot.paramMap.get('id');
    this.nationalTeamId.set(nationalTeamId);

    this.store.dispatch(sportsActions.loadSports({}));

    if (nationalTeamId) {
      this.store.dispatch(nationalTeamsActions.loadNationalTeams({ id: nationalTeamId }));
    }
  }

  onSubmit() {
    this.markAllFieldsAsTouched();
    if (!this.nationalTeamForm.valid) {
      return;
    }

    const formValue = this.nationalTeamForm.getRawValue();

    if (this.isEditMode()) {
      this.store.dispatch(
        nationalTeamsActions.updateNationalTeam({
          id: this.nationalTeamId()!,
          nationalTeam: { name: formValue.name, sportId: formValue.sportId },
        }),
      );
    } else {
      this.store.dispatch(
        nationalTeamsActions.createNationalTeam({
          nationalTeam: { name: formValue.name, sportId: formValue.sportId },
        }),
      );
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.nationalTeamForm.controls).forEach((key) => {
      this.nationalTeamForm.get(key)?.markAsTouched();
    });
  }

  protected navigateToNationalTeamsList() {
    this.router.navigate(['/cms/national-teams']);
  }
}
