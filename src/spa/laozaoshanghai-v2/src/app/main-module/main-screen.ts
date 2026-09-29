import { Component, DestroyRef, ElementRef, computed, effect, inject, input, signal, untracked, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
// models & services
import { DataService } from './data.service';
import { ContentItem, Comment } from '../shared/models/data.model';
import { PagedList } from '../shared/models/paged-list.model';
// components used in the main screen
import { CardList} from './card-list';
import { MainSection} from './main-section';

@Component({
  imports: [ CommonModule, CardList, MainSection ],
  selector: 'app-main-screen',
  styles: ``,
  template: ` 
    <app-main-section></app-main-section>

    <section class="archive" #archive aria-labelledby="archiveTitle">
      <div class="archive__bar">
        <h2 id="archiveTitle">
          旧影
          <!-- <em>Archive</em> -->
        </h2>
        <div class="filter" aria-live="polite">
          @if (activeKeyword(); as term) {
            <span class="chip">「{{ term }}」<button type="button" aria-label="清除筛选" (click)="clearSearch()">×</button></span>
          } @else {
            <span class="filter__hint">全部年代 · 全部地区</span>
          }
        </div>
        <p class="archive__meta">
          共 <b> {{ total() | number }} </b> 帧
          <!-- <span class="sample"></span> · 已展 <b>12</b> -->
        </p>
      </div>

      <!-- card list -->
      <app-card-list [cards]="cards()"></app-card-list>

      @if (loaded() && !loading() && !cards().length) {
        <p class="empty"><b>空</b>此处尚无旧影，换个词试试</p>
      }

      <div class="archive__more">
        @if (hasMore()) {
          <button class="btn-ink" type="button"
            [class.is-loading]="loading()" 
            [disabled]="loading()" 
            [attr.aria-busy]="loading()"
            (click)="loadMore()"><span>续展</span><small>更多旧影</small></button>
        } @else if (cards().length) {
          <p class="archive__end">卷终 · 已是最后一帧</p>
        }
      </div>
    </section>  
  `,
})
export class MainScreen {
  private readonly dataService = inject(DataService);
  private readonly router = inject(Router);
  private readonly archive = viewChild<ElementRef<HTMLElement>>('archive');
  private request?: Subscription;

  /** Bound from the ?keyword= query param (see withComponentInputBinding in app.config). */
  readonly keyword = input<string>();

  readonly cards = signal<ContentItem[]>([]);
  readonly total = signal(0);
  readonly activeKeyword = signal<string | null>(null);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(12);
  readonly loading = signal(false);
  readonly loaded = signal(false);
  // A short page means the API has nothing further, even if `total` disagrees.
  private readonly reachedEnd = signal(false);
  readonly hasMore = computed(() => !this.reachedEnd() && this.cards().length < this.total());

  constructor() {
    inject(DestroyRef).onDestroy(() => this.request?.unsubscribe());

    // Runs on first load and whenever ?keyword= changes: start again from page 0.
    effect(() => {
      const term = this.keyword()?.trim() || null;
      untracked(() => {
        this.loadContent(term, 0);
        if (term) this.archive()?.nativeElement.scrollIntoView();
      });
    });
  }

  clearSearch(): void {
    this.router.navigate([], { queryParams: { keyword: null }, queryParamsHandling: 'merge' });
  }

  loadMore(): void {
    if (this.loading() || !this.hasMore()) return;
    this.loadContent(this.activeKeyword(), this.pageIndex() + 1);
  }

  /** Page 0 replaces the list (new search); later pages are appended ("load more"). */
  loadContent(keyword: string | null, pageIndex: number, pageSize: number = this.pageSize()): void {
    // Drop any in-flight request so a stale response can't overwrite newer results.
    this.request?.unsubscribe();

    const term = keyword?.trim() || null;
    this.activeKeyword.set(term);
    this.pageSize.set(pageSize);
    this.loading.set(true);

    this.request = this.dataService
      .getContent(term, pageIndex, pageSize)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((result: PagedList<ContentItem>) => {
        // Advance the page only on success, so a failed "load more" retries the same page.
        this.pageIndex.set(pageIndex);
        this.total.set(result.total);
        this.reachedEnd.set(result.data.length < pageSize);
        this.cards.update(current => (pageIndex === 0 ? result.data : [...current, ...result.data]));
        this.loaded.set(true);
      });
  }
}
