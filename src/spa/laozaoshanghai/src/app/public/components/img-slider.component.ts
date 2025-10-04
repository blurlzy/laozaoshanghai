import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// material
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
    selector: 'app-img-slider',
    imports: [CommonModule, MatTooltipModule],
    template: `
  <a style="cursor: pointer;" (click)="download(currentImgUrl)" matTooltip="点击下载该图片">
    <img [src]="currentImgUrl ? currentImgUrl : './assets/images/placeholder-650.png'" 
        class="d-block mx-auto mb-4 img-fluid"  alt="laozaoshanghai">
  </a>	

  @if(images && images.length > 1) {
    <div class="text-center">
      <button type="button" *ngFor="let img of images"
        [ngClass]="img.url === currentImgUrl ? 'carouselBtn slide-active' : 'carouselBtn slide-inactive'"
        (click)="selectImage(img.url)">
      </button>
    </div>
  }

  `,
    styles: ``
})
export class ImgSliderComponent {
  @Input({ required: true }) images: any = [];
  @Input({ required: true }) currentImgUrl: string = '';

  // select image
  selectImage(imageUrl: string): void {
    this.currentImgUrl = imageUrl;
  }

  download(url:string): void {
    window.open(url, '_blank');
  }
}
