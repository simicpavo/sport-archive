import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SportsService } from '../../cms/sports/sports.service';
import { SportsActions } from './sports.actions';

export const loadSportsEffect = createEffect(
  (actions$ = inject(Actions), sportsService = inject(SportsService)) => {
    return actions$.pipe(
      ofType(SportsActions.loadSports),
      switchMap(({ id }) => {
        // If id is provided, load single sport
        if (id) {
          return sportsService.getSportById(id).pipe(
            map((sport) => SportsActions.loadSportsSuccess({ sport })),
            catchError((error) => of(SportsActions.loadSportsFailure({ error }))),
          );
        }
        // Otherwise load all sports
        return sportsService.getSports().pipe(
          map((response) => SportsActions.loadSportsSuccess({ response })),
          catchError((error) => of(SportsActions.loadSportsFailure({ error }))),
        );
      }),
    );
  },
  { functional: true },
);

export const createSportEffect = createEffect(
  (actions$ = inject(Actions), sportsService = inject(SportsService)) => {
    return actions$.pipe(
      ofType(SportsActions.createSport),
      switchMap(({ sport }) =>
        sportsService.createSport(sport).pipe(
          map((createdSport) => SportsActions.createSportSuccess({ sport: createdSport })),
          catchError((error) => of(SportsActions.createSportFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateSportEffect = createEffect(
  (actions$ = inject(Actions), sportsService = inject(SportsService)) => {
    return actions$.pipe(
      ofType(SportsActions.updateSport),
      switchMap(({ id, sport }) =>
        sportsService.updateSport(id, sport).pipe(
          map((updatedSport) => SportsActions.updateSportSuccess({ sport: updatedSport })),
          catchError((error) => of(SportsActions.updateSportFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const deleteSportEffect = createEffect(
  (actions$ = inject(Actions), sportsService = inject(SportsService)) => {
    return actions$.pipe(
      ofType(SportsActions.deleteSport),
      switchMap(({ id }) =>
        sportsService.deleteSport(id).pipe(
          map(() => SportsActions.deleteSportSuccess({ id })),
          catchError((error) => of(SportsActions.deleteSportFailure({ error }))),
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
        SportsActions.createSportSuccess,
        SportsActions.updateSportSuccess,
        SportsActions.deleteSportSuccess,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[Sports] createSportSuccess':
            message = 'Sport created successfully!';
            break;
          case '[Sports] updateSportSuccess':
            message = 'Sport updated successfully!';
            break;
          case '[Sports] deleteSportSuccess':
            message = 'Sport deleted successfully!';
            break;
        }

        messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
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
        SportsActions.loadSportsFailure,
        SportsActions.createSportFailure,
        SportsActions.updateSportFailure,
        SportsActions.deleteSportFailure,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[Sports] loadSportsFailure':
            message = 'Failed to load sports';
            break;
          case '[Sports] createSportFailure':
            message = 'Failed to create sport';
            break;
          case '[Sports] updateSportFailure':
            message = 'Failed to update sport';
            break;
          case '[Sports] deleteSportFailure':
            message = 'Failed to delete sport';
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
