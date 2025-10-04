import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Loader } from '../../shared/services/loader.service';
import { ContentItem, Comment } from '../content-item.model';
import { PagedList } from '../../shared/models/paged-list.model';
import { ContentService } from '../content.service';
import { UtilService } from '../../shared/services/util.service';
// components
import { AdsResponsiveComponent } from '../components/ads-responsive.component';
import { TagListComponent } from '../components/tag-list.component';
import { PlaceholderHorizontalComponent } from '../components/placeholder-horizontal.component';
import { ImgSliderComponent } from '../components/img-slider.component';
import { CommentListComponent } from '../components/comment-list.component';
import { CommentFormComponent } from '../components/comment-form.component';

@Component({
    selector: 'app-detail-screen',
    imports: [CommonModule, RouterModule, FormsModule,
        AdsResponsiveComponent, TagListComponent, PlaceholderHorizontalComponent, ImgSliderComponent,
        CommentListComponent, CommentFormComponent
    ],
    template: `
  <div class="container col-xl-12 px-2 py-3">
    <div class="row g-lg-5 mt-1">
      <div class="col-lg-7 text-center text-lg-start">
        <app-img-slider [images]="currentItem?.mediaItems" [currentImgUrl]="currentItem?.defaultImageUrl"></app-img-slider>

        <div class="mt-3">
          <div *ngIf="currentItem">
            <p class="mb-2" style="white-space: pre-line">
              {{ currentItem?.text }}
            </p>
            <div class="mb-2" style="font-size: 10pt;">
              收录日期: {{ currentItem?.dateCreated | date }}
            </div>
            <div class="mb-2" style="font-size: 10pt;">
              来源: {{ currentItem?.source }}
            </div>


            <app-tag-list [tags]="currentItem?.tags"></app-tag-list>
          </div>
          
          <!-- placeholders, ONLY visible when the data is loading-->
          @if(loader.isLoading | async ) {
            <app-placeholder-horizontal></app-placeholder-horizontal>
          }

          <!-- Hidden on screens smaller than sm (xs only): d-none d-sm-block -->
          <div class="mt-5">
            <app-ads-responsive></app-ads-responsive>
          </div>
                  
        </div>
      </div>
      <div class="col-lg-5 col-md-10 mx-auto">
        <div class="d-flex flex-column align-items-stretch flex-shrink-0">
          <app-comment-form [contentId]="contentId" (commentSubmitted)="reloadComments($event)"></app-comment-form>
          <br>
          <app-comment-list [data]="comments"></app-comment-list>
        </div>
      </div>
    </div>
  </div>
  `,
    styles: ``
})
export class DetailScreenComponent {
  contentId: string;
  currentItem: ContentItem;
  comments: Comment[] = [];
  // ctor
  constructor(
    private activatedRoute: ActivatedRoute,
    private contentService: ContentService,
    private util: UtilService,
    private router: Router,
    //private clipboard: Clipboard,
    public loader: Loader) {

  }

  ngOnInit() {
    // retreive route params
    this.contentId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.contentId && this.contentId.length > 0) {

      // validate  id
      if (!this.util.isValidGUID(this.contentId)) {
        // route to home
        this.router.navigate(['/404']);
        return;
      }

      // get content by id			
      this.getContentItem(this.contentId);
      // get comments by id
      this.getComments(this.contentId);
    }
  }

  // download image
  downloadImage(item: ContentItem): void {
    if (item.defaultImageUrl) {
      window.open(item.defaultImageUrl, '_blank');
    }
  }

  // select image
  selectImage(item: ContentItem, imageUrl: string): void {
    item.defaultImageUrl = imageUrl;
  }

  // reload comments
  reloadComments(event: any): void {
    console.log('reload comments');
    this.getComments(this.contentId);
  }

  private getContentItem(id: string): void {
    this.contentService.getContentItem(id)
      .subscribe(data => {
        this.currentItem = data;
      })
  }

  private getComments(contentId: string) {
    this.contentService.getContentComments(contentId)
      .subscribe(data => {
        this.comments = data;
      })
  }
}
