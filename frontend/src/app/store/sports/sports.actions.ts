import { createActionGroup, props } from '@ngrx/store';
import {
  CreateSportDto,
  Sport,
  SportsResponse,
  UpdateSportDto,
} from '../../cms/sports/sport.interface';

export const SportsActions = createActionGroup({
  source: 'Sports',
  events: {
    loadSports: props<{ id?: string }>(),
    loadSportsSuccess: props<{ response?: SportsResponse; sport?: Sport }>(),
    loadSportsFailure: props<{ error: unknown }>(),

    createSport: props<{ sport: CreateSportDto }>(),
    createSportSuccess: props<{ sport: Sport }>(),
    createSportFailure: props<{ error: unknown }>(),

    updateSport: props<{ id: string; sport: UpdateSportDto }>(),
    updateSportSuccess: props<{ sport: Sport }>(),
    updateSportFailure: props<{ error: unknown }>(),

    deleteSport: props<{ id: string }>(),
    deleteSportSuccess: props<{ id: string }>(),
    deleteSportFailure: props<{ error: unknown }>(),
  },
});
