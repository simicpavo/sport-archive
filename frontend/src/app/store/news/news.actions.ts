import { createAction, props } from '@ngrx/store';
import {
  MediaNewsFilters,
  PaginatedMediaNews,
  TimeFilter,
} from '../../models/media-news.interface';

// Load initial news
export const loadInitialNews = createAction(
  '[News] Load Initial News',
  props<{ filters?: MediaNewsFilters }>(),
);

export const loadInitialNewsSuccess = createAction(
  '[News] Load Initial News Success',
  props<{ response: PaginatedMediaNews }>(),
);

export const loadInitialNewsFailure = createAction(
  '[News] Load Initial News Failure',
  props<{ error: unknown }>(),
);

// Load more news for pagination
export const loadMoreNews = createAction('[News] Load More News');

export const loadMoreNewsSuccess = createAction(
  '[News] Load More News Success',
  props<{ response: PaginatedMediaNews }>(),
);

export const loadMoreNewsFailure = createAction(
  '[News] Load More News Failure',
  props<{ error: unknown }>(),
);

export const applyTimeFilter = createAction(
  '[News] Apply Time Filter',
  props<{ timeFilter: TimeFilter }>(),
);

export const clearNews = createAction('[News] Clear News');

export const refreshNews = createAction('[News] Refresh News');

export const updateFilters = createAction(
  '[News] Update Filters',
  props<{ filters: MediaNewsFilters }>(),
);

export const setLoadingState = createAction(
  '[News] Set Loading State',
  props<{ loading: boolean }>(),
);

export const setSelectedFilter = createAction(
  '[News] Set Selected Filter',
  props<{ selectedFilter: TimeFilter }>(),
);
