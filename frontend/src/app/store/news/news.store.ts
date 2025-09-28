import { createFeature, createReducer, on } from '@ngrx/store';
import { MediaNews, MediaNewsFilters, TimeFilter } from '../../models/media-news.interface';
import { NewsActions } from './news.actions';

export interface NewsState {
  news: MediaNews[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  currentPage: number;
  filters: MediaNewsFilters;
  selectedFilter: TimeFilter;
  error: unknown;
  total: number;
  totalPages: number;
}

export const initialState: NewsState = {
  news: [],
  loading: false,
  loadingMore: false,
  hasMore: true,
  currentPage: 1,
  filters: {
    page: 1,
    take: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  selectedFilter: 'all',
  error: null,
  total: 0,
  totalPages: 0,
};

export const newsReducer = createReducer(
  initialState,

  // Load initial news
  on(NewsActions.loadNews, (state, { isLoadMore = false, filters }) => {
    if (isLoadMore) {
      return {
        ...state,
        loadingMore: true,
        error: null,
      };
    }

    // Create a fresh filter object to avoid carrying over old date filters
    const newFilters = {
      page: 1,
      take: state.filters.take || 10,
      sortBy: state.filters.sortBy || 'createdAt',
      sortOrder: state.filters.sortOrder || 'desc',
      ...filters,
    };

    return {
      ...state,
      loading: true,
      loadingMore: false,
      error: null,
      filters: newFilters,
      currentPage: 1,
      news: [], // Clear existing news
      hasMore: true,
    };
  }),

  on(NewsActions.loadNewsSuccess, (state, { response, isLoadMore = false }) => {
    const newCurrentPage = isLoadMore ? state.currentPage + 1 : (response.meta?.page ?? 1);
    return {
      ...state,
      loading: false,
      loadingMore: false,
      news: isLoadMore ? [...state.news, ...response.data] : response.data,
      hasMore: response.data.length === state.filters.take,
      total: response.meta?.total ?? 0,
      totalPages: response.meta?.totalPages ?? 0,
      currentPage: newCurrentPage,
      error: null,
    };
  }),

  on(NewsActions.loadNewsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loadingMore: false,
    error,
    hasMore: false,
  })),

  on(NewsActions.applyTimeFilter, (state, { timeFilter }) => ({
    ...state,
    selectedFilter: timeFilter,
    loading: true,
    loadingMore: false,
    currentPage: 1,
    news: [], // Clear existing news when applying filter
    hasMore: true, // Reset hasMore flag
    filters: {
      page: 1,
      take: state.filters.take || 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
  })),
);

export const newsFeature = createFeature({
  name: 'news',
  reducer: newsReducer,
});
