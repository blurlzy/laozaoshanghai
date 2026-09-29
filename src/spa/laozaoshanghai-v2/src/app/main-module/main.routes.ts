import { Routes } from '@angular/router';

// screens
import { MainScreen } from './main-screen';
import { About } from './about';

export const MAIN_ROUTES: Routes = [
    // Titles on both routes so going back from About restores the home title.
    { path: '', component: MainScreen, title: '老早上海 · 上海老照片' },
    { path: 'about', component: About, title: '关于 · 老早上海' },
];
