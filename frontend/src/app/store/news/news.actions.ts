import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  MediaNewsFilters,
  PaginatedMediaNews,
  TimeFilter,
} from '../../models/media-news.interface';

export const NewsActions = createActionGroup({
  source: 'News',
  events: {
    // Initial news loading
    loadInitialNews: props<{ filters?: MediaNewsFilters }>(),
    loadInitialNewsSuccess: props<{ response: PaginatedMediaNews }>(),
    loadInitialNewsFailure: props<{ error: unknown }>(),

    // Load more news for pagination
    loadMoreNews: emptyProps(),
    loadMoreNewsSuccess: props<{ response: PaginatedMediaNews }>(),
    loadMoreNewsFailure: props<{ error: unknown }>(),

    // Filters and state management
    applyTimeFilter: props<{ timeFilter: TimeFilter }>(),
  },
});
