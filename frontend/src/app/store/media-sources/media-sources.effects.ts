import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MediaSourcesService } from '../../services/media-sources.service';
import { mediaSourcesActions } from './media-sources.actions';

export const loadMediaSourcesEffect = createEffect(
  (actions$ = inject(Actions), mediaSourcesService = inject(MediaSourcesService)) => {
    return actions$.pipe(
      ofType(mediaSourcesActions.loadMediaSources),
      switchMap(({ id }) => {
        if (id) {
          return mediaSourcesService.getMediaSourceById(id).pipe(
            map((mediaSource) => mediaSourcesActions.loadMediaSourcesSuccess({ mediaSource })),
            catchError((error) => of(mediaSourcesActions.loadMediaSourcesFailure({ error }))),
          );
        }
        return mediaSourcesService.getMediaSources().pipe(
          map((response) => mediaSourcesActions.loadMediaSourcesSuccess({ response })),
          catchError((error) => of(mediaSourcesActions.loadMediaSourcesFailure({ error }))),
        );
      }),
    );
  },
  { functional: true },
);

export const createMediaSourceEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    mediaSourcesService = inject(MediaSourcesService),
  ) => {
    return actions$.pipe(
      ofType(mediaSourcesActions.createMediaSource),
      switchMap(({ mediaSource }) =>
        mediaSourcesService.createMediaSource(mediaSource).pipe(
          map(() => {
            router.navigate(['/cms/media-sources']);
            return mediaSourcesActions.createMediaSourceSuccess();
          }),
          catchError((error) => of(mediaSourcesActions.createMediaSourceFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateMediaSourceEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    mediaSourcesService = inject(MediaSourcesService),
  ) => {
    return actions$.pipe(
      ofType(mediaSourcesActions.updateMediaSource),
      switchMap(({ id, mediaSource }) =>
        mediaSourcesService.updateMediaSource(id, mediaSource).pipe(
          map(() => {
            router.navigate(['/cms/media-sources']);
            return mediaSourcesActions.updateMediaSourceSuccess();
          }),
          catchError((error) => of(mediaSourcesActions.updateMediaSourceFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const deleteMediaSourceEffect = createEffect(
  (actions$ = inject(Actions), mediaSourcesService = inject(MediaSourcesService)) => {
    return actions$.pipe(
      ofType(mediaSourcesActions.deleteMediaSource),
      switchMap(({ id }) =>
        mediaSourcesService.deleteMediaSource(id).pipe(
          map(() => mediaSourcesActions.deleteMediaSourceSuccess({ id })),
          catchError((error) => of(mediaSourcesActions.deleteMediaSourceFailure({ error }))),
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
        mediaSourcesActions.createMediaSourceSuccess,
        mediaSourcesActions.updateMediaSourceSuccess,
        mediaSourcesActions.deleteMediaSourceSuccess,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[MediaSources] createMediaSourceSuccess':
            message = 'Media Source created successfully!';
            break;
          case '[MediaSources] updateMediaSourceSuccess':
            message = 'Media Source updated successfully!';
            break;
          case '[MediaSources] deleteMediaSourceSuccess':
            message = 'Media Source deleted successfully!';
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
        mediaSourcesActions.loadMediaSourcesFailure,
        mediaSourcesActions.createMediaSourceFailure,
        mediaSourcesActions.updateMediaSourceFailure,
        mediaSourcesActions.deleteMediaSourceFailure,
      ),
      tap((action) => {
        let message = '';
        switch (action.type) {
          case '[MediaSources] loadMediaSourcesFailure':
            message = 'Failed to load media sources';
            break;
          case '[MediaSources] createMediaSourceFailure':
            message = 'Failed to create media source';
            break;
          case '[MediaSources] updateMediaSourceFailure':
            message = 'Failed to update media source';
            break;
          case '[MediaSources] deleteMediaSourceFailure':
            message = 'Failed to delete media source';
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
