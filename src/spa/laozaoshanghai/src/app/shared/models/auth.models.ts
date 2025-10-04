import { environment } from '../../../environments/environment';
import { HttpMethod } from '@auth0/auth0-angular';

// APIs require authentication
export const ProtectedApiList = [
	// content APIs
	{ route: 'api/contentItems', method: 'post' },
	{ route: 'api/contentItems', method: 'put' },
	{ route: 'api/contentItems', method: 'delete' },
	// comment APIs
	{ route: 'api/comments', method: 'get' },
	{ route: 'api/comments/review', method: 'put' },
	{ route: 'api/comments', method: 'delete' }
];


// auth0 allow list (require to add access token to http request header)
export const AllowList = [
	{
		uri: `${environment.apiEndpoint.slice(0, -1)}/api/contentItems`,
		httpMethod: HttpMethod.Post,
	},
	{
		uri: `${environment.apiEndpoint.slice(0, -1)}/api/contentItems/*`,
		httpMethod: HttpMethod.Put,
	},
	{
		uri: `${environment.apiEndpoint.slice(0, -1)}/api/contentItems/*`,
		httpMethod: HttpMethod.Delete,
	},
	{
		uri: `${environment.apiEndpoint.slice(0, -1)}/api/comments`,
		httpMethod: HttpMethod.Get,
	},
	{
		uri: `${environment.apiEndpoint.slice(0, -1)}/api/comments/*`,
		httpMethod: HttpMethod.Delete,
	},
	{
		uri: `${environment.apiEndpoint.slice(0, -1)}/api/comments/review/*`,
		httpMethod: HttpMethod.Put,
	},
]