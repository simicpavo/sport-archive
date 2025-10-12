import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateNationalTeamDto,
  NationalTeam,
  NationalTeamResponse,
  UpdateNationalTeamDto,
} from '../../shared/interfaces/national-team.interface';

export const nationalTeamsActions = createActionGroup({
  source: 'NationalTeams',
  events: {
    loadNationalTeams: props<{ id?: string }>(),
    loadNationalTeamsSuccess: props<{
      response?: NationalTeamResponse;
      nationalTeam?: NationalTeam;
    }>(),
    loadNationalTeamsFailure: props<{ error: unknown }>(),

    createNationalTeam: props<{ nationalTeam: CreateNationalTeamDto }>(),
    createNationalTeamSuccess: emptyProps(),
    createNationalTeamFailure: props<{ error: unknown }>(),

    updateNationalTeam: props<{ id: string; nationalTeam: UpdateNationalTeamDto }>(),
    updateNationalTeamSuccess: emptyProps(),
    updateNationalTeamFailure: props<{ error: unknown }>(),

    deleteNationalTeam: props<{ id: string }>(),
    deleteNationalTeamSuccess: props<{ id: string }>(),
    deleteNationalTeamFailure: props<{ error: unknown }>(),
  },
});
