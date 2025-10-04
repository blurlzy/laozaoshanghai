import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
// material
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { Loader } from './services/loader.service';
// components
import { HeaderPublicComponent } from './header-public.component';
import { AdsResponsiveComponent } from '../public/components/ads-responsive.component';

@Component({
    selector: 'app-layout-public',
    imports: [CommonModule, RouterOutlet, MatProgressBarModule, MatIconModule, HeaderPublicComponent, AdsResponsiveComponent],
    template: `
  @if (loader.isLoading | async) {
    <mat-progress-bar mode="indeterminate" color="accent" style="z-index:9999"></mat-progress-bar>
  }

  <app-header-public (searchEvent)="search($event)"></app-header-public>

  <div id="top"></div>
  <div style="margin-top: 65px;" class="container-bgcolor">
    <!-- content -->
    <router-outlet></router-outlet>
    <!-- footer -->
    <div class="rights bg-white">
      <p>
        Created by LaozaoShanghai © 2023, 
        <a href="https://twitter.com/laozaoshanghai" target="_blank" class="text-secondary">
          Follow us <i class="bi bi-twitter-x"></i>
        </a> 
      </p>
    </div>
    <div class="mt-3 container">
      <app-ads-responsive></app-ads-responsive>    
    </div>
  </div>
  `,
    styles: `    
    .rights {
      border-top: 1px solid #ececec;
      padding-top: 10px;
      text-align: center;
      padding-bottom: 15px;
    }
    
    .rights p {
      text-transform: uppercase;
      color: #999;
      font-size: 12px;
      margin: 0;
    }
  `
})
export class LayoutPublicComponent {
  constructor(public loader: Loader, private router: Router){

  }

  // pass query params
  search(event:any): void {
    this.router.navigate(['/'], {
      queryParams: { keyword: event }
    });
  }

}
