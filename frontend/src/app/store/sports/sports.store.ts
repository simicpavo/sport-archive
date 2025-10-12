import { createFeature, createReducer, on } from '@ngrx/store';
import { Sport } from '../../shared/interfaces/sport.interface';
import { sportsActions } from './sports.actions';

export interface SportsState {
  sports: Sport[];
  selectedSport: Sport | null;
  loading: boolean;
  error: unknown;
  total: number;
}

export const initialState: SportsState = {
  sports: [],
  selectedSport: null,
  loading: false,
  error: null,
  total: 0,
};

export const sportsReducer = createReducer(
  initialState,

  on(sportsActions.loadSports, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(sportsActions.loadSportsSuccess, (state, { response, sport }) => ({
    ...state,
    loading: false,
    // If response exists, update sports list
    ...(response && {
      sports: response.data,
      total: response.meta.total,
    }),
    // If sport exists, update selectedSport
    ...(sport && {
      selectedSport: sport,
    }),
    error: null,
  })),

  on(sportsActions.loadSportsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(sportsActions.createSport, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(sportsActions.createSportSuccess, (state) => ({
    ...state,
    loading: false,
    total: state.total + 1,
    error: null,
  })),

  on(sportsActions.createSportFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(sportsActions.updateSport, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(sportsActions.updateSportSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(sportsActions.updateSportFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(sportsActions.deleteSport, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(sportsActions.deleteSportSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    sports: state.sports.filter((sport) => sport.id !== id),
    total: state.total - 1,
    selectedSport: state.selectedSport?.id === id ? null : state.selectedSport,
    error: null,
  })),

  on(sportsActions.deleteSportFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const sportsFeature = createFeature({
  name: 'sports',
  reducer: sportsReducer,
});
