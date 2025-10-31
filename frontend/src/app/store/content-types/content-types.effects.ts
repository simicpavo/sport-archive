import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ContentTypesService } from '../../services/content-types.service';
import { contentTypesActions } from './content-types.actions';

export const loadContentTypesEffect = createEffect(
  (actions$ = inject(Actions), contentTypesService = inject(ContentTypesService)) => {
    return actions$.pipe(
      ofType(contentTypesActions.loadContentTypes),
      switchMap(({ id }) => {
        // If id is provided, load single content type
        if (id) {
          return contentTypesService.getContentTypeById(id).pipe(
            map((contentType) => contentTypesActions.loadContentTypesSuccess({ contentType })),
            catchError((error) => of(contentTypesActions.loadContentTypesFailure({ error }))),
          );
        }
        // Otherwise load all content types
        return contentTypesService.getContentTypes().pipe(
          map((response) => contentTypesActions.loadContentTypesSuccess({ response })),
          catchError((error) => of(contentTypesActions.loadContentTypesFailure({ error }))),
        );
      }),
    );
  },
  { functional: true },
);

export const createContentTypeEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    contentTypesService = inject(ContentTypesService),
  ) => {
    return actions$.pipe(
      ofType(contentTypesActions.createContentType),
      switchMap(({ contentType }) =>
        contentTypesService.createContentType(contentType).pipe(
          map(() => {
            router.navigate(['/cms/content-types']);
            return contentTypesActions.createContentTypeSuccess();
          }),
          catchError((error) => of(contentTypesActions.createContentTypeFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateContentTypeEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    contentTypesService = inject(ContentTypesService),
  ) => {
    return actions$.pipe(
      ofType(contentTypesActions.updateContentType),
      switchMap(({ id, contentType }) =>
        contentTypesService.updateContentType(id, contentType).pipe(
          map(() => {
            router.navigate(['/cms/content-types']);
            return contentTypesActions.updateContentTypeSuccess();
          }),
          catchError((error) => of(contentTypesActions.updateContentTypeFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const deleteContentTypeEffect = createEffect(
  (actions$ = inject(Actions), contentTypesService = inject(ContentTypesService)) => {
    return actions$.pipe(
      ofType(contentTypesActions.deleteContentType),
      switchMap(({ id }) =>
        contentTypesService.deleteContentType(id).pipe(
          mergeMap(() => [
            contentTypesActions.deleteContentTypeSuccess({ id }),
            contentTypesActions.loadContentTypes({}),
          ]),
          catchError((error) => of(contentTypesActions.deleteContentTypeFailure({ error }))),
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
        contentTypesActions.createContentTypeSuccess,
        contentTypesActions.updateContentTypeSuccess,
        contentTypesActions.deleteContentTypeSuccess,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[ContentTypes] createContentTypeSuccess':
            message = 'Content Type created successfully!';
            break;
          case '[ContentTypes] updateContentTypeSuccess':
            message = 'Content Type updated successfully!';
            break;
          case '[ContentTypes] deleteContentTypeSuccess':
            message = 'Content Type deleted successfully!';
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
        contentTypesActions.loadContentTypesFailure,
        contentTypesActions.createContentTypeFailure,
        contentTypesActions.updateContentTypeFailure,
        contentTypesActions.deleteContentTypeFailure,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[ContentTypes] loadContentTypesFailure':
            message = 'Failed to load content types';
            break;
          case '[ContentTypes] createContentTypeFailure':
            message = 'Failed to create content type';
            break;
          case '[ContentTypes] updateContentTypeFailure':
            message = 'Failed to update content type';
            break;
          case '[ContentTypes] deleteContentTypeFailure':
            message = 'Failed to delete content type';
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
