import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { MediaNewsFilters, TimeFilter } from '../../models/media-news.interface';
import { MediaNewsService } from '../../services/media-news.service';
import * as NewsActions from './news.actions';
import { NewsState } from './news.store';

@Injectable()
export class NewsEffects {
  private actions$ = inject(Actions);
  private mediaNewsService = inject(MediaNewsService);
  private store = inject(Store<{ news: NewsState }>);

  loadInitialNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.loadInitialNews),
      switchMap(({ filters }) =>
        this.mediaNewsService.getMediaNews(filters).pipe(
          map((response) => NewsActions.loadInitialNewsSuccess({ response })),
          catchError((error) => of(NewsActions.loadInitialNewsFailure({ error }))),
        ),
      ),
    ),
  );

  loadMoreNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.loadMoreNews),
      withLatestFrom(this.store.select((state) => state.news.filters)),
      switchMap(([, filters]) =>
        this.mediaNewsService.getMediaNews(filters).pipe(
          map((response) => NewsActions.loadMoreNewsSuccess({ response })),
          catchError((error) => of(NewsActions.loadMoreNewsFailure({ error }))),
        ),
      ),
    ),
  );

  applyTimeFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.applyTimeFilter),
      map(({ timeFilter }) => {
        const filters = this.getFiltersForTimeFilter(timeFilter);
        return NewsActions.loadInitialNews({ filters });
      }),
    ),
  );

  refreshNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.refreshNews),
      withLatestFrom(this.store.select((state) => state.news.filters)),
      map(([, filters]) =>
        NewsActions.loadInitialNews({
          filters: { ...filters, page: 1 },
        }),
      ),
    ),
  );

  private getFiltersForTimeFilter(timeFilter: TimeFilter): MediaNewsFilters {
    const now = new Date();
    const filters: MediaNewsFilters = {
      page: 1,
      take: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    switch (timeFilter) {
      case '6h':
        filters.startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
        break;
      case '12h':
        filters.startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();
        break;
      case '24h':
        filters.startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case 'all':
      default:
        filters.startDate = undefined;
        filters.endDate = undefined;
        break;
    }

    return filters;
  }
}
