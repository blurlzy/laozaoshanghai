import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

    <section class="archive" aria-labelledby="archiveTitle">
      <div class="archive__bar">
        <h2 id="archiveTitle">旧影<em>Archive</em></h2>
        <div class="filter" aria-live="polite"><span class="filter__hint">全部年代 · 全部地区</span></div>
        <p class="archive__meta">
          共 <b> {{ total() | number }} </b> 帧
          <!-- <span class="sample"></span> · 已展 <b>12</b> -->
        </p>
      </div>

      <!-- card list -->
      <app-card-list [cards]="cards()"></app-card-list>

      <div class="archive__more">
        <button class="btn-ink" id="loadMore" type="button"><span>续展</span><small>更多旧影</small></button>
        <p class="archive__end" id="archiveEnd" hidden="">卷终 · 已是最后一帧</p>
      </div>
    </section>  
  `,
})
export class MainScreen implements OnInit {
  private readonly dataService = inject(DataService);
  private request?: Subscription;

  readonly cards = signal<ContentItem[]>([]);
  readonly total = signal(0);
  readonly keyword = signal<string | null>(null);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(12);
  //readonly loading = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.request?.unsubscribe());
  }

  ngOnInit(): void {
    this.loadContent(null, 0);
  }

  /** Page 0 replaces the list (new search); later pages are appended ("load more"). */
  loadContent(keyword: string | null, pageIndex: number, pageSize: number = this.pageSize()): void {
    // Drop any in-flight request so a stale response can't overwrite newer results.
    this.request?.unsubscribe();

    const term = keyword?.trim() || null;
    this.keyword.set(term);
    this.pageIndex.set(pageIndex);
    this.pageSize.set(pageSize);
   // this.loading.set(true);

    this.request = this.dataService
      .getContent(term, pageIndex, pageSize)
      //.pipe(finalize(() => this.loading.set(false)))
      .subscribe((result: PagedList<ContentItem>) => {
        this.total.set(result.total);
        this.cards.update(current => (pageIndex === 0 ? result.data : [...current, ...result.data]));
      });
  }
}
