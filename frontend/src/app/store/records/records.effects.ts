import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { RecordsService } from '../../services/records.service';
import { recordsActions } from './records.actions';

export const loadRecordsEffect = createEffect(
  (actions$ = inject(Actions), recordsService = inject(RecordsService)) => {
    return actions$.pipe(
      ofType(recordsActions.loadRecords),
      switchMap(({ id }) => {
        if (id) {
          return recordsService.getRecordById(id).pipe(
            map((record) => recordsActions.loadRecordsSuccess({ record })),
            catchError((error) => of(recordsActions.loadRecordsFailure({ error }))),
          );
        }
        return recordsService.getRecords().pipe(
          map((response) => recordsActions.loadRecordsSuccess({ response })),
          catchError((error) => of(recordsActions.loadRecordsFailure({ error }))),
        );
      }),
    );
  },
  { functional: true },
);

export const createRecordEffect = createEffect(
  (actions$ = inject(Actions), recordsService = inject(RecordsService)) => {
    return actions$.pipe(
      ofType(recordsActions.createRecord),
      switchMap(({ record }) =>
        recordsService.createRecord(record).pipe(
          map((createdRecord) => recordsActions.createRecordSuccess({ record: createdRecord })),
          catchError((error) => of(recordsActions.createRecordFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateRecordEffect = createEffect(
  (actions$ = inject(Actions), recordsService = inject(RecordsService)) => {
    return actions$.pipe(
      ofType(recordsActions.updateRecord),
      switchMap(({ id, record }) =>
        recordsService.updateRecord(id, record).pipe(
          map((updatedRecord) => recordsActions.updateRecordSuccess({ record: updatedRecord })),
          catchError((error) => of(recordsActions.updateRecordFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const deleteRecordEffect = createEffect(
  (actions$ = inject(Actions), recordsService = inject(RecordsService)) => {
    return actions$.pipe(
      ofType(recordsActions.deleteRecord),
      switchMap(({ id }) =>
        recordsService.deleteRecord(id).pipe(
          map(() => recordsActions.deleteRecordSuccess({ id })),
          catchError((error) => of(recordsActions.deleteRecordFailure({ error }))),
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
        recordsActions.createRecordSuccess,
        recordsActions.updateRecordSuccess,
        recordsActions.deleteRecordSuccess,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[Records] createRecordSuccess':
            message = 'Record created successfully!';
            break;
          case '[Records] updateRecordSuccess':
            message = 'Record updated successfully!';
            break;
          case '[Records] deleteRecordSuccess':
            message = 'Record deleted successfully!';
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
        recordsActions.loadRecordsFailure,
        recordsActions.createRecordFailure,
        recordsActions.updateRecordFailure,
        recordsActions.deleteRecordFailure,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[Records] loadRecordsFailure':
            message = 'Failed to load records';
            break;
          case '[Records] createRecordFailure':
            message = 'Failed to create record';
            break;
          case '[Records] updateRecordFailure':
            message = 'Failed to update record';
            break;
          case '[Records] deleteRecordFailure':
            message = 'Failed to delete record';
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
