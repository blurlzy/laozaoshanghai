import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
// angular material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
    selector: 'app-header-public',
    imports: [CommonModule, RouterLink,
        ReactiveFormsModule, MatMenuModule, MatIconModule, MatButtonModule, MatButtonToggleModule],
    template: `
  <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top" style="z-index: 99;">
    <div class="container-fluid">
      <img src="./assets/images/logo.png" alt="" style="width: 38px;height: 38px;margin-right: 10px;">
      <a class="navbar-brand" routerLink="/">老早上海</a>
      <button class="navbar-toggler" type="button" (click)="toggleNav()">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div [ngClass]="collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show'">
        <button mat-button [matMenuTriggerFor]="menu" class="me-1">年份</button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '90年代' }">90年代</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '80年代' }">80年代</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '70年代' }">70年代</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '60年代' }">60年代</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '民国' }">民国</button>
        </mat-menu>

        <button mat-button [matMenuTriggerFor]="menu2" class="me-1">地区</button>
        <mat-menu #menu2="matMenu">
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '静安' }">静安</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '卢湾' }">卢湾</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '黄浦' }">黄浦</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '徐汇' }">徐汇</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '虹口' }">虹口</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '长宁' }">长宁</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '南市' }">南市</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '杨浦' }">杨浦</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '闸北' }">闸北</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '普陀' }">普陀</button>
          <button mat-menu-item [routerLink]="['/']" [queryParams]="{ keyword: '浦东' }">浦东</button>
        </mat-menu>
        
        <button mat-button routerLink="/about">关于</button>
        <a mat-button href="https://zongyi.me/" target="_blank">Blog</a>

        <div class="nav me-auto my-2 my-lg-0 navbar-nav-scroll"></div>
        <div class="d-flex">
          <input class="form-control me-2" type="search" placeholder="关键字" aria-label="Search"
            [formControl]="keywordsCtrl" (keyup.enter)="search()">
          <button mat-button (click)="search()">搜索</button>
        </div>
      </div>
    </div>
  </nav>
  `,
    styles: `
  .navbar-brand {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    font-size: 1rem;
    // background-color: rgba(0, 0, 0, 0.25);
    // box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.25);
  }

  .navbar .navbar-toggler {
    top: 0.25rem;
    right: 1rem;
  }
  
  .navbar .form-control {
    padding: 0.75rem 1rem;
    border-width: 0;
    border-radius: 0;
  }`
})
export class HeaderPublicComponent {
  @Output() searchEvent = new EventEmitter<string>();
  
  // nav responsive (mobile view)
  collapsed = true;
	keywordsCtrl = new FormControl('', [Validators.required]);

  // ctor
  constructor(private router: Router){

  }
  // public methods
  // toggle menu when it's in mobile view
  toggleNav(): void {
    this.collapsed = !this.collapsed;
  }

  // search
  search(): void {
    // if (this.keywordsCtrl.invalid) {
    //   return;
    // }

    // emit the search event with keyword
    this.searchEvent.emit(this.keywordsCtrl.value?.trim());
  }
}
