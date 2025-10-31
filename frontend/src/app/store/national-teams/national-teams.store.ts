import { createFeature, createReducer, on } from '@ngrx/store';
import { NationalTeam } from '../../shared/interfaces/national-team.interface';
import { nationalTeamsActions } from './national-teams.actions';

export interface NationalTeamsState {
  nationalTeams: NationalTeam[];
  selectedNationalTeam: NationalTeam | null;
  loading: boolean;
  error: unknown;
  total: number;
}

export const initialState: NationalTeamsState = {
  nationalTeams: [],
  selectedNationalTeam: null,
  loading: false,
  error: null,
  total: 0,
};

export const nationalTeamsReducer = createReducer(
  initialState,

  on(nationalTeamsActions.loadNationalTeams, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(nationalTeamsActions.loadNationalTeamsSuccess, (state, { response, nationalTeam }) => ({
    ...state,
    loading: false,
    ...(response && {
      nationalTeams: response.data,
      total: response.meta.total,
    }),
    ...(nationalTeam && {
      selectedNationalTeam: nationalTeam,
    }),
    error: null,
  })),

  on(nationalTeamsActions.loadNationalTeamsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(nationalTeamsActions.createNationalTeam, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(nationalTeamsActions.createNationalTeamSuccess, (state) => ({
    ...state,
    loading: false,
    total: state.total + 1,
    error: null,
  })),

  on(nationalTeamsActions.createNationalTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(nationalTeamsActions.updateNationalTeam, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(nationalTeamsActions.updateNationalTeamSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(nationalTeamsActions.updateNationalTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(nationalTeamsActions.deleteNationalTeam, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(nationalTeamsActions.deleteNationalTeamSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(nationalTeamsActions.deleteNationalTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const nationalTeamsFeature = createFeature({
  name: 'nationalTeams',
  reducer: nationalTeamsReducer,
});
