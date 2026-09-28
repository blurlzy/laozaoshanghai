import { Routes } from '@angular/router';

// layouts
import { MainLayout } from './shared/main-layout';

export const routes: Routes = [
    	{
		path: '',
		component: MainLayout,
		children: [
			// public module
			{ path: '', loadChildren: () => import('./main-module/main.routes').then(m => m.MAIN_ROUTES) },
		]

	},

	// {
	// 	path: '404',
	// 	component: MainLayout,
	// 	children: [
	// 		{ path: '', component: NotFoundComponent },
	// 	]

	// },
	{ path: '**', redirectTo: '404', pathMatch: 'full' } // redirect to default screen
];
