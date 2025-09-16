import { createReducer, on } from '@ngrx/store';
import { MediaNews, MediaNewsFilters, TimeFilter } from '../../models/media-news.interface';
import * as NewsActions from './news.actions';

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
  on(NewsActions.loadInitialNews, (state, { filters }) => {
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
      error: null,
      filters: newFilters,
      currentPage: 1,
    };
  }),

  on(NewsActions.loadInitialNewsSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    news: response.data,
    hasMore: response.data.length >= (state.filters.take || 10),
    total: response.meta?.total ?? 0,
    totalPages: response.meta?.totalPages ?? 0,
    currentPage: response.meta?.page ?? 1,
    error: null,
  })),

  on(NewsActions.loadInitialNewsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    news: [],
    hasMore: false,
  })),

  on(NewsActions.loadMoreNews, (state) => ({
    ...state,
    loadingMore: true,
    error: null,
    currentPage: state.currentPage + 1,
    filters: { ...state.filters, page: state.currentPage + 1 },
  })),

  on(NewsActions.loadMoreNewsSuccess, (state, { response }) => ({
    ...state,
    loadingMore: false,
    news: [...state.news, ...response.data],
    hasMore: response.data.length >= (state.filters.take || 10),
    total: response.meta?.total ?? state.total,
    totalPages: response.meta?.totalPages ?? state.totalPages,
    currentPage: response.meta?.page ?? state.currentPage,
    error: null,
  })),

  on(NewsActions.loadMoreNewsFailure, (state, { error }) => ({
    ...state,
    loadingMore: false,
    error,
    hasMore: false,
  })),

  on(NewsActions.applyTimeFilter, (state, { timeFilter }) => ({
    ...state,
    selectedFilter: timeFilter,
    loading: true,
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

  on(NewsActions.clearNews, (state) => ({
    ...state,
    news: [],
    hasMore: true,
    currentPage: 1,
    filters: { ...state.filters, page: 1 },
    error: null,
  })),

  on(NewsActions.refreshNews, (state) => ({
    ...state,
    loading: true,
    currentPage: 1,
    filters: { ...state.filters, page: 1 },
    error: null,
  })),

  on(NewsActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
    currentPage: 1,
  })),

  on(NewsActions.setLoadingState, (state, { loading }) => ({
    ...state,
    loading,
  })),

  on(NewsActions.setSelectedFilter, (state, { selectedFilter }) => ({
    ...state,
    selectedFilter,
  })),
);
