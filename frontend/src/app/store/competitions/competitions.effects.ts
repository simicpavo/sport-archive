import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { CompetitionsService } from '../../services/competitions.service';
import { competitionsActions } from './competitions.actions';

export const loadCompetitionsEffect = createEffect(
  (actions$ = inject(Actions), competitionsService = inject(CompetitionsService)) => {
    return actions$.pipe(
      ofType(competitionsActions.loadCompetitions),
      switchMap(({ id }) => {
        if (id) {
          return competitionsService.getCompetitionById(id).pipe(
            map((competition) => competitionsActions.loadCompetitionsSuccess({ competition })),
            catchError((error) => of(competitionsActions.loadCompetitionsFailure({ error }))),
          );
        }
        return competitionsService.getCompetitions().pipe(
          map((response) => competitionsActions.loadCompetitionsSuccess({ response })),
          catchError((error) => of(competitionsActions.loadCompetitionsFailure({ error }))),
        );
      }),
    );
  },
  { functional: true },
);

export const createCompetitionEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    competitionsService = inject(CompetitionsService),
  ) => {
    return actions$.pipe(
      ofType(competitionsActions.createCompetition),
      switchMap(({ competition }) =>
        competitionsService.createCompetition(competition).pipe(
          map(() => {
            router.navigate(['/cms/competitions']);
            return competitionsActions.createCompetitionSuccess();
          }),
          catchError((error) => of(competitionsActions.createCompetitionFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateCompetitionEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    competitionsService = inject(CompetitionsService),
  ) => {
    return actions$.pipe(
      ofType(competitionsActions.updateCompetition),
      switchMap(({ id, competition }) =>
        competitionsService.updateCompetition(id, competition).pipe(
          map(() => {
            router.navigate(['/cms/competitions']);
            return competitionsActions.updateCompetitionSuccess();
          }),
          catchError((error) => of(competitionsActions.updateCompetitionFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const deleteCompetitionEffect = createEffect(
  (actions$ = inject(Actions), competitionsService = inject(CompetitionsService)) => {
    return actions$.pipe(
      ofType(competitionsActions.deleteCompetition),
      switchMap(({ id }) =>
        competitionsService.deleteCompetition(id).pipe(
          map(() => competitionsActions.deleteCompetitionSuccess({ id })),
          catchError((error) => of(competitionsActions.deleteCompetitionFailure({ error }))),
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
        competitionsActions.createCompetitionSuccess,
        competitionsActions.updateCompetitionSuccess,
        competitionsActions.deleteCompetitionSuccess,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[Competitions] createCompetitionSuccess':
            message = 'Successfully created competition';
            break;
          case '[Competitions] updateCompetitionSuccess':
            message = 'Successfully updated competition';
            break;
          case '[Competitions] deleteCompetitionSuccess':
            message = 'Successfully deleted competition';
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
        competitionsActions.createCompetitionFailure,
        competitionsActions.updateCompetitionFailure,
        competitionsActions.deleteCompetitionFailure,
        competitionsActions.loadCompetitionsFailure,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[Competitions] createCompetitionFailure':
            message = 'Failed to create competition';
            break;
          case '[Competitions] updateCompetitionFailure':
            message = 'Failed to update competition';
            break;
          case '[Competitions] deleteCompetitionFailure':
            message = 'Failed to delete competition';
            break;
          case '[Competitions] loadCompetitionsFailure':
            message = 'Failed to load competitions';
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
