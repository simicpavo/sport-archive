import { createFeature, createReducer, on } from '@ngrx/store';
import { Sport } from '../../cms/sports/sport.interface';
import { SportsActions } from './sports.actions';

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

  on(SportsActions.loadSports, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SportsActions.loadSportsSuccess, (state, { response, sport }) => ({
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

  on(SportsActions.loadSportsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(SportsActions.createSport, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SportsActions.createSportSuccess, (state, { sport }) => ({
    ...state,
    loading: false,
    sports: [...state.sports, sport],
    total: state.total + 1,
    error: null,
  })),

  on(SportsActions.createSportFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(SportsActions.updateSport, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SportsActions.updateSportSuccess, (state, { sport }) => ({
    ...state,
    loading: false,
    sports: state.sports.map((s) => (s.id === sport.id ? sport : s)),
    selectedSport: state.selectedSport?.id === sport.id ? sport : state.selectedSport,
    error: null,
  })),

  on(SportsActions.updateSportFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(SportsActions.deleteSport, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SportsActions.deleteSportSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    sports: state.sports.filter((sport) => sport.id !== id),
    total: state.total - 1,
    selectedSport: state.selectedSport?.id === id ? null : state.selectedSport,
    error: null,
  })),

  on(SportsActions.deleteSportFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const sportsFeature = createFeature({
  name: 'sports',
  reducer: sportsReducer,
});
