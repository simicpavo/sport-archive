import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { PersonsService } from '../../services/persons.service';
import { personsActions } from './persons.actions';

export const loadPersonsEffect = createEffect(
  (actions$ = inject(Actions), personsService = inject(PersonsService)) => {
    return actions$.pipe(
      ofType(personsActions.loadPersons),
      switchMap(({ id }) => {
        if (id) {
          return personsService.getPersonById(id).pipe(
            map((person) => personsActions.loadPersonsSuccess({ person })),
            catchError((error) => of(personsActions.loadPersonsFailure({ error }))),
          );
        }
        return personsService.getPersons().pipe(
          map((response) => personsActions.loadPersonsSuccess({ response })),
          catchError((error) => of(personsActions.loadPersonsFailure({ error }))),
        );
      }),
    );
  },
  { functional: true },
);

export const createPersonEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    personsService = inject(PersonsService),
  ) => {
    return actions$.pipe(
      ofType(personsActions.createPerson),
      switchMap(({ person }) =>
        personsService.createPerson(person).pipe(
          map(() => {
            router.navigate(['/cms/persons']);
            return personsActions.createPersonSuccess();
          }),
          catchError((error) => of(personsActions.createPersonFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updatePersonEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    personsService = inject(PersonsService),
  ) => {
    return actions$.pipe(
      ofType(personsActions.updatePerson),
      switchMap(({ id, person }) =>
        personsService.updatePerson(id, person).pipe(
          map(() => {
            router.navigate(['/cms/persons']);
            return personsActions.updatePersonSuccess();
          }),
          catchError((error) => of(personsActions.updatePersonFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const deletePersonEffect = createEffect(
  (actions$ = inject(Actions), personsService = inject(PersonsService)) => {
    return actions$.pipe(
      ofType(personsActions.deletePerson),
      switchMap(({ id }) =>
        personsService.deletePerson(id).pipe(
          map(() => personsActions.deletePersonSuccess({ id })),
          catchError((error) => of(personsActions.deletePersonFailure({ error }))),
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
        personsActions.createPersonSuccess,
        personsActions.updatePersonSuccess,
        personsActions.deletePersonSuccess,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[Persons] createPersonSuccess':
            message = 'Person created successfully!';
            break;
          case '[Persons] updatePersonSuccess':
            message = 'Person updated successfully!';
            break;
          case '[Persons] deletePersonSuccess':
            message = 'Person deleted successfully!';
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
        personsActions.loadPersonsFailure,
        personsActions.createPersonFailure,
        personsActions.updatePersonFailure,
        personsActions.deletePersonFailure,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[Persons] loadPersonsFailure':
            message = 'Failed to load persons';
            break;
          case '[Persons] createPersonFailure':
            message = 'Failed to create person';
            break;
          case '[Persons] updatePersonFailure':
            message = 'Failed to update person';
            break;
          case '[Persons] deletePersonFailure':
            message = 'Failed to delete person';
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
