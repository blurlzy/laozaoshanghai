import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [ RouterLink ],
  template: `
      <div class="container text-center" style="padding-top: 100px; padding-bottom: 200px;">
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page or resource you were looking for does not exist.</p>
        <a class="btn btn-outline-dark btn-lg mt-3" routerLink="/"role="button"><i class="bi bi-house-door-fill"></i> Go Home</a>
      </div>
  `,
  styles: ``
})
export class NotFoundComponent {

}
