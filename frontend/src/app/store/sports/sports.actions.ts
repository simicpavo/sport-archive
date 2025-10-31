import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateSportDto,
  Sport,
  SportsResponse,
  UpdateSportDto,
} from '../../shared/interfaces/sport.interface';

export const sportsActions = createActionGroup({
  source: 'Sports',
  events: {
    loadSports: props<{ id?: string }>(),
    loadSportsSuccess: props<{ response?: SportsResponse; sport?: Sport }>(),
    loadSportsFailure: props<{ error: unknown }>(),

    createSport: props<{ sport: CreateSportDto }>(),
    createSportSuccess: emptyProps(),
    createSportFailure: props<{ error: unknown }>(),

    updateSport: props<{ id: string; sport: UpdateSportDto }>(),
    updateSportSuccess: emptyProps(),
    updateSportFailure: props<{ error: unknown }>(),

    deleteSport: props<{ id: string }>(),
    deleteSportSuccess: props<{ id: string }>(),
    deleteSportFailure: props<{ error: unknown }>(),
  },
});
