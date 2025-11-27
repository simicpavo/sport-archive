import { createFeature, createReducer, on } from '@ngrx/store';
import { Record } from '../../shared/interfaces/record.interface';
import { recordsActions } from './records.actions';

export interface RecordsState {
  records: Record[];
  selectedRecord: Record | null;
  loading: boolean;
  saving: boolean;
  error: unknown;
  total: number;
  recordDialogVisible: boolean;
}

export const initialState: RecordsState = {
  records: [],
  selectedRecord: null,
  loading: false,
  saving: false,
  error: null,
  total: 0,
  recordDialogVisible: false,
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
    saving: true,
    error: null,
  })),

  on(recordsActions.createRecordSuccess, (state) => ({
    ...state,
    saving: false,
    error: null,
  })),

  on(recordsActions.createRecordFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(recordsActions.updateRecord, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),

  on(recordsActions.updateRecordSuccess, (state) => ({
    ...state,
    saving: false,
    error: null,
  })),

  on(recordsActions.updateRecordFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(recordsActions.deleteRecord, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(recordsActions.deleteRecordSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(recordsActions.deleteRecordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(recordsActions.changeRecordDialogVisibility, (state, { isVisible }) => ({
    ...state,
    recordDialogVisible: isVisible,
  })),
);

export const recordsFeature = createFeature({
  name: 'records',
  reducer: recordsReducer,
});
