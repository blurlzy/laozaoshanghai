import { Component, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// rxjs 
import { Observable, pipe, Subscription } from 'rxjs'
import { shareReplay, map, finalize } from 'rxjs/operators';
// material
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// models
import { ContentItem, Comment, SidenavViewOptions } from '../content-item.model';
import { PagedList } from '../../shared/models/paged-list.model';
import { ContentService } from '../content.service';
import { Loader } from '../../shared/services/loader.service';
// comnponents
import { ContentCardComponent } from '../components/content-card.component';
import { CommentListComponent } from '../components/comment-list.component';
import { CommentFormComponent } from '../components/comment-form.component';
import { ImgSliderComponent } from '../components/img-slider.component';
import { TagListComponent } from '../components/tag-list.component';
import { AdsResponsiveComponent } from '../components/ads-responsive.component';

@Component({
    selector: 'app-default-screen',
    imports: [CommonModule, ReactiveFormsModule, MatSidenavModule, MatPaginatorModule, MatButtonModule, MatIconModule,
        ContentCardComponent, AdsResponsiveComponent, CommentListComponent, CommentFormComponent, ImgSliderComponent, TagListComponent],
    template: `
	<mat-drawer-container autosize [hasBackdrop]="(isHandset$ | async) ? true : false" class="container-bgcolor">
		<!-- sidenav (panel)-->
		<mat-drawer #sideNav mode="over" opened="false" position="end" [autoFocus]="true" class="right-sidenav">
			<div class="ms-2 mt-1">
				<button type="button" class="btn" (click)="sideNav.toggle()" >
					<i class="bi bi-x-circle-fill h3"></i>
				</button>

				@if(sidenavViewOpt === SidenavOptions.contenteDetails) {
					<div class="card border-0 px-2 py-2"> 
						<app-img-slider [images]="selectedItem?.mediaItems" [currentImgUrl]="selectedItem?.defaultImageUrl"></app-img-slider>
						<p class="mt-1" style="white-space: pre-line">{{ selectedItem?.text }}</p>
						<app-tag-list [tags]="selectedItem?.tags"></app-tag-list>

						<figcaption class="blockquote-footer mt-2">
							<cite title="Source Title"> 收录日期 {{ selectedItem?.dateCreated | date }}</cite>
						</figcaption>
		
					</div>
				}

				@if(sidenavViewOpt === SidenavOptions.contentComments) {
					<app-comment-form [contentId]="selectedItem.id" (commentSubmitted)="reloadComments($event)"></app-comment-form>
					<br>
					<app-comment-list [data]="comments"></app-comment-list>
				}

			</div>
		</mat-drawer>

		<mat-drawer-content>
			<div class="container-fluid">
				<div class="row custom-row">
					<div class="card-columns">
						@for (content of pagedList.data; track content.id) {
							<app-content-card [content]="content" (openContentSidenav)="showContentSidenav($event)" (openCommentSidenav)="showCommentSidenav($event)"></app-content-card>
						}	
						
						<!-- ads -->
						<div class="card material-card border-0 rounded-4 mt-3 py-3 d-none d-sm-block">
							<app-ads-responsive></app-ads-responsive>
						</div>
					</div>

					<div class="col-lg-12">
						<mat-paginator #paginator 
							[pageSize]="filterFormGroup.value.pageSize"
							[pageIndex]="filterFormGroup.value.pageIndex" 
							[length]="pagedList.total"
							[hidePageSize]="true" 
							[disabled]="loader.isLoading | async"
							(page)="pageIndexChanged($event)" 
							showFirstLastButtons>
						</mat-paginator> 

					</div>
				</div>

			</div>
		</mat-drawer-content>
	</mat-drawer-container>
  `,
    styles: `
	.custom-row {
		margin-left: 5rem;
		margin-right: 5rem;
		margin-top: 2rem;
	}
	
	.card-columns {
		column-count: 4;
		column-gap: 1rem;
	}
	
	.right-sidenav {
		width: 550px;
		height: 100%;
		position: fixed;
		top: 64px;
		right: 0px;
	}
	

	@media (max-width: 1200px) {
		.card-columns {
			column-count: 3;
		}
	}
	
	@media (max-width: 992px) {
		.card-columns {
			column-count: 2;
		}
	}
	
	@media (max-width: 576px) {
		.card-columns {
			column-count: 1;
		}
	}
	
	@media screen and (max-width: 768px) {
		.custom-row {
			margin-left: 0rem;
			margin-right: 0rem;
			margin-top: 1rem;
		}
	
		.right-sidenav {
			width: 380px;
		}
	
		.material-card{
			margin-right: 0rem;
		}
	}
	`
})
export class DefaultScreenComponent {
	pagedList: PagedList<ContentItem> = { data: [], total: 0 };
	selectedItem: ContentItem;
	comments: Comment[] = [];
	isLoading: boolean = false;
	isHandest: boolean = false;
	sidenavViewOpt = SidenavViewOptions.contenteDetails;
	public SidenavOptions = SidenavViewOptions;

	// filter form group
	filterFormGroup = new FormGroup({
		keyword: new FormControl(''),
		pageSize: new FormControl(30), // default page size: 30
		pageIndex: new FormControl(0)
	});

	// detect the screen size
	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	// element ref
	@ViewChild('sideNav') sideNav: MatDrawer;
	// @ViewChild('paginator') paginator: MatPaginator;

	// ctor
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private breakpointObserver: BreakpointObserver,
		private contentService: ContentService,
		public loader: Loader) {

	}

	ngOnInit(): void {
		// query params change
		this.activatedRoute.queryParams.subscribe(params => {
			const pageIndex = +params['pageIndex'];
			const keyword = params['keyword'];

			// retrive the query params
			this.filterFormGroup.patchValue({
				pageIndex: pageIndex ? pageIndex : 0,
				keyword: keyword ? keyword : '',
			});

			// clear result
			this.pagedList = { data: [], total: 0 };
			// load data
			this.getContents(this.filterFormGroup.value.keyword, this.filterFormGroup.value.pageIndex, this.filterFormGroup.value.pageSize);
		});

		this.isHandset$.subscribe((val: boolean) => {
			this.isHandest = val;
		 });
	}

	showContentSidenav(event: any): void {
		this.selectedItem = event;
		this.sidenavViewOpt = SidenavViewOptions.contenteDetails;
		// open sidenav panel
		this.sideNav.open();
	}

	showCommentSidenav(event: any): void {
		// load comments
		this.selectedItem = event;
		this.sidenavViewOpt = SidenavViewOptions.contentComments;
		this.contentService.getContentComments(this.selectedItem.id)
			.subscribe(data => {
				this.comments = data;
			});

		// open sidenav panel
		this.sideNav.open();
	}

	reloadComments(event: any): void {

	}

	// page index changed
	pageIndexChanged(event: PageEvent): void {
		// update the page index in the query string, which will trigger the query params changes event		
		this.updateQueryParams(event.pageIndex);
	}

	// private methods
	private getContents(keyword: string, pageIndex: number, pageSize: number): void {
		// retreive content list
		this.contentService.getContent(keyword, pageIndex, pageSize)
			.subscribe(data => {
				this.pagedList = data;
			});
	}

	// update query params
	private updateQueryParams(pageIndex: number): void {
		this.router.navigate(['/'], {
			queryParams: {
				pageIndex: pageIndex,
				keyword: this.filterFormGroup.value.keyword,
			}
		});
	}


	/**
		  * HostListener will listen to 'scroll' on the element this directive is applied to.
		  * 
		  * If that element has overflow and a fixed height, 
		  * this event will be triggered whenever the element is scrolled.
		  */
	// // check if scroll to the bottom
	// @HostListener('window:scroll', ['$event'])
	// onScroll(event: Event): void {
	// 	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	// 	const scrollHeight = document.documentElement.scrollHeight;
	// 	const clientHeight = window.innerHeight;

	// 	// Optional: a small offset so we trigger slightly before the exact bottom
	// 	const offset = 150;

	// 	// Don't do anything if we're already loading
	// 	// only for handset
	// 	if (this.isLoading || !this.isHandest) {
	// 		return;
	// 	}

	// 	// Check if we're at the bottom of the page
	// 	if (scrollTop + clientHeight >= scrollHeight - offset) {			
	// 		console.log('Reached (or near) the bottom of the page!');
	// 		// load more data
	// 		this.filterFormGroup.patchValue({
	// 			pageIndex: this.filterFormGroup.value.pageIndex + 1,
	// 			pageSize: 6 // reset the page size to 6 for loading more data
	// 		});
	// 		this.isLoading = true;
	// 		this.contentService.getContent(this.filterFormGroup.value.keyword, this.filterFormGroup.value.pageIndex, this.filterFormGroup.value.pageSize)
	// 			.pipe(finalize(() => this.isLoading = false))
	// 			.subscribe(data => {
	// 				// append the data
	// 				this.pagedList.data = [
	// 					...this.pagedList.data,
	// 					...data.data
	// 				 ];
	// 				//this.pagedList = data;
	// 			});
	// 	}
	// }
}
