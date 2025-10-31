import { createFeature, createReducer, on } from '@ngrx/store';
import { Club } from '../../shared/interfaces/club.interface';
import { clubsActions } from './clubs.actions';

export interface ClubsState {
  clubs: Club[];
  selectedClub: Club | null;
  loading: boolean;
  error: unknown;
  total: number;
}

export const initialState: ClubsState = {
  clubs: [],
  selectedClub: null,
  loading: false,
  error: null,
  total: 0,
};

export const clubsReducer = createReducer(
  initialState,

  on(clubsActions.loadClubs, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(clubsActions.loadClubsSuccess, (state, { response, club }) => ({
    ...state,
    loading: false,
    ...(response && {
      clubs: response.data,
      total: response.meta.total,
    }),
    ...(club && {
      selectedClub: club,
    }),
    error: null,
  })),

  on(clubsActions.loadClubsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(clubsActions.createClub, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(clubsActions.createClubSuccess, (state) => ({
    ...state,
    loading: false,
    total: state.total + 1,
    error: null,
  })),

  on(clubsActions.createClubFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(clubsActions.updateClub, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(clubsActions.updateClubSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(clubsActions.updateClubFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(clubsActions.deleteClub, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(clubsActions.deleteClubSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(clubsActions.deleteClubFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const clubsFeature = createFeature({
  name: 'clubs',
  reducer: clubsReducer,
});
