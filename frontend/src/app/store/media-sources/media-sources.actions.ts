import { createActionGroup, props } from '@ngrx/store';
import {
  CreateMediaSourceDto,
  MediaSource,
  MediaSourceResponse,
  UpdateMediaSourceDto,
} from '../../shared/interfaces/media-source.interface';

export const mediaSourcesActions = createActionGroup({
  source: 'MediaSources',
  events: {
    loadMediaSources: props<{ id?: string }>(),
    loadMediaSourcesSuccess: props<{ response?: MediaSourceResponse; mediaSource?: MediaSource }>(),
    loadMediaSourcesFailure: props<{ error: unknown }>(),

    createMediaSource: props<{ mediaSource: CreateMediaSourceDto }>(),
    createMediaSourceSuccess: props<{ mediaSource: MediaSource }>(),
    createMediaSourceFailure: props<{ error: unknown }>(),

    updateMediaSource: props<{ id: string; mediaSource: UpdateMediaSourceDto }>(),
    updateMediaSourceSuccess: props<{ mediaSource: MediaSource }>(),
    updateMediaSourceFailure: props<{ error: unknown }>(),

    deleteMediaSource: props<{ id: string }>(),
    deleteMediaSourceSuccess: props<{ id: string }>(),
    deleteMediaSourceFailure: props<{ error: unknown }>(),
  },
});
