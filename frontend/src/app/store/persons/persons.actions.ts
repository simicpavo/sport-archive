import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreatePersonDto,
  Person,
  PersonResponse,
  UpdatePersonDto,
} from '../../shared/interfaces/person.interface';

export const personsActions = createActionGroup({
  source: 'Persons',
  events: {
    loadPersons: props<{ id?: string }>(),
    loadPersonsSuccess: props<{ response?: PersonResponse; person?: Person }>(),
    loadPersonsFailure: props<{ error: unknown }>(),

    createPerson: props<{ person: CreatePersonDto }>(),
    createPersonSuccess: emptyProps(),
    createPersonFailure: props<{ error: unknown }>(),

    updatePerson: props<{ id: string; person: UpdatePersonDto }>(),
    updatePersonSuccess: emptyProps(),
    updatePersonFailure: props<{ error: unknown }>(),

    deletePerson: props<{ id: string }>(),
    deletePersonSuccess: props<{ id: string }>(),
    deletePersonFailure: props<{ error: unknown }>(),
  },
});
