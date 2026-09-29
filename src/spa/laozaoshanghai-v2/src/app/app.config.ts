import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
//routes
import { routes } from './app.routes';
// interceptors
// import { LoaderInterceptor} from './core/services/interceptor-loader.service';
import { GlobalErrorHandler } from './shared/services/error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // binds route/query params (e.g. ?keyword=) to routed components' inputs
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    // show loader on http requests
    //{ provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: ErrorHandler, useExisting: GlobalErrorHandler },
  ]
};
