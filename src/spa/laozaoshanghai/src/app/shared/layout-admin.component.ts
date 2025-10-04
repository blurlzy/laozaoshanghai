import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// material
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
// components
import { HeaderAdminComponent } from './header-admin.component';
// services
import { Loader } from './services/loader.service';

@Component({
    selector: 'app-layout-admin',
    imports: [CommonModule, RouterOutlet,
        MatProgressBarModule, MatIconModule,
        HeaderAdminComponent],
    template: `
    @if (loader.isLoading | async) {
      <mat-progress-bar mode="indeterminate" color="accent" style="z-index:9999"></mat-progress-bar>
    }
    <app-header-admin></app-header-admin>
    <div style="margin-top: 75px;">
      <!-- content -->
      <router-outlet></router-outlet>
    </div>
  `,
    styles: ``
})
export class LayoutAdminComponent {
  
  // ctor
  constructor(public loader: Loader) {

  }
}
