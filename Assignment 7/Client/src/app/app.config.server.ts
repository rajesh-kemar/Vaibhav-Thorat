import { mergeApplicationConfig, ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

const serverConfig: ApplicationConfig = {
  providers: [
    // provideServerRendering(withRoutes(serverRoutes))
     provideHttpClient(withFetch()),    // ✅ Required!
    provideRouter(routes),
   
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
