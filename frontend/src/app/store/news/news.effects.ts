import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { MediaNewsService } from '../../services/media-news.service';
import * as NewsActions from './news.actions';
import { newsFeature, NewsState } from './news.store';

@Injectable()
export class NewsEffects {
  private actions$ = inject(Actions);
  private mediaNewsService = inject(MediaNewsService);
  private store = inject(Store<{ news: NewsState }>);

  loadInitialNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.loadInitialNews),
      withLatestFrom(this.store.select(newsFeature.selectSelectedFilter)),
      switchMap(([{ filters }, selectedFilter]) => {
        // Use time filter method to ensure proper sorting is applied
        return this.mediaNewsService.getMediaNewsWithTimeFilter(selectedFilter, filters).pipe(
          map((response) => NewsActions.loadInitialNewsSuccess({ response })),
          catchError((error) => of(NewsActions.loadInitialNewsFailure({ error }))),
        );
      }),
    ),
  );

  loadMoreNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.loadMoreNews),
      withLatestFrom(
        this.store.select(newsFeature.selectFilters),
        this.store.select(newsFeature.selectSelectedFilter),
        this.store.select(newsFeature.selectCurrentPage),
      ),
      switchMap(([, filters, selectedFilter, currentPage]) => {
        // Use currentPage + 1 directly in the request
        const nextPageFilters = {
          ...filters,
          page: currentPage + 1,
        };

        return this.mediaNewsService
          .getMediaNewsWithTimeFilter(selectedFilter, nextPageFilters)
          .pipe(
            map((response) => {
              return NewsActions.loadMoreNewsSuccess({ response });
            }),
            catchError((error) => {
              console.error('❌ LoadMore Error:', error);
              return of(NewsActions.loadMoreNewsFailure({ error }));
            }),
          );
      }),
    ),
  );

  applyTimeFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.applyTimeFilter),
      switchMap(({ timeFilter }) =>
        this.mediaNewsService.getMediaNewsWithTimeFilter(timeFilter, { page: 1, take: 10 }).pipe(
          map((response) => NewsActions.loadInitialNewsSuccess({ response })),
          catchError((error) => of(NewsActions.loadInitialNewsFailure({ error }))),
        ),
      ),
    ),
  );

  refreshNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.refreshNews),
      withLatestFrom(
        this.store.select(newsFeature.selectFilters),
        this.store.select(newsFeature.selectSelectedFilter),
      ),
      switchMap(([, filters, selectedFilter]) => {
        return this.mediaNewsService
          .getMediaNewsWithTimeFilter(selectedFilter, {
            ...filters,
            page: 1,
          })
          .pipe(
            map((response) => NewsActions.loadInitialNewsSuccess({ response })),
            catchError((error) => of(NewsActions.loadInitialNewsFailure({ error }))),
          );
      }),
    ),
  );
}
