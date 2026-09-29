import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';

// screens
import { AdminMainScreen } from './admin-main-screen';

export const ADMIN_ROUTES: Routes = [
    { path: '', component: AdminMainScreen, canActivate: [authGuardFn], title: '内容管理 · 老早上海' },
];
