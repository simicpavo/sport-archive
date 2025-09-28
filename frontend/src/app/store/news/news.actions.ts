import { createActionGroup, props } from '@ngrx/store';
import {
  MediaNewsFilters,
  PaginatedMediaNews,
  TimeFilter,
} from '../../models/media-news.interface';

export const NewsActions = createActionGroup({
  source: 'News',
  events: {
    // News loading
    loadNews: props<{ isLoadMore?: boolean; filters?: MediaNewsFilters }>(),
    loadNewsSuccess: props<{ response: PaginatedMediaNews; isLoadMore?: boolean }>(),
    loadNewsFailure: props<{ error: unknown }>(),

    // Filters and state management
    applyTimeFilter: props<{ timeFilter: TimeFilter }>(),
  },
});
