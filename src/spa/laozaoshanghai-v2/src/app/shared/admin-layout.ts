import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  imports: [RouterModule],
  selector: 'app-admin-layout',
  styles: ``,
  template: ` 
  <header class="masthead">
    <a class="brand" routerLink="/admin" aria-label="Admin Portal">
      <span class="seal seal--sm" aria-hidden="true">
        <svg viewBox="0 0 100 100"><g filter="url(#seal-grain)">
          <rect x="4" y="4" width="92" height="92" rx="7" fill="var(--cinnabar)"></rect>
          <rect x="11" y="11" width="78" height="78" rx="3" fill="none" stroke="var(--paper)" stroke-width="2.4"></rect>
          <text x="69" y="47" class="seal__glyph">老</text><text x="69" y="80" class="seal__glyph">早</text>
          <text x="31" y="47" class="seal__glyph">上</text><text x="31" y="80" class="seal__glyph">海</text>
        </g></svg>
      </span>
      <span class="brand__text">Admin Portal<em>laozaoshanghai.com</em></span>
    </a>


    <form class="search" role="search">
      <label for="q" class="sr-only">搜索</label>
      <input #q type="search" placeholder="搜索…">
      <button type="submit" aria-label="搜索">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5"></circle>
          <path d="M15.5 15.5 21 21"></path>
        </svg>
      </button>
    </form>

    <!-- <button class="menu-btn" type="button" aria-label="菜单"
      [attr.aria-expanded]="navOpen()" aria-controls="mainNav"
      (click)="toggleNav()">
      <i></i><i></i>
    </button> -->
  </header>

  <main> 
    <div class="view" data-view="home">
      <!-- Router outlet for the main content -->
      <router-outlet></router-outlet>
    </div>    
  </main>

 
  `,
})
export class AdminLayout {}
