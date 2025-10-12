import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SportsService } from '../../services/sports.service';
import { sportsActions } from './sports.actions';

export const loadSportsEffect = createEffect(
  (actions$ = inject(Actions), sportsService = inject(SportsService)) => {
    return actions$.pipe(
      ofType(sportsActions.loadSports),
      switchMap(({ id }) => {
        // If id is provided, load single sport
        if (id) {
          return sportsService.getSportById(id).pipe(
            map((sport) => sportsActions.loadSportsSuccess({ sport })),
            catchError((error) => of(sportsActions.loadSportsFailure({ error }))),
          );
        }
        // Otherwise load all sports
        return sportsService.getSports().pipe(
          map((response) => sportsActions.loadSportsSuccess({ response })),
          catchError((error) => of(sportsActions.loadSportsFailure({ error }))),
        );
      }),
    );
  },
  { functional: true },
);

export const createSportEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router), sportsService = inject(SportsService)) => {
    return actions$.pipe(
      ofType(sportsActions.createSport),
      switchMap(({ sport }) =>
        sportsService.createSport(sport).pipe(
          map(() => {
            router.navigate(['/cms/sports']);
            return sportsActions.createSportSuccess();
          }),
          catchError((error) => of(sportsActions.createSportFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateSportEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router), sportsService = inject(SportsService)) => {
    return actions$.pipe(
      ofType(sportsActions.updateSport),
      switchMap(({ id, sport }) =>
        sportsService.updateSport(id, sport).pipe(
          map(() => {
            router.navigate(['/cms/sports']);
            return sportsActions.updateSportSuccess();
          }),
          catchError((error) => of(sportsActions.updateSportFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const deleteSportEffect = createEffect(
  (actions$ = inject(Actions), sportsService = inject(SportsService)) => {
    return actions$.pipe(
      ofType(sportsActions.deleteSport),
      switchMap(({ id }) =>
        sportsService.deleteSport(id).pipe(
          map(() => sportsActions.deleteSportSuccess({ id })),
          catchError((error) => of(sportsActions.deleteSportFailure({ error }))),
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
        sportsActions.createSportSuccess,
        sportsActions.updateSportSuccess,
        sportsActions.deleteSportSuccess,
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
        sportsActions.loadSportsFailure,
        sportsActions.createSportFailure,
        sportsActions.updateSportFailure,
        sportsActions.deleteSportFailure,
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
