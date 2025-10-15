import { createActionGroup, emptyProps, props } from '@ngrx/store';
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
    createCompetitionSuccess: emptyProps(),
    createCompetitionFailure: props<{ error: unknown }>(),

    updateCompetition: props<{ id: string; competition: UpdateCompetitionDto }>(),
    updateCompetitionSuccess: emptyProps(),
    updateCompetitionFailure: props<{ error: unknown }>(),

    deleteCompetition: props<{ id: string }>(),
    deleteCompetitionSuccess: props<{ id: string }>(),
    deleteCompetitionFailure: props<{ error: unknown }>(),
  },
});
