import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ads-responsive',
    imports: [CommonModule],
    template: `
        <div>
          <ins class="adsbygoogle" 
              style="display:block" 
              data-ad-client="ca-pub-7792978464943079" 
              data-ad-slot="7779941881"
              data-ad-format="auto" 
              data-full-width-responsive="true"></ins>
        </div>
  `,
    styles: ``
})
export class AdsResponsiveComponent {
  constructor() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
			if (window) {
				try {
					((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
	
				} catch (e) {
					console.error('Google adsense error.');
					console.error(e);
				}	
			}

		}, 0);
  }

  ngOnDestroy() {

  }
}
