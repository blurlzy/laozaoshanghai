import { Routes } from '@angular/router';

// screens
import { DefaultScreenComponent } from './screens/default-screen.component';
import { DetailScreenComponent } from './screens/detail-screen.component';
import { AboutScreenComponent } from './screens/about-screen.component';

// routes for public pages
export const public_routes: Routes = [
	{ path: '', component: DefaultScreenComponent },
	{ path: 'content', component: DefaultScreenComponent },
	{ path: 'info/:id', component: DetailScreenComponent },
	{ path: 'about', component: AboutScreenComponent },
	//{ path: '**',   redirectTo: '', pathMatch: 'full' } // redirect to default screen
];
