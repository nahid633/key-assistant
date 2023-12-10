import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HttpClientModule} from "@angular/common/http";
import {HttpClientInMemoryWebApiModule} from "angular-in-memory-web-api";
import {InMemoryDataService} from "./services/in-memory-data.service";
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule, HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false })), provideRouter(routes),
    provideAnimations()
]
};
