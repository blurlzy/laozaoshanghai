import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptors, withInterceptorsFromDi, withFetch } from '@angular/common/http';

// auth0 integration
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';

// module routes
import { routes } from './app.routes';
// interceptors
import { LoaderInterceptor } from './shared/services/http-interceptor.service';
import { AllowList } from './auth0-config';
// handlers
import { GlobalErrorHandler } from './shared/services/error-handler.service';
// env
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    // auth0 config
    provideAuth0({
      domain: environment.auth0TenantDomain,
      clientId: environment.auth0ClientId,
      authorizationParams: {
        audience: environment.auth0Audience,
        redirect_uri: `${window.location.origin}${environment.auth0CallbackRedirectUri}`
      },
      // The AuthHttpInterceptor configuration
      httpInterceptor: {
        allowedList: [
          ...AllowList
        ],
      }
    }),
    // Configuring interceptors 
    // The interceptors you configure are chained together in the order that you've listed them in the providers. ** withInterceptors([LoaderInterceptor])
    // ** It's strongly recommended to enable  fetch for applications that use Server-Side Rendering for better performance and compatibility.
    // https://angular.io/api/common/http/provideHttpClient
    provideHttpClient(
      withFetch(), 
      withInterceptorsFromDi(),
      // auth0 interceptor
      withInterceptors([authHttpInterceptorFn])
      ),
    // show loader on http requests
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    // global error handler
    { provide: ErrorHandler,  useClass: GlobalErrorHandler
    },
  ],
};
