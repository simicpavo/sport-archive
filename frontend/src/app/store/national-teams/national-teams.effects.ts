import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { NationalTeamsService } from '../../services/national-teams.service';
import { nationalTeamsActions } from './national-teams.actions';

export const createNationalTeamsEffects = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    nationalTeamsService = inject(NationalTeamsService),
  ) => {
    return actions$.pipe(
      ofType(nationalTeamsActions.createNationalTeam),
      switchMap(({ nationalTeam }) =>
        nationalTeamsService.createNationalTeam(nationalTeam).pipe(
          map(() => {
            router.navigate(['/cms/national-teams']);
            return nationalTeamsActions.createNationalTeamSuccess();
          }),
          catchError((error) => of(nationalTeamsActions.createNationalTeamFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const loadNationalTeamsEffect = createEffect(
  (action$ = inject(Actions), nationalTeamsService = inject(NationalTeamsService)) => {
    return action$.pipe(
      ofType(nationalTeamsActions.loadNationalTeams),
      switchMap(({ id }) => {
        if (id) {
          return nationalTeamsService.getNationalTeamById(id).pipe(
            map((nationalTeam) => nationalTeamsActions.loadNationalTeamsSuccess({ nationalTeam })),
            catchError((error) => of(nationalTeamsActions.loadNationalTeamsFailure({ error }))),
          );
        }
        return nationalTeamsService.getNationalTeams().pipe(
          map((response) => nationalTeamsActions.loadNationalTeamsSuccess({ response })),
          catchError((error) => of(nationalTeamsActions.loadNationalTeamsFailure({ error }))),
        );
      }),
    );
  },
  { functional: true },
);

export const updateNationalTeamEffect = createEffect(
  (
    action$ = inject(Actions),
    router = inject(Router),
    nationalTeamsService = inject(NationalTeamsService),
  ) => {
    return action$.pipe(
      ofType(nationalTeamsActions.updateNationalTeam),
      switchMap(({ id, nationalTeam }) =>
        nationalTeamsService.updateNationalTeam(id, nationalTeam).pipe(
          map(() => {
            router.navigate(['/cms/national-teams']);
            return nationalTeamsActions.updateNationalTeamSuccess();
          }),
          catchError((error) => of(nationalTeamsActions.updateNationalTeamFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const deleteNationalTeamEffect = createEffect(
  (action$ = inject(Actions), nationalTeamsService = inject(NationalTeamsService)) => {
    return action$.pipe(
      ofType(nationalTeamsActions.deleteNationalTeam),
      switchMap(({ id }) =>
        nationalTeamsService.deleteNationalTeam(id).pipe(
          mergeMap(() => [
            nationalTeamsActions.deleteNationalTeamSuccess({ id }),
            nationalTeamsActions.loadNationalTeams({}),
          ]),
          catchError((error) => of(nationalTeamsActions.deleteNationalTeamFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const showSuccessMessageEffect = createEffect(
  (actions$ = inject(Actions), messageService = inject(MessageService)) => {
    return actions$.pipe(
      ofType(
        nationalTeamsActions.createNationalTeamSuccess,
        nationalTeamsActions.updateNationalTeamSuccess,
        nationalTeamsActions.deleteNationalTeamSuccess,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[NationalTeams] createNationalTeamSuccess':
            message = 'Successfully created national team';
            break;
          case '[NationalTeams] updateNationalTeamSuccess':
            message = 'Successfully updated national team';
            break;
          case '[NationalTeams] deleteNationalTeamSuccess':
            message = 'Successfully deleted national team';
            break;
        }

        messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 5000,
        });
      }),
    );
  },
  { dispatch: false, functional: true },
);

export const showErrorMessageEffect = createEffect(
  (actions$ = inject(Actions), messageService = inject(MessageService)) => {
    return actions$.pipe(
      ofType(
        nationalTeamsActions.createNationalTeamFailure,
        nationalTeamsActions.updateNationalTeamFailure,
        nationalTeamsActions.deleteNationalTeamFailure,
        nationalTeamsActions.loadNationalTeamsFailure,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[NationalTeams] createNationalTeamFailure':
            message = 'Failed to create national team';
            break;
          case '[NationalTeams] updateNationalTeamFailure':
            message = 'Failed to update national team';
            break;
          case '[NationalTeams] deleteNationalTeamFailure':
            message = 'Failed to delete national team';
            break;
          case '[NationalTeams] loadNationalTeamsFailure':
            message = 'Failed to load national teams';
            break;
        }

        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 5000,
        });
      }),
    );
  },
  { dispatch: false, functional: true },
);
