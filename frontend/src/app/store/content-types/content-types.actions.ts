import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ContentType,
  ContentTypeResponse,
  CreateContentTypeDto,
  UpdateContentTypeDto,
} from '../../shared/interfaces/content-type.interface';

export const contentTypesActions = createActionGroup({
  source: 'ContentTypes',
  events: {
    loadContentTypes: props<{ id?: string }>(),
    loadContentTypesSuccess: props<{ response?: ContentTypeResponse; contentType?: ContentType }>(),
    loadContentTypesFailure: props<{ error: unknown }>(),

    createContentType: props<{ contentType: CreateContentTypeDto }>(),
    createContentTypeSuccess: emptyProps(),
    createContentTypeFailure: props<{ error: unknown }>(),

    updateContentType: props<{ id: string; contentType: UpdateContentTypeDto }>(),
    updateContentTypeSuccess: emptyProps(),
    updateContentTypeFailure: props<{ error: unknown }>(),

    deleteContentType: props<{ id: string }>(),
    deleteContentTypeSuccess: props<{ id: string }>(),
    deleteContentTypeFailure: props<{ error: unknown }>(),
  },
});
