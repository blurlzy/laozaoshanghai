import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-placeholder-horizontal',
    imports: [CommonModule],
    template: `
  <p class="card-text placeholder-glow">
    <span class="placeholder col-7"></span>
    <span class="placeholder col-6"></span>
    <span class="placeholder col-8"></span>
  </p>
  `,
    styles: ``
})
export class PlaceholderHorizontalComponent {

}
