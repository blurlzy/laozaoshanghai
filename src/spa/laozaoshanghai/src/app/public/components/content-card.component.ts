import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// angular material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
// models & services
import { ContentItem } from '../content-item.model';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-content-card',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="card material-card border-0 rounded-4">		
      <a (click)="showContent(content)" style="cursor: pointer;">
        <img
          [src]="content.imgLoaded === true ? content.defaultImageUrl : './assets/images/placeholder-350_white.png'"
          (load)="content.imgLoaded = true" alt="laozaoshanghai" class="img-fluid">
      </a>

      <div class="card-body">  
        <figcaption class="mt-2" style="white-space: pre-line">
          {{ content.text }}
        </figcaption>
        <div *ngIf="content.mediaItems.length > 1" class="text-center">
          <button type="button" *ngFor="let img of content.mediaItems"
            [ngClass]="img.url === content.defaultImageUrl ? 'carouselBtn slide-active' : 'carouselBtn slide-inactive'"
            (click)="selectImage(content, img.url)">
          </button>
        </div>
      </div>

      
      <div class="card-text ms-2">
        <button type="button" class="btn" matTooltip="在新窗口打开" (click)="open(content)">
          <i class="bi bi-box-arrow-up-right"></i>
        </button>

        <button type="button" class="btn" matTooltip="留言" (click)="showComments(content)">
          <i class="bi bi-chat"></i> {{ content.totalComments! > 0 ? (content.totalComments | number ) : '' }}
        </button> 

        <button type="button" class="btn" matTooltip="复制链接分享给好友" (click)="copyToClipboard(content)">
          <i class="bi bi-share"></i>
        </button>
      </div>
    </div>
  `,
  styles: `

  `
})
export class ContentCardComponent {
  @Input({ required: true }) content: ContentItem;
  @Output() openContentSidenav = new EventEmitter<any>();
  @Output() openCommentSidenav = new EventEmitter<any>();

  // preload images
  private preloadedImages: HTMLImageElement[] = [];

  // ctor
  constructor(private router: Router,
    private clipboard: Clipboard,
    private snackbarService: SnackbarService) {

  }

  ngOnInit(): void {
    if (!this.content.mediaItems || this.content.mediaItems.length === 0) {
      return;
    }
    // Preload all images -  All images are preloaded in ngOnInit so they're cached by the browser
    this.content.mediaItems.forEach((img: any) => {
      const image = new Image();
      image.src = img.url;
      this.preloadedImages.push(image);
    });
  }

  // public methods
  showContent(item: ContentItem): void {
    this.openContentSidenav.emit(item);
  }

  showComments(item: ContentItem): void {
    this.openCommentSidenav.emit(item);
  }

  // select image
  selectImage(item: ContentItem, imageUrl: string): void {
    item.defaultImageUrl = imageUrl;
  }

  // copy url to clipboard
  copyToClipboard(item: ContentItem): void {
    // route to the detail page
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/info', item.id])
    );

    this.clipboard.copy(window.origin + url);
    this.snackbarService.success('该链接已经复制到剪贴板');
  }

  // open detail screen in a new window
  open(item: ContentItem): void {
    // // encode the author id (partition key)
    // const encodedParitionKey = window.btoa(item.authorId);
    // route to the detail page
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/info', item.id])
    );
    window.open(url, '_blank');
  }

}
