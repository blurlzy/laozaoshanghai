import { Component, Input } from '@angular/core';
import { Reveal } from '../shared/directives/reveal';
import { ContentItem } from '../shared/models/data.model';
import { Divider } from './divider';

// Insert a divider after every 12 cards, up to the first 36 (i.e. before cards 13, 25 and 37).
const DIVIDER_EVERY = 12;
const DIVIDER_UNTIL = 36;

@Component({
  imports: [Reveal, Divider],
  selector: 'app-card-list',
  styles: ``,
  template: ` 
  <div class="grid">
      @for(card of cards; track card.id; let i = $index){
      
        @if (showDividerBefore(i)) {
          <app-divider [index]="i / DIVIDER_EVERY - 1" />
        }
        <button class="card" appReveal type="button" >
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

  protected readonly DIVIDER_EVERY = DIVIDER_EVERY;

  protected showDividerBefore(index: number): boolean {
    return index > 0 && index <= DIVIDER_UNTIL && index % DIVIDER_EVERY === 0;
  }
}
