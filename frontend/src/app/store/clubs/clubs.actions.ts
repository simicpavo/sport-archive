import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Club,
  ClubResponse,
  CreateClubDto,
  UpdateClubDto,
} from '../../shared/interfaces/club.interface';

export const clubsActions = createActionGroup({
  source: 'Clubs',
  events: {
    loadClubs: props<{ id?: string }>(),
    loadClubsSuccess: props<{ response?: ClubResponse; club?: Club }>(),
    loadClubsFailure: props<{ error: unknown }>(),

    createClub: props<{ club: CreateClubDto }>(),
    createClubSuccess: emptyProps(),
    createClubFailure: props<{ error: unknown }>(),

    updateClub: props<{ id: string; club: UpdateClubDto }>(),
    updateClubSuccess: emptyProps(),
    updateClubFailure: props<{ error: unknown }>(),

    deleteClub: props<{ id: string }>(),
    deleteClubSuccess: props<{ id: string }>(),
    deleteClubFailure: props<{ error: unknown }>(),
  },
});
