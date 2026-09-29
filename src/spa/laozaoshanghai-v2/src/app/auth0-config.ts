import { HttpInterceptorRouteConfig } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';

const api = environment.apiEndpoint.replace(/\/$/, '');

// Requests that need the Auth0 access token; everything else (public reads) is sent anonymously.
// Plain method strings: the SDK's HttpMethod is a const enum, which isolatedModules can't use.
export const AllowList: HttpInterceptorRouteConfig[] = [
	{ uri: `${api}/api/contentItems`, httpMethod: 'POST' },
	{ uri: `${api}/api/contentItems/*`, httpMethod: 'PUT' },
	{ uri: `${api}/api/contentItems/*`, httpMethod: 'DELETE' },
	{ uri: `${api}/api/comments`, httpMethod: 'GET' },
	{ uri: `${api}/api/comments/*`, httpMethod: 'DELETE' },
	{ uri: `${api}/api/comments/review`, httpMethod: 'PUT' },
];
