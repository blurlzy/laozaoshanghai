import { Component, Input } from '@angular/core';
import { Reveal } from '../shared/directives/reveal';
import { ContentItem } from '../shared/models/data.model';

@Component({
  imports: [Reveal],
  selector: 'app-card-list',
  styles: ``,
  template: ` 
  <div class="grid">
      @for(card of cards; track card.id){
        <button class="card" appReveal type="button" style="transition-delay: 0ms;">
          <div class="card__media">
            <img alt="laozaoshanghai.com" 
                  loading="lazy" decoding="async"
                  [src]="card.defaultImageUrl"
                  class="is-loaded">
              @if(card.mediaItems.length > 1) {
                <span class="card__multi">{{ card.mediaItems.length}} 帧</span>
              }
            
          </div>
          <span class="card__meta">
            <span class="num"></span>
            <span class="rule"></span>
            <span>
              @for (tag of card.tags; track tag; let last = $last) {
                {{ tag }}@if (!last) { · }
              }
            </span>
          </span>
          <p class="card__text">{{card.text}}</p>
        </button>
      }
  </div>
  `,
})
export class CardList {
  @Input({ required: true }) cards: ContentItem[] = [];
}
