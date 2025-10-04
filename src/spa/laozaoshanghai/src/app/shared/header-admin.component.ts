import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router,  RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
// angular material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
// auth0
import { AuthService } from '@auth0/auth0-angular';

@Component({
    selector: 'app-header-admin',
    imports: [CommonModule, RouterLink, ReactiveFormsModule,
        MatMenuModule, MatIconModule, MatButtonModule, MatButtonToggleModule],
    template: `
  <header class="p-3 mb-3 navbar-light bg-light border-bottom fixed-top" style="z-index: 99;">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a routerLink="/admin" class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
          Admin Center
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 ms-3">
          <li><a routerLink="/admin" class="nav-link px-2 link-dark">Content</a></li>
          <li><a routerLink="/admin/comments" class="nav-link px-2 link-dark">Comment</a></li>
        </ul>

        <div class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
          <input type="search" class="form-control" placeholder="Search" [formControl]="keywordsCtrl" (keyup.enter)="search()" >
        </div>

        <div class="text-end">
          <button mat-button [matMenuTriggerFor]="menu">
            <i class="bi bi-person-circle"></i> {{ profile.name }}
          </button>
          <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="logout()">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
              <button mat-menu-item routerLink="/">
                <i class="bi bi-house-check-fill"></i> Laozaoshanghai
              </button>
          </mat-menu>
        </div>
      </div>
    </div>
  </header>
  `,
    styles: ``
})
export class HeaderAdminComponent {
	profile:any = {};
	keywordsCtrl = new FormControl('', [Validators.required]);
  document = Inject(DOCUMENT);
  // ctor
  constructor(public auth: AuthService, 
              private router: Router) { 

  }

  // public methods
  logout(): void {
    // logout 
    this.auth.logout();
  }

  // search
  search(): void {
    if (this.keywordsCtrl.invalid) {
      return;
    }

    this.router.navigate(['/admin'], { queryParams: { keyword: this.keywordsCtrl.value.trim() } })
  }
}
