import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { MediaNewsService } from '../../services/media-news.service';
import { NewsActions } from './news.actions';
import { newsFeature, NewsState } from './news.store';

export const loadNewsEffect = createEffect(
  (
    actions$ = inject(Actions),
    mediaNewsService = inject(MediaNewsService),
    store = inject(Store<{ news: NewsState }>),
  ) => {
    return actions$.pipe(
      ofType(NewsActions.loadNews),
      withLatestFrom(
        store.select(newsFeature.selectFilters),
        store.select(newsFeature.selectSelectedFilter),
        store.select(newsFeature.selectCurrentPage),
      ),
      switchMap(
        ([
          { isLoadMore = false, filters: actionFilters },
          storeFilters,
          selectedFilter,
          currentPage,
        ]) => {
          // Determine which filters to use and page number
          const filtersToUse = actionFilters || storeFilters;
          const pageToLoad = isLoadMore ? currentPage + 1 : 1;

          const requestFilters = {
            ...filtersToUse,
            page: pageToLoad,
          };

          return mediaNewsService.getMediaNewsWithTimeFilter(selectedFilter, requestFilters).pipe(
            map((response) => NewsActions.loadNewsSuccess({ response, isLoadMore })),
            catchError((error) => {
              console.error('Load News Error:', error);
              return of(NewsActions.loadNewsFailure({ error }));
            }),
          );
        },
      ),
    );
  },
  { functional: true },
);

export const applyTimeFilterEffect = createEffect(
  (actions$ = inject(Actions), mediaNewsService = inject(MediaNewsService)) => {
    return actions$.pipe(
      ofType(NewsActions.applyTimeFilter),
      switchMap(({ timeFilter }) =>
        mediaNewsService.getMediaNewsWithTimeFilter(timeFilter, { page: 1, take: 10 }).pipe(
          map((response) => NewsActions.loadNewsSuccess({ response, isLoadMore: false })),
          catchError((error) => of(NewsActions.loadNewsFailure({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);
