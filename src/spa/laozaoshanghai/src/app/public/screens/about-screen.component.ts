import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// angular material
import { MatIconModule } from '@angular/material/icon';
// components
import { SiteActivityListComponent } from '../components/site-activity-list.component';
import { ContactFormComponent } from '../components/contact-form.component';
import { AdsResponsiveComponent } from '../components/ads-responsive.component';

@Component({
    selector: 'app-about-screen',
    imports: [CommonModule, MatIconModule,
        SiteActivityListComponent, ContactFormComponent, AdsResponsiveComponent],
    template: `
      <div class="container">
        <div class="row">
          <div class="col-md-12 mt-5">
              <h1>关于老早上海</h1>
              
              <p class="fs-5 col-lg-8 col-sm-12">
                <label class="valign-center">
                  闲来无事的顺手为之, 绝大部分的资料均来自于互联网，欢迎投稿。 <i class="bi bi-person-hearts" style="color:#e3165b"></i>
                </label>
              </p>
                         
              <hr class="col-12">

              <div class="row mt-5 mb-3">
                <div class="col-md-5 col-sm-12">
                    <h5>
                        联系老早上海
                        <a href="https://twitter.com/laozaoshanghai" class="text-dark" target="_blank" matTooltip="关注我们">
                          <i class="bi bi-envelope-at-fill"></i>
                        </a> 
                    </h5> 

                    <app-contact-form></app-contact-form>

                    <!-- Hidden only on xs (smaller than sm): .d-none .d-sm-block -->
                    <div class="mt-5 mb-3 card py-3">
                      <app-ads-responsive></app-ads-responsive>
                    </div>
                </div>

                <div class="col-md-7 col-sm-12">
                  <app-site-activity-list></app-site-activity-list>
                </div>
              </div>
          </div>
        </div>
      </div>
  `,
    styles: ``
})
export class AboutScreenComponent {

}
