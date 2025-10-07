import { createFeature, createReducer, on } from '@ngrx/store';
import { MediaSource } from '../../shared/interfaces/media-source.interface';
import { mediaSourcesActions } from './media-sources.actions';

export interface MediaSourcesState {
  mediaSources: MediaSource[];
  selectedMediaSource: MediaSource | null;
  loading: boolean;
  error: unknown;
  total: number;
}

export const initialState: MediaSourcesState = {
  mediaSources: [],
  selectedMediaSource: null,
  loading: false,
  error: null,
  total: 0,
};

export const mediaSourcesReducer = createReducer(
  initialState,

  on(mediaSourcesActions.loadMediaSources, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(mediaSourcesActions.loadMediaSourcesSuccess, (state, { response, mediaSource }) => ({
    ...state,
    loading: false,
    ...(response && {
      mediaSources: response.data,
      total: response.meta.total,
    }),
    ...(mediaSource && {
      selectedMediaSource: mediaSource,
    }),
    error: null,
  })),

  on(mediaSourcesActions.loadMediaSourcesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(mediaSourcesActions.createMediaSource, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(mediaSourcesActions.createMediaSourceSuccess, (state, { mediaSource }) => ({
    ...state,
    loading: false,
    mediaSources: [...state.mediaSources, mediaSource],
    total: state.total + 1,
    error: null,
  })),

  on(mediaSourcesActions.createMediaSourceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(mediaSourcesActions.updateMediaSource, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(mediaSourcesActions.updateMediaSourceSuccess, (state, { mediaSource }) => ({
    ...state,
    loading: false,
    mediaSources: state.mediaSources.map((s) => (s.id === mediaSource.id ? mediaSource : s)),
    selectedMediaSource:
      state.selectedMediaSource?.id === mediaSource.id ? mediaSource : state.selectedMediaSource,
    error: null,
  })),

  on(mediaSourcesActions.updateMediaSourceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(mediaSourcesActions.deleteMediaSource, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(mediaSourcesActions.deleteMediaSourceSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    mediaSources: state.mediaSources.filter((mediaSource) => mediaSource.id !== id),
    total: state.total - 1,
    selectedMediaSource: state.selectedMediaSource?.id === id ? null : state.selectedMediaSource,
    error: null,
  })),

  on(mediaSourcesActions.deleteMediaSourceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const mediaSourcesFeature = createFeature({
  name: 'mediaSources',
  reducer: mediaSourcesReducer,
});
