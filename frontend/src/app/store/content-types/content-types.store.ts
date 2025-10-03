import { createFeature, createReducer, on } from '@ngrx/store';
import { ContentType } from '../../shared/interfaces/content-type.interface';
import { contentTypesActions } from './content-types.actions';

export interface ContentTypesState {
  contentTypes: ContentType[];
  selectedContentType: ContentType | null;
  loading: boolean;
  error: unknown;
  total: number;
}

export const initialState: ContentTypesState = {
  contentTypes: [],
  selectedContentType: null,
  loading: false,
  error: null,
  total: 0,
};

export const contentTypesReducer = createReducer(
  initialState,

  on(contentTypesActions.loadContentTypes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(contentTypesActions.loadContentTypesSuccess, (state, { response, contentType }) => ({
    ...state,
    loading: false,
    // If response exists, update contentTypes list
    ...(response && {
      contentTypes: response.data,
      total: response.meta.total,
    }),
    // If contentType exists, update selectedContentType
    ...(contentType && {
      selectedContentType: contentType,
    }),
    error: null,
  })),

  on(contentTypesActions.loadContentTypesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(contentTypesActions.createContentType, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(contentTypesActions.createContentTypeSuccess, (state, { contentType }) => ({
    ...state,
    loading: false,
    contentTypes: [...state.contentTypes, contentType],
    total: state.total + 1,
    error: null,
  })),

  on(contentTypesActions.createContentTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(contentTypesActions.updateContentType, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(contentTypesActions.updateContentTypeSuccess, (state, { contentType }) => ({
    ...state,
    loading: false,
    contentTypes: state.contentTypes.map((s) => (s.id === contentType.id ? contentType : s)),
    selectedContentType:
      state.selectedContentType?.id === contentType.id ? contentType : state.selectedContentType,
    error: null,
  })),

  on(contentTypesActions.updateContentTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(contentTypesActions.deleteContentType, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(contentTypesActions.deleteContentTypeSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    contentTypes: state.contentTypes.filter((contentType) => contentType.id !== id),
    total: state.total - 1,
    selectedContentType: state.selectedContentType?.id === id ? null : state.selectedContentType,
    error: null,
  })),

  on(contentTypesActions.deleteContentTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const contentTypesFeature = createFeature({
  name: 'contentTypes',
  reducer: contentTypesReducer,
});
