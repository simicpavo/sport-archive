import { createActionGroup, props } from '@ngrx/store';
import {
  Competition,
  CompetitionResponse,
  CreateCompetitionDto,
  UpdateCompetitionDto,
} from '../../shared/interfaces/competition.interface';

export const competitionsActions = createActionGroup({
  source: 'Competitions',
  events: {
    loadCompetitions: props<{ id?: string }>(),
    loadCompetitionsSuccess: props<{
      response?: CompetitionResponse;
      competition?: Competition;
    }>(),
    loadCompetitionsFailure: props<{ error: unknown }>(),

    createCompetition: props<{ competition: CreateCompetitionDto }>(),
    createCompetitionSuccess: props<{ competition: Competition }>(),
    createCompetitionFailure: props<{ error: unknown }>(),

    updateCompetition: props<{ id: string; competition: UpdateCompetitionDto }>(),
    updateCompetitionSuccess: props<{ competition: Competition }>(),
    updateCompetitionFailure: props<{ error: unknown }>(),

    deleteCompetition: props<{ id: string }>(),
    deleteCompetitionSuccess: props<{ id: string }>(),
    deleteCompetitionFailure: props<{ error: unknown }>(),
  },
});
