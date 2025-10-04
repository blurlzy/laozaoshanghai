import { Routes } from '@angular/router';
import { LayoutPublicComponent } from './shared/layout-public.component';
import { LayoutAdminComponent } from './shared/layout-admin.component';
// system screens
import { NotFoundComponent } from './shared/components/not-found.component';
// register routes
export const routes: Routes = [
	{
		path: '',
		component: LayoutPublicComponent,
		children: [
			// public module
			{ path: '', loadChildren: () => import('./public/public.routes').then(m => m.public_routes) },
		]

	},
	{
		path: 'admin',
		component: LayoutAdminComponent,
		children: [
			// admin module
			{ path: '', loadChildren: () => import('./admin/admin.routes').then(m => m.admin_routes) },
		]
	},
	{
		path: '404',
		component: LayoutPublicComponent,
		children: [
			{ path: '', component: NotFoundComponent },
		]

	},
	{ path: '**', redirectTo: '404', pathMatch: 'full' } // redirect to default screen
];
