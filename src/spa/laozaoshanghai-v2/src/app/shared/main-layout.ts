import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-main-layout',
  styles: ``,
  template: ` 
  <header class="masthead" id="top">
    <a class="brand" href="#" aria-label="老早上海 · 首页">
      <span class="seal seal--sm" aria-hidden="true">
        <svg viewBox="0 0 100 100"><g filter="url(#seal-grain)">
          <rect x="4" y="4" width="92" height="92" rx="7" fill="var(--cinnabar)"></rect>
          <rect x="11" y="11" width="78" height="78" rx="3" fill="none" stroke="var(--paper)" stroke-width="2.4"></rect>
          <text x="69" y="47" class="seal__glyph">老</text><text x="69" y="80" class="seal__glyph">早</text>
          <text x="31" y="47" class="seal__glyph">上</text><text x="31" y="80" class="seal__glyph">海</text>
        </g></svg>
      </span>
      <span class="brand__text">老早上海<em>laozao shanghai</em></span>
    </a>

    <nav class="nav" aria-label="主导航">
      <div class="nav__group" data-type="era" [class.is-open]="openMenu() === 'era'">
        <button class="nav__trigger" type="button"
          [attr.aria-expanded]="openMenu() === 'era'" aria-controls="menuEras"
          (click)="toggleMenu('era')">年代</button>
        <div class="nav__panel nav__panel--eras" id="menuEras">
          <p class="nav__panel-note">按年代 · 由近及远</p>
          <ul class="menu-eras" id="eraMenu">
            <li><button class="menu-era" type="button" data-type="era" data-key="90年代" aria-label="九十年代，303 帧"><b>九〇</b><small>年代</small><span class="range">1990 — 1999</span><span class="count">303<small>帧</small></span></button></li>
            <li><button class="menu-era" type="button" data-type="era" data-key="80年代" aria-label="八十年代，568 帧"><b>八〇</b><small>年代</small><span class="range">1980 — 1989</span><span class="count">568<small>帧</small></span></button></li>
            <li><button class="menu-era" type="button" data-type="era" data-key="70年代" aria-label="七十年代，183 帧"><b>七〇</b><small>年代</small><span class="range">1970 — 1979</span><span class="count">183<small>帧</small></span></button></li>
            <li><button class="menu-era" type="button" data-type="era" data-key="60年代" aria-label="六十年代，10 帧"><b>六〇</b><small>年代</small><span class="range">1960 — 1969</span><span class="count">10<small>帧</small></span></button></li>
            <li><button class="menu-era" type="button" data-type="era" data-key="民国" aria-label="民国，1,097 帧"><b>民國</b><small>时期</small><span class="range">1912 — 1949</span><span class="count">1,097<small>帧</small></span></button></li>
          </ul>
        </div>
      </div>
      <div class="nav__group" data-type="district">
        <button class="nav__trigger" type="button" aria-expanded="false" aria-controls="menuDistricts">地区</button>
        <div class="nav__panel nav__panel--districts" id="menuDistricts">
          <p class="nav__panel-note">旧区名 · 以当年为准</p>
          <ul class="menu-districts" id="districtMenu"><li><button class="menu-district" type="button" data-type="district" data-key="黄浦">黄浦<sup>364</sup></button></li><li><button class="menu-district" type="button" data-type="district" data-key="静安">静安<sup>142</sup></button></li><li><button class="menu-district" type="button" data-type="district" data-key="卢湾">卢湾<sup>106</sup></button></li><li><button class="menu-district" type="button" data-type="district" data-key="徐汇">徐汇<sup>58</sup></button></li><li><button class="menu-district" type="button" data-type="district" data-key="虹口">虹口<sup>164</sup></button></li><li><button class="menu-district" type="button" data-type="district" data-key="长宁">长宁<sup>21</sup></button></li><li><button class="menu-district" type="button" data-type="district" data-key="南市">南市<sup>63</sup></button></li><li><button class="menu-district" type="button" data-type="district" data-key="杨浦">杨浦<sup>20</sup></button></li><li><button class="menu-district" type="button" data-type="district" data-key="闸北">闸北<sup>9</sup></button></li><li><button class="menu-district" type="button" data-type="district" data-key="普陀">普陀<sup>13</sup></button></li><li><button class="menu-district" type="button" data-type="district" data-key="浦东">浦东<sup>22</sup></button></li></ul>
        </div>
      </div>
      <a href="#archive">旧影</a>
      <a href="#/about">关于</a>
    </nav>

    <form class="search" id="searchForm" role="search">
      <label for="q" class="sr-only">搜索</label>
      <input id="q" name="q" type="search" placeholder="寻一处旧地…" autocomplete="off">
      <button type="submit" aria-label="搜索">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="M15.5 15.5 21 21"></path></svg>
      </button>
    </form>

    <button class="menu-btn" id="menuBtn" type="button" aria-label="菜单" aria-expanded="false" aria-controls="mainNav">
      <i></i><i></i>
    </button>
  </header>

  <main> 
    <router-outlet></router-outlet>
  </main>
  `,
})
export class MainLayout {
  readonly openMenu = signal<'era' | 'district' | null>(null);

  toggleMenu(menu: 'era' | 'district'): void {
    this.openMenu.update(current => (current === menu ? null : menu));
  }
}
