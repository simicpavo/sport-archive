import { createFeature, createReducer, on } from '@ngrx/store';
import { Person } from '../../shared/interfaces/person.interface';
import { personsActions } from './persons.actions';

export interface PersonsState {
  persons: Person[];
  selectedPerson: Person | null;
  loading: boolean;
  error: unknown;
  total: number;
}

export const initialState: PersonsState = {
  persons: [],
  selectedPerson: null,
  loading: false,
  error: null,
  total: 0,
};

export const personsReducer = createReducer(
  initialState,

  on(personsActions.loadPersons, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(personsActions.loadPersonsSuccess, (state, { response, person }) => ({
    ...state,
    loading: false,
    ...(response && {
      persons: response.data,
      total: response.meta.total,
    }),
    ...(person && {
      selectedPerson: person,
    }),
    error: null,
  })),

  on(personsActions.loadPersonsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(personsActions.createPerson, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(personsActions.createPersonSuccess, (state) => ({
    ...state,
    loading: false,
    total: state.total + 1,
    error: null,
  })),

  on(personsActions.createPersonFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(personsActions.updatePerson, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(personsActions.updatePersonSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(personsActions.updatePersonFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(personsActions.deletePerson, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(personsActions.deletePersonSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(personsActions.deletePersonFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const personsFeature = createFeature({
  name: 'persons',
  reducer: personsReducer,
});
