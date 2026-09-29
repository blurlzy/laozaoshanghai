import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

@Component({
  imports: [RouterModule],
  selector: 'app-admin-layout',
  styles: `
    .admin-actions { grid-column: 3; display: flex; align-items: center; gap: 22px; }
    .admin-user { display: flex; align-items: center; gap: 14px; font-size: 13px; letter-spacing: .08em; color: var(--ink-3); white-space: nowrap; }
    .admin-user button { font-size: 13px; letter-spacing: .2em; color: var(--ink-2); border-bottom: 1px solid var(--line); padding-bottom: 2px; }
    .admin-user button:hover { color: var(--cinnabar); border-color: var(--cinnabar); }
    @media (max-width: 820px) { .admin-user span { display: none; } }
  `,
  template: ` 
  <header class="masthead is-scrolled">
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


    <div class="admin-actions">
      <form class="search" role="search" (submit)="search($event, q)">
        <label for="adminQ" class="sr-only">搜索</label>
        <input #q id="adminQ" type="search" placeholder="搜索…" autocomplete="off" [value]="currentKeyword()">
        <button type="submit" aria-label="搜索">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5"></circle>
            <path d="M15.5 15.5 21 21"></path>
          </svg>
        </button>
      </form>

      <div class="admin-user">
        @if (userName(); as name) { <span>{{ name }}</span> }
        <button type="button" (click)="logout()">退出</button>
      </div>
    </div>

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
export class AdminLayout {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  private readonly user = toSignal(this.auth.user$);
  readonly userName = computed(() => this.user()?.name || this.user()?.email || '');

  /** Keeps the search box in sync with ?keyword= on /admin. */
  readonly currentKeyword = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(map(params => params.get('keyword') ?? '')),
    { initialValue: '' },
  );

  /** Searches content by keyword, starting again from the first page. */
  search(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const keyword = input.value.trim();
    input.blur();
    this.router.navigate(['/admin'], { queryParams: { keyword: keyword || null } });
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
