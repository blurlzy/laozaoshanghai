import { HttpMethod   } from '@auth0/auth0-angular';
// env
import { environment } from '../environments/environment';

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
		uri: `${environment.apiEndpoint.slice(0, -1)}/api/comments/review`,
		httpMethod: HttpMethod.Put,
	 },
]