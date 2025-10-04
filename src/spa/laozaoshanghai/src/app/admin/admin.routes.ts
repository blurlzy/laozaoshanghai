import { Routes } from '@angular/router';
// auth0
import { authGuardFn } from '@auth0/auth0-angular';

// screen components
import { ContentMgrScreenComponent } from './screens/content-mgr-screen.component';
import { CommentMgrScreenComponent } from './screens/comment-mgr-screen.component';
export const admin_routes: Routes = [
	{ path: '', component: ContentMgrScreenComponent,  canActivate: [authGuardFn]},
	{ path: 'content', component: ContentMgrScreenComponent,  canActivate: [authGuardFn]},
	{ path: 'comments', component: CommentMgrScreenComponent, canActivate: [authGuardFn]}
];
