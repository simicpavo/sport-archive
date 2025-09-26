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

import * as newsEffects from './store/news/news.effects';
import { newsReducer } from './store/news/news.store';
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
    }),
    provideEffects(newsEffects, sportsEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    MessageService,
  ],
};
