import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Material from '@primeuix/themes/material';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

import * as clubsEffects from './store/clubs/clubs.effects';
import { clubsReducer } from './store/clubs/clubs.store';
import * as competitionsEffects from './store/competitions/competitions.effects';
import { competitionsReducer } from './store/competitions/competitions.store';
import * as contentTypesEffects from './store/content-types/content-types.effects';
import { contentTypesReducer } from './store/content-types/content-types.store';
import * as nationalTeamsEffects from './store/national-teams/national-teams.effects';
import { nationalTeamsReducer } from './store/national-teams/national-teams.store';
import * as newsEffects from './store/news/news.effects';
import { newsReducer } from './store/news/news.store';
import * as personsEffects from './store/persons/persons.effects';
import { personsReducer } from './store/persons/persons.store';
import * as recordsEffects from './store/records/records.effects';
import { recordsReducer } from './store/records/records.store';
import * as sportsEffects from './store/sports/sports.effects';
import { sportsReducer } from './store/sports/sports.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Material,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
    provideClientHydration(withEventReplay()),
    provideStore({
      news: newsReducer,
      sports: sportsReducer,
      contentTypes: contentTypesReducer,
      nationalTeams: nationalTeamsReducer,
      clubs: clubsReducer,
      persons: personsReducer,
      competitions: competitionsReducer,
      records: recordsReducer,
    }),
    provideEffects(
      newsEffects,
      sportsEffects,
      contentTypesEffects,
      nationalTeamsEffects,
      clubsEffects,
      personsEffects,
      competitionsEffects,
      recordsEffects,
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    MessageService,
  ],
};
