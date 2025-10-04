import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContentItem, Comment } from './content-item.model';
import { PagedList } from '../shared/models/paged-list.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContentService {
	private apiEndpoint = environment.apiEndpoint + 'api/contentItems';
	private messageApiEndpoint = environment.apiEndpoint + 'api/messages';
	private activityApiEndpoint = environment.apiEndpoint + 'api/activities';
	private commentEndpoint = environment.apiEndpoint + 'api/comments';
	// ctor
	constructor(private httpClient: HttpClient) {

	}

	// get contents
	getContent(keyword: string | null, pageIndex: number, pageSize: number): Observable<PagedList<ContentItem>> {
		let url = `${this.apiEndpoint}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
		if (keyword) {
			url += `&keyword=${keyword}`;
		}

		return this.httpClient.get<PagedList<ContentItem>>(url);
	}

	// get single content item by id 
	getContentItem(id: string): Observable<ContentItem> {
		return this.httpClient.get<ContentItem>(this.apiEndpoint + `/${id}`);
	}

	// get total 
	getTotalCount(): Observable<number> {
		return this.httpClient.get<number>(this.apiEndpoint + '/total');
	}

	// get comments by content id
	getContentComments(contentId: string): Observable<Comment[]> {
		return this.httpClient.get<Comment[]>(this.apiEndpoint + `/${contentId}/comments`);
	}

	// add comment
	addComment(newComment:any): Observable<{}> {
		return this.httpClient.post(this.commentEndpoint, newComment);
	}

	// get site updats
	getSiteUpdates(): Observable<any> {
		return this.httpClient.get<any>(this.activityApiEndpoint + '/site');
	}

	// send message
	sendMessage(message: any): Observable<{}> {
		return this.httpClient.post(this.messageApiEndpoint, message);
	}
}