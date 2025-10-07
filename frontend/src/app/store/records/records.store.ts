import { createFeature, createReducer, on } from '@ngrx/store';
import { Record } from '../../shared/interfaces/record.interface';
import { recordsActions } from './records.actions';

export interface RecordsState {
  records: Record[];
  selectedRecord: Record | null;
  loading: boolean;
  error: unknown;
  total: number;
}

export const initialState: RecordsState = {
  records: [],
  selectedRecord: null,
  loading: false,
  error: null,
  total: 0,
};

export const recordsReducer = createReducer(
  initialState,

  on(recordsActions.loadRecords, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(recordsActions.loadRecordsSuccess, (state, { response, record }) => ({
    ...state,
    loading: false,
    ...(response && {
      records: response.data,
      total: response.meta.total,
    }),
    ...(record && {
      selectedRecord: record,
    }),
    error: null,
  })),

  on(recordsActions.loadRecordsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(recordsActions.createRecord, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(recordsActions.loadRecordsSuccess, (state, { response, record }) => ({
    ...state,
    loading: false,
    ...(response && {
      records: response.data,
      total: response.meta.total,
    }),
    ...(record && {
      selectedRecord: record,
    }),
    error: null,
  })),

  on(recordsActions.loadRecordsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(recordsActions.createRecord, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(recordsActions.createRecordSuccess, (state, { record }) => ({
    ...state,
    loading: false,
    records: [...state.records, record],
    total: state.total + 1,
    error: null,
  })),

  on(recordsActions.createRecordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(recordsActions.updateRecord, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(recordsActions.updateRecordSuccess, (state, { record }) => ({
    ...state,
    loading: false,
    records: state.records.map((r) => (r.id === record.id ? record : r)),
    selectedRecord: state.selectedRecord?.id === record.id ? record : state.selectedRecord,
    error: null,
  })),

  on(recordsActions.updateRecordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(recordsActions.deleteRecord, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(recordsActions.deleteRecordSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    records: state.records.filter((r) => r.id !== id),
    total: state.total - 1,
    selectedRecord: state.selectedRecord?.id === id ? null : state.selectedRecord,
    error: null,
  })),

  on(recordsActions.deleteRecordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const recordsFeature = createFeature({
  name: 'records',
  reducer: recordsReducer,
});
