import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-footer',
  styles: ``,
  template: ` 
  
  <footer class="footer">
    <svg class="skyline" viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g filter="url(#ink-wash)" opacity=".18">
        <path d="M0 200 C160 140 260 170 380 130 S620 150 760 110 S1040 160 1180 120 S1360 140 1440 120 V260 H0Z" fill="var(--ink)"></path>
      </g>
      <g filter="url(#ink-rough)" fill="var(--ink)" opacity=".82">
        <path d="M0 260 V214 h60 v-18 h30 v18 h40 v-40 h14 v-10 h8 v10 h14 v40 h36 v-26 h50 v26 h26
                 v-66 h8 v-26 l10 -14 l10 14 v26 h8 v66 h30 v-34 h70 v34 h22 v-52 h16 v-8 h24 v8 h16 v52
                 h30 v-30 h56 v30 h34 v-72 h6 v-18 h4 v-22 h4 v22 h4 v18 h6 v72 h40 v-40 h62 v40 h30 v-22 h44 v22
                 h40 v-48 h52 v48 h60 v-28 h40 v28 h70 v-24 h60 v24 h80 v-16 h60 v16 h90 V260Z"></path>
        <!-- Oriental Pearl tower, a nod to the original logo -->
        <path d="M1182 214 V120 h3 V60 h2 V18 h2 v42 h2 v60 h3 v94z"></path>
        <circle cx="1188" cy="132" r="15"></circle><circle cx="1188" cy="78" r="9"></circle><circle cx="1188" cy="48" r="4"></circle>
        <path d="M1172 214 l12 -78 h8 l12 78z"></path>
      </g>
      <path d="M0 238 C240 230 480 246 720 238 S1200 230 1440 238 V260 H0Z" fill="var(--ink)" opacity=".9"></path>
    </svg>
    <div class="footer__row">
      <span>© 老早上海 laozaoshanghai.com</span>
      <span class="footer__mid"> Follow us @ X</span>
      <a href="#top" (click)="scrollToTop($event)">回到卷首 ↑</a>
    </div>
  </footer>  
  `,  
})
export class Footer {
  // Smoothness comes from the global html { scroll-behavior }, which honours prefers-reduced-motion.
  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0 });
  }
}
