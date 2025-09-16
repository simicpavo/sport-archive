import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NewsState } from './news.store';

// Feature selector
export const selectNewsState = createFeatureSelector<NewsState>('news');

// Basic selectors
export const selectNews = createSelector(selectNewsState, (state: NewsState) => state.news);

export const selectLoading = createSelector(selectNewsState, (state: NewsState) => state.loading);

export const selectLoadingMore = createSelector(
  selectNewsState,
  (state: NewsState) => state.loadingMore,
);

export const selectHasMore = createSelector(selectNewsState, (state: NewsState) => state.hasMore);

export const selectCurrentPage = createSelector(
  selectNewsState,
  (state: NewsState) => state.currentPage,
);

export const selectFilters = createSelector(selectNewsState, (state: NewsState) => state.filters);

export const selectSelectedFilter = createSelector(
  selectNewsState,
  (state: NewsState) => state.selectedFilter,
);

export const selectError = createSelector(selectNewsState, (state: NewsState) => state.error);

export const selectTotal = createSelector(selectNewsState, (state: NewsState) => state.total);

export const selectTotalPages = createSelector(
  selectNewsState,
  (state: NewsState) => state.totalPages,
);

// Computed selectors
export const selectIsLoadingInitial = createSelector(
  selectLoading,
  selectNews,
  (loading: boolean, news: unknown[]) => loading && news.length === 0,
);

export const selectIsLoadingMore = createSelector(
  selectLoadingMore,
  selectNews,
  (loadingMore: boolean, news: unknown[]) => loadingMore && news.length > 0,
);

export const selectHasError = createSelector(selectError, (error: unknown) => !!error);

export const selectNewsCount = createSelector(selectNews, (news: unknown[]) => news.length);
