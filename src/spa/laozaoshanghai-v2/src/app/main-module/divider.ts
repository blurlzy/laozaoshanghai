import { Component, computed, input } from '@angular/core';
import { Reveal } from '../shared/directives/reveal';

const VERSES: readonly string[][] = [
  ['外滩的钟', '敲过了一百年'],
  ['往事未必如烟', '咖啡依旧飘香'],
  ['落雨了，打雷了', '小八辣子开会咯'],
];

@Component({
  imports: [Reveal],
  selector: 'app-divider',
  // Let the <aside> itself be the grid item so `grid-column: 1 / -1` spans the row.
  styles: `:host { display: contents; }`,
  template: ` 
    <aside class="interlude" appReveal aria-hidden="true">
      <p>
        @for (line of lines(); track $index) {
          <span>{{ line }}</span>
        }
        <span class="seal interlude__seal">
          <svg viewBox="0 0 100 100"><g filter="url(#seal-grain)">
            <rect x="4" y="4" width="92" height="92" rx="7" fill="var(--cinnabar)"></rect>
            <text x="50" y="66" text-anchor="middle" class="seal__glyph seal__glyph--one">SH</text>
          </g></svg>
        </span>
      </p>
    </aside>
  `,
})
export class Divider {
  /** Picks which verse to show; cycles through VERSES. */
  readonly index = input(0);
  protected readonly lines = computed(() => VERSES[this.index() % VERSES.length]);
}
