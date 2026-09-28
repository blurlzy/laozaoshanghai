import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-main-layout',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeMenu()',
    '(window:scroll)': 'onScroll()',
  },
  styles: ``,
  template: ` 
  <header class="masthead" id="top" [class.is-scrolled]="isScrolled()">
    <a class="brand" href="#" aria-label="老早上海 · 首页">
      <span class="seal seal--sm" aria-hidden="true">
        <svg viewBox="0 0 100 100"><g filter="url(#seal-grain)">
          <rect x="4" y="4" width="92" height="92" rx="7" fill="var(--cinnabar)"></rect>
          <rect x="11" y="11" width="78" height="78" rx="3" fill="none" stroke="var(--paper)" stroke-width="2.4"></rect>
          <text x="69" y="47" class="seal__glyph">老</text><text x="69" y="80" class="seal__glyph">早</text>
          <text x="31" y="47" class="seal__glyph">上</text><text x="31" y="80" class="seal__glyph">海</text>
        </g></svg>
      </span>
      <span class="brand__text">老早上海<em>laozaoshanghai.com</em></span>
    </a>

    <nav class="nav" aria-label="主导航">
      <div class="nav__group" data-type="era" [class.is-open]="openMenu() === 'era'">
        <button class="nav__trigger" type="button"
          [attr.aria-expanded]="openMenu() === 'era'" aria-controls="menuEras"
          (click)="toggleMenu('era')">年代</button>
        <div class="nav__panel nav__panel--eras" id="menuEras">
          <p class="nav__panel-note">按年代 · 由近及远</p>
          <ul class="menu-eras" id="eraMenu">
            <li><button class="menu-era" type="button" data-type="era" data-key="00年"><b>〇〇</b><small>年前后</small></button></li>
            <li><button class="menu-era" type="button" data-type="era" data-key="90年代"><b>九〇</b><small>年代</small></button></li>
            <li><button class="menu-era" type="button" data-type="era" data-key="80年代"><b>八〇</b><small>年代</small></button></li>
            <li><button class="menu-era" type="button" data-type="era" data-key="70年代"><b>七〇</b><small>年代</small></button></li>
            <li><button class="menu-era" type="button" data-type="era" data-key="60年代"><b>六〇</b><small>年代</small></button></li>
            <li><button class="menu-era" type="button" data-type="era" data-key="民国"><b>民國</b><small>时期</small></button></li>
          </ul>
        </div>
      </div>
      <div class="nav__group" data-type="district" [class.is-open]="openMenu() === 'district'">
        <button class="nav__trigger" type="button"
          [attr.aria-expanded]="openMenu() === 'district'" aria-controls="menuDistricts"
          (click)="toggleMenu('district')">地区</button>
        <div class="nav__panel nav__panel--districts" id="menuDistricts">
          <p class="nav__panel-note">旧区名 · 以当年为准</p>
          <ul class="menu-districts" id="districtMenu">
            <li><button class="menu-district" type="button" data-type="district" data-key="黄浦">黄浦</button></li>
            <li><button class="menu-district" type="button" data-type="district" data-key="静安">静安</button></li>
            <li><button class="menu-district" type="button" data-type="district" data-key="卢湾">卢湾</button></li>
            <li><button class="menu-district" type="button" data-type="district" data-key="徐汇">徐汇</button></li>
            <li><button class="menu-district" type="button" data-type="district" data-key="虹口">虹口</button></li>
            <li><button class="menu-district" type="button" data-type="district" data-key="长宁">长宁</button></li>
            <li><button class="menu-district" type="button" data-type="district" data-key="南市">南市</button></li>
            <li><button class="menu-district" type="button" data-type="district" data-key="杨浦">杨浦</button></li>
            <li><button class="menu-district" type="button" data-type="district" data-key="闸北">闸北</button></li>
            <li><button class="menu-district" type="button" data-type="district" data-key="普陀">普陀</button></li>
            <li><button class="menu-district" type="button" data-type="district" data-key="浦东">浦东</button></li>
          </ul>
        </div>
      </div>
      <!-- <a href="#archive">旧影</a> -->
      <a href="#/about">关于</a>
    </nav>

    <form class="search" id="searchForm" role="search">
      <label for="q" class="sr-only">搜索</label>
      <input id="q" name="q" type="search" placeholder="搜索…" autocomplete="off">
      <button type="submit" aria-label="搜索">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="M15.5 15.5 21 21"></path></svg>
      </button>
    </form>

    <button class="menu-btn" id="menuBtn" type="button" aria-label="菜单" aria-expanded="false" aria-controls="mainNav">
      <i></i><i></i>
    </button>
  </header>

  <main> 
    <div class="view" data-view="home">
      
      <router-outlet></router-outlet>
    </div>    
  </main>
  `,
})
export class MainLayout {
  readonly openMenu = signal<'era' | 'district' | null>(null);
  readonly isScrolled = signal(window.scrollY > 24);

  onScroll(): void {
    this.isScrolled.set(window.scrollY > 24);
  }

  toggleMenu(menu: 'era' | 'district'): void {
    this.openMenu.update(current => (current === menu ? null : menu));
  }

  closeMenu(): void {
    this.openMenu.set(null);
  }

  // Close when clicking outside a nav group, or after picking an item inside a panel.
  onDocumentClick(event: MouseEvent): void {
    if (!this.openMenu()) return;
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.nav__group') || target.closest('.nav__panel button')) {
      this.closeMenu();
    }
  }
}
