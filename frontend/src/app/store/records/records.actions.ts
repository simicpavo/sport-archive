import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateRecordDto,
  Record,
  RecordResponse,
  UpdateRecordDto,
} from '../../shared/interfaces/record.interface';

export const recordsActions = createActionGroup({
  source: 'Records',
  events: {
    loadRecords: props<{ id?: string }>(),
    loadRecordsSuccess: props<{ response?: RecordResponse; record?: Record }>(),
    loadRecordsFailure: props<{ error: unknown }>(),

    createRecord: props<{ record: CreateRecordDto }>(),
    createRecordSuccess: emptyProps(),
    createRecordFailure: props<{ error: unknown }>(),

    updateRecord: props<{ id: string; record: UpdateRecordDto }>(),
    updateRecordSuccess: emptyProps(),
    updateRecordFailure: props<{ error: unknown }>(),

    deleteRecord: props<{ id: string }>(),
    deleteRecordSuccess: props<{ id: string }>(),
    deleteRecordFailure: props<{ error: unknown }>(),
  },
});
