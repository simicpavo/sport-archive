import { createFeature, createReducer, on } from '@ngrx/store';
import { Competition } from '../../shared/interfaces/competition.interface';
import { competitionsActions } from './competitions.actions';

export interface CompetitionsState {
  competitions: Competition[];
  selectedCompetition: Competition | null;
  loading: boolean;
  error: unknown;
  total: number;
}

export const initialState: CompetitionsState = {
  competitions: [],
  selectedCompetition: null,
  loading: false,
  error: null,
  total: 0,
};

export const competitionsReducer = createReducer(
  initialState,

  on(competitionsActions.loadCompetitions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(competitionsActions.loadCompetitionsSuccess, (state, { response, competition }) => ({
    ...state,
    loading: false,
    ...(response && {
      competitions: response.data,
      total: response.meta.total,
    }),
    ...(competition && {
      selectedCompetition: competition,
    }),
    error: null,
  })),

  on(competitionsActions.loadCompetitionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(competitionsActions.createCompetition, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(competitionsActions.createCompetitionSuccess, (state, { competition }) => ({
    ...state,
    loading: false,
    competitions: [...state.competitions, competition],
    total: state.total + 1,
    error: null,
  })),

  on(competitionsActions.createCompetitionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(competitionsActions.updateCompetition, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(competitionsActions.updateCompetitionSuccess, (state, { competition }) => ({
    ...state,
    loading: false,
    competitions: state.competitions.map((c) => (c.id === competition.id ? competition : c)),
    selectedCompetition:
      state.selectedCompetition?.id === competition.id ? competition : state.selectedCompetition,
  })),

  on(competitionsActions.updateCompetitionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(competitionsActions.deleteCompetition, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(competitionsActions.deleteCompetitionSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    competitions: state.competitions.filter((c) => c.id !== id),
    total: state.total - 1,
    selectedCompetition: state.selectedCompetition?.id === id ? null : state.selectedCompetition,
    error: null,
  })),

  on(competitionsActions.deleteCompetitionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const competitionsFeature = createFeature({
  name: 'competitions',
  reducer: competitionsReducer,
});
