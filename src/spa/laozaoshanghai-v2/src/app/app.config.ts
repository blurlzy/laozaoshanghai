import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
// auth0
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { AllowList } from './auth0-config';
import { environment } from '../environments/environment';
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
    provideAuth0({
      domain: environment.auth0TenantDomain,
      clientId: environment.auth0ClientId,
      authorizationParams: {
        audience: environment.auth0Audience,
        redirect_uri: `${window.location.origin}${environment.auth0CallbackRedirectUri}`,
      },
      // attach the access token only to the admin (write) endpoints
      httpInterceptor: { allowedList: [...AllowList] },
    }),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authHttpInterceptorFn]),
    ),
    // show loader on http requests
    //{ provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: ErrorHandler, useExisting: GlobalErrorHandler },
  ]
};
