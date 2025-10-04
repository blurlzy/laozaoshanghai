import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedList } from '../shared/models/paged-list.model';
import { environment } from '../../environments/environment';
import { ContentItem, Comment } from '../public/content-item.model';

@Injectable({ providedIn: 'root' })
export class ManagementService {
	private apiEndpoint = environment.apiEndpoint + 'api/contentItems';
	private commentApiEndpoint = environment.apiEndpoint + 'api/comments';

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

	// create content item
	addContentItem(data: any): Observable<{}> {
		return this.httpClient.post(this.apiEndpoint, data);
	}

	// update content item
	updateContentItem(data: any): Observable<{}> {
		return this.httpClient.put(this.apiEndpoint + `/${data.id}`, data);
	}

	// delete content item
	deleteContentItem(id: string): Observable<{}> {
		return this.httpClient.delete(this.apiEndpoint + `/${id}`);
	}


	// list comments
	listComments(reviewed: boolean, pageIndex: number, pageSize: number): Observable<PagedList<Comment>> {
		let url = `${this.commentApiEndpoint}?reviewed=${reviewed}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
		return this.httpClient.get<PagedList<Comment>>(url);
	}

	approveComment(model: any): Observable<{}> {
		return this.httpClient.put(this.commentApiEndpoint + '/review', model);
	}

	// delete comment
	deleteComment(id: string): Observable<{}> {
		return this.httpClient.delete(this.commentApiEndpoint + `/${id}`);
	}
}
