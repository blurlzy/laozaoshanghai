import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { tap } from 'rxjs/operators';
// services
import { Loader } from './loader.service';

// show loader on http request, hide once all the requests are completed
@Injectable({ providedIn: 'root' })
export class LoaderInterceptor implements HttpInterceptor {
   // handle multiple parallel http requests
   private count = 0;
   //ctor
   constructor(public loader: Loader) {

   }

   // show loader on http request
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // avoid error: NG0100: Expression has changed after it was checked
      setTimeout(() => {
         this.loader.isLoading.next(true);
       });

      this.count++;

      return next.handle(req).pipe(
         finalize(() => {
            this.count--;
            // hide loader when the last request is completed
            if (this.count < 1) {
               this.loader.isLoading.next(false);
            }
         })
      );
   }
}


@Injectable()
export class ApiKeyIntercepter implements HttpInterceptor {
	
	constructor() {
			
	}

	// include (azure api management) subscription key in http header
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const apiKey = "<xxxxx>"
		const cloneReq = req.clone({
			setHeaders: { 'Ocp-Apim-Subscription-Key': `${apiKey}` } // attach access token to http request header
		});

		return next.handle(cloneReq)
		.pipe(
			tap(
				event => {
					// Succeeds when there is a response; ignore other events
				},
				error => {
					console.error('api key intercepter failed.');
					//throwError(error);
				}),
			finalize(() => {
				// Log when response observable either completes or errors
			})
		);
	}
}