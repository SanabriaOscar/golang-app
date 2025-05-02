
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';

import { provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app.routes';

import { categoryReducer } from './categories/store/category.reducer';
import { CategoryEffects } from './categories/store/category.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuración básica de Angular
    provideRouter(routes),
    provideHttpClient(withFetch()),

    // Configuración de NgRx
    provideStore(),
    provideState('categories', categoryReducer),
    provideEffects(CategoryEffects), // Sin array

    // Ionic
    provideIonicAngular({ mode: 'md' }),

    // SSR y otros
    provideClientHydration(withEventReplay()),
    provideRouterStore()
  ]
};
