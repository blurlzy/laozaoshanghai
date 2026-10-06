import { Component, ElementRef, afterNextRender, input, viewChild } from '@angular/core';

declare global {
  interface Window { adsbygoogle?: unknown[]; }
}

/**
 * Google AdSense unit. The AdSense script itself is loaded once in index.html.
 * Usage: <app-google-ads />  or  <app-google-ads slot="1234567890" format="rectangle" />
 */
@Component({
  imports: [],
  selector: 'app-google-ads',
  styles: `
    :host { display: block; }
    .ads { min-height: 1px; }
    /* Google's recommended way to collapse a slot when no ad is available. */
    .adsbygoogle[data-ad-status="unfilled"] { display: none !important; }
  `,
  template: `
    <div class="ads">
      <ins #ad class="adsbygoogle" style="display:block"
        [attr.data-ad-client]="client()"
        [attr.data-ad-slot]="slot()"
        [attr.data-ad-format]="format()"
        [attr.data-full-width-responsive]="fullWidthResponsive()"></ins>
    </div>
  `,
})
export class GoogleAds {
  readonly client = input('ca-pub-7792978464943079');
  readonly slot = input('7779941881');
  readonly format = input('auto');
  readonly fullWidthResponsive = input(true);

  private readonly ad = viewChild.required<ElementRef<HTMLElement>>('ad');

  constructor() {
    // Ask AdSense to fill this <ins> once it's in the DOM.
    afterNextRender(() => {
      const ins = this.ad().nativeElement;
      // AdSense marks filled slots; pushing twice for the same slot throws.
      if (ins.getAttribute('data-adsbygoogle-status')) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Google AdSense error.', e);
      }
    });
  }
}
