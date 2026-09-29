import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, linkedSignal, output, viewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ContentItem } from '../shared/models/data.model';

@Component({
  imports: [],
  selector: 'app-card-detail',
  host: {
    '(keydown)': 'onKeydown($event)',
    // Native Esc-to-close can be skipped by the browser (e.g. no user activation), so handle it explicitly.
    '(document:keydown.escape)': 'onEscape($event)',
  },
  styles: ``,
  template: ` 
    <dialog #dialog class="viewer" aria-labelledby="viewerText" (close)="onDialogClosed()">
    <div class="viewer__inner">
      <div class="viewer__stage">
        @if (frames().length > 1) {
          <button class="viewer__nav viewer__nav--prev" type="button" aria-label="上一帧"
            [disabled]="frameIndex() === 0" (click)="step(-1)">‹</button>
        }
        <figure class="viewer__figure" #figure tabindex="-1">
          <img [alt]="card().text || '上海老照片'" [src]="currentUrl()"
            [class.is-in]="imageLoaded()" (load)="imageLoaded.set(true)">
        </figure>
        @if (frames().length > 1) {
          <button class="viewer__nav viewer__nav--next" type="button" aria-label="下一帧"
            [disabled]="frameIndex() === frames().length - 1" (click)="step(1)">›</button>

          <ol class="viewer__thumbs" aria-label="本组照片">
            @for (url of frames(); track $index; let i = $index) {
              <li>
                <button type="button" [attr.aria-label]="'第 ' + (i + 1) + ' 帧'"
                  [attr.aria-current]="i === frameIndex()" (click)="showFrame(i)">
                  <img [src]="url" alt="" loading="lazy">
                </button>
              </li>
            }
          </ol>
        }
      </div>
      <aside class="viewer__side">
        <!-- @if (number() != null) {
          <p class="viewer__num">№ {{ number()!.toString().padStart(4, '0') }}</p>
        } -->
        <p class="viewer__text" >
          {{ card().text || '（无题）' }}
        </p>
        <ul class="viewer__tags">
          @for (tag of card().tags; track tag) {
            <li><button type="button" (click)="searchTag(tag)">{{ tag }}</button></li>
          }
        </ul>
        <div class="viewer__actions">
          <button type="button">分享</button>
          <a [href]="currentUrl()" target="_blank" rel="noopener">原图</a>
        </div>
        <!-- <section class="viewer__comments" aria-label="留言">
          <h3>留言</h3>
          <ol>
            <li class="muted">本地预览中，留言请在线查看</li>
          </ol>
          <form class="comment-form" aria-disabled="true">
            <input name="name" placeholder="署名" maxlength="30" required="">
            <textarea name="commentText" placeholder="讲讲这张照片的故事…" minlength="3" maxlength="180" rows="3" required=""></textarea>
            <button type="submit">落款</button>
          </form>
        </section> -->
      </aside>
      <button class="viewer__close" type="button" aria-label="关闭" (click)="close()">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"></path></svg>
      </button>
    </div>
  </dialog>
  
  `,
})
export class CardDetail {
  private readonly router = inject(Router);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly figure = viewChild.required<ElementRef<HTMLElement>>('figure');

  readonly card = input.required<ContentItem>();
  /** 1-based position in the list, shown as № 0001. */
  //readonly number = input<number>();
  /** Emitted once the dialog has closed (✕, Esc, or picking a tag). */
  readonly closed = output<void>();
  private hasClosed = false;

  // Both reset to the first frame whenever a different card is passed in.
  readonly frameIndex = linkedSignal({ source: this.card, computation: () => 0 });
  readonly imageLoaded = linkedSignal({ source: this.card, computation: () => false });

  /** Photo URLs for this card, falling back to the cover image. */
  readonly frames = computed(() => {
    const card = this.card();
    const photos = (card.mediaItems ?? []).filter(m => m.type === 'photo' && m.url).map(m => m.url);
    return photos.length ? photos : [card.defaultImageUrl].filter(Boolean);
  });
  readonly currentUrl = computed(() => this.frames()[this.frameIndex()] ?? this.card().defaultImageUrl);

  // // Short, mostly-CJK captions read top-to-bottom like the design.
  // readonly isVertical = computed(() => {
  //   const text = this.card().text ?? '';
  //   const chars = text.replace(/\s/g, '');
  //   const cjk = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  //   return chars.length > 0 && text.length <= 140 && cjk / chars.length > 0.4;
  // });

  constructor() {
    const root = inject(DOCUMENT).documentElement;

    afterNextRender(() => {
      this.dialog().nativeElement.showModal();
      root.style.overflow = 'hidden';
      // Focus the photo so arrow keys work without a focus ring on ‹.
      this.figure().nativeElement.focus({ preventScroll: true });
    });

    inject(DestroyRef).onDestroy(() => (root.style.overflow = ''));
  }

  showFrame(index: number): void {
    if (index === this.frameIndex() || index < 0 || index >= this.frames().length) return;
    this.imageLoaded.set(false);
    this.frameIndex.set(index);
  }

  step(direction: 1 | -1): void {
    this.showFrame(this.frameIndex() + direction);
  }

  close(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) dialog.close();
    // Don't rely solely on the dialog's async `close` event (it can be delayed or skipped).
    this.onDialogClosed();
  }

  /** Also bound to the dialog's native `close` event (e.g. Esc handled by the browser). */
  onDialogClosed(): void {
    if (this.hasClosed) return;
    this.hasClosed = true;
    this.closed.emit();
  }

  searchTag(tag: string): void {
    this.close();
    this.router.navigate(['/'], { queryParams: { keyword: tag } });
  }

  onEscape(event: Event): void {
    if (!this.dialog().nativeElement.open) return;
    event.preventDefault();
    this.close();
  }

  onKeydown(event: KeyboardEvent): void {
    if ((event.target as HTMLElement).closest('input, textarea')) return;
    if (event.key === 'ArrowLeft') this.step(-1);
    if (event.key === 'ArrowRight') this.step(1);
  }
}
