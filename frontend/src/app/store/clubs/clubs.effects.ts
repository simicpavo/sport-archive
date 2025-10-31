import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ClubsService } from '../../services/clubs.service';
import { clubsActions } from './clubs.actions';

export const loadClubsEffect = createEffect(
  (actions$ = inject(Actions), clubsService = inject(ClubsService)) => {
    return actions$.pipe(
      ofType(clubsActions.loadClubs),
      switchMap(({ id }) => {
        if (id) {
          return clubsService.getClubById(id).pipe(
            map((club) => clubsActions.loadClubsSuccess({ club })),
            catchError((error) => of(clubsActions.loadClubsFailure({ error }))),
          );
        }
        return clubsService.getClubs().pipe(
          map((response) => clubsActions.loadClubsSuccess({ response })),
          catchError((error) => of(clubsActions.loadClubsFailure({ error }))),
        );
      }),
    );
  },
  { functional: true },
);

export const createClubEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router), clubsService = inject(ClubsService)) => {
    return actions$.pipe(
      ofType(clubsActions.createClub),
      switchMap(({ club }) =>
        clubsService.createClub(club).pipe(
          map(() => {
            router.navigate(['/cms/clubs']);
            return clubsActions.createClubSuccess();
          }),
          catchError((error) => of(clubsActions.createClubFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateClubEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router), clubsService = inject(ClubsService)) => {
    return actions$.pipe(
      ofType(clubsActions.updateClub),
      switchMap(({ id, club }) =>
        clubsService.updateClub(id, club).pipe(
          map(() => {
            router.navigate(['/cms/clubs']);
            return clubsActions.updateClubSuccess();
          }),
          catchError((error) => of(clubsActions.updateClubFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const deleteClubEffect = createEffect(
  (actions$ = inject(Actions), clubsService = inject(ClubsService)) => {
    return actions$.pipe(
      ofType(clubsActions.deleteClub),
      switchMap(({ id }) =>
        clubsService.deleteClub(id).pipe(
          mergeMap(() => [clubsActions.deleteClubSuccess({ id }), clubsActions.loadClubs({})]),
          catchError((error) => of(clubsActions.deleteClubFailure({ error }))),
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
        clubsActions.createClubSuccess,
        clubsActions.updateClubSuccess,
        clubsActions.deleteClubSuccess,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[Clubs] createClubSuccess':
            message = 'Successfully created club';
            break;
          case '[Clubs] updateClubSuccess':
            message = 'Successfully updated club';
            break;
          case '[Clubs] deleteClubSuccess':
            message = 'Successfully deleted club';
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
        clubsActions.createClubFailure,
        clubsActions.updateClubFailure,
        clubsActions.deleteClubFailure,
        clubsActions.loadClubsFailure,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[Clubs] createClubFailure':
            message = 'Failed to create club';
            break;
          case '[Clubs] updateClubFailure':
            message = 'Failed to update club';
            break;
          case '[Clubs] deleteClubFailure':
            message = 'Failed to delete club';
            break;
          case '[Clubs] loadClubsFailure':
            message = 'Failed to load clubs';
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
