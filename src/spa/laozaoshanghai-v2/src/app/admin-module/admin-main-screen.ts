import { Component, DestroyRef, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { ContentItem } from '../shared/models/data.model';
import { ManagementService } from './admin-data.service';
import { AdminContentForm, describeError } from './admin-content-form';

const PAGE_SIZE = 30;

/** Lists, searches, creates, edits and deletes content items. Paging and search live in the URL. */
@Component({
  imports: [DatePipe, DecimalPipe, AdminContentForm],
  selector: 'app-admin-main-screen',
  styles: `
    .admin { padding: calc(var(--head-h) + 40px) var(--content-pad) 80px; }
    .admin__bar {
      display: flex; flex-wrap: wrap; align-items: center; gap: 12px 24px;
      padding-bottom: 16px; margin-bottom: 8px; border-bottom: 1px solid var(--ink);
    }
    .admin__bar h1 { margin: 0; font-family: var(--f-display); font-weight: 900; font-size: 30px; letter-spacing: .14em; }
    .admin__meta { margin: 0; font-family: var(--f-latin); font-style: italic; font-size: 16px; color: var(--ink-3); }
    .admin__bar .admin-btn--primary { margin-left: auto; }
    .admin__notice { margin: 12px 0 0; padding: 10px 14px; font-size: 14px; letter-spacing: .08em; background: var(--paper-2); }
    .admin__notice.is-error { color: var(--cinnabar-deep); background: color-mix(in srgb, var(--cinnabar) 10%, transparent); }

    .table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .table th {
      padding: 12px 10px; text-align: left; font-weight: 400;
      font-size: 12px; letter-spacing: .3em; color: var(--ink-3); border-bottom: 1px solid var(--line);
    }
    .table td { padding: 12px 10px; vertical-align: middle; border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); }
    .table tbody tr:hover { background: color-mix(in srgb, var(--paper-2) 60%, transparent); }
    .table img { display: block; width: 72px; min-width: 72px; height: 54px; object-fit: cover; background: var(--paper-3); }
    .col-text { width: 45%; }
    .text { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.7; }
    .tags { font-size: 13px; color: var(--ink-3); letter-spacing: .06em; }
    .num, .date { font-family: var(--f-latin); font-size: 15px; color: var(--ink-2); white-space: nowrap; }
    .actions { white-space: nowrap; text-align: right; }
    .actions > * + * { margin-left: 8px; }
    .confirm { font-size: 13px; color: var(--cinnabar-deep); letter-spacing: .1em; }
    .state { padding: 60px 0; text-align: center; color: var(--ink-3); letter-spacing: .3em; }

    .pager { display: flex; align-items: center; justify-content: center; gap: 18px; padding-top: 28px; }
    .pager span { font-family: var(--f-latin); font-size: 16px; color: var(--ink-2); }

    @media (max-width: 820px) {
      .col-tags, .col-num, .col-date { display: none; }
      .admin__bar h1 { font-size: 24px; }
    }
  `,
  template: `
    <section class="admin" aria-labelledby="adminTitle">
      <div class="admin__bar">
        <h1 id="adminTitle">内容管理</h1>
        <p class="admin__meta">共 {{ total() | number }} 条</p>
        @if (activeKeyword(); as term) {
          <span class="chip">「{{ term }}」<button type="button" aria-label="清除搜索" (click)="clearSearch()">×</button></span>
        }
        <button type="button" class="admin-btn admin-btn--primary" (click)="openEditor(null)">＋ 新增</button>
      </div>

      <div aria-live="polite">
        @if (notice(); as n) {
          <p class="admin__notice" [class.is-error]="n.error">{{ n.text }}</p>
        }
      </div>

      <table class="table" [attr.aria-busy]="loading()">
        <thead>
          <tr>
            <th scope="col"><span class="sr-only">图片</span></th>
            <th scope="col" class="col-text">内容</th>
            <th scope="col" class="col-tags">标签</th>
            <th scope="col" class="col-num">帧</th>
            <th scope="col" class="col-date">日期</th>
            <th scope="col"><span class="sr-only">操作</span></th>
          </tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr>
              <td><img [src]="coverOf(item)" alt="" loading="lazy"></td>
              <td class="col-text"><span class="text">{{ item.text || '（无题）' }}</span></td>
              <td class="col-tags tags">{{ item.tags.join(' · ') }}</td>
              <td class="col-num num">{{ item.mediaItems.length }}</td>
              <td class="col-date date">{{ item.dateCreated | date: 'yyyy-MM-dd' }}</td>
              <td class="actions">
                @if (confirmingDelete() === item.id) {
                  <span class="confirm">确认删除？</span>
                  <button type="button" class="admin-btn admin-btn--sm admin-btn--danger"
                    [disabled]="deleting()" (click)="remove(item)">{{ deleting() ? '删除中…' : '删除' }}</button>
                  <button type="button" class="admin-btn admin-btn--sm" [disabled]="deleting()" (click)="confirmingDelete.set(null)">取消</button>
                } @else {
                  <button type="button" class="admin-btn admin-btn--sm" (click)="openEditor(item)">编辑</button>
                  <button type="button" class="admin-btn admin-btn--sm" (click)="confirmingDelete.set(item.id)">删除</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>

      @if (loading() && !items().length) {
        <p class="state">载入中…</p>
      } @else if (!loading() && !items().length) {
        <p class="state">{{ activeKeyword() ? '没有找到相关内容' : '暂无内容' }}</p>
      }

      @if (totalPages() > 1) {
        <nav class="pager" aria-label="分页">
          <button type="button" class="admin-btn admin-btn--sm" [disabled]="page() === 0 || loading()" (click)="goToPage(page() - 1)">‹ 上一页</button>
          <span>{{ page() + 1 }} / {{ totalPages() }}</span>
          <button type="button" class="admin-btn admin-btn--sm" [disabled]="page() >= totalPages() - 1 || loading()" (click)="goToPage(page() + 1)">下一页 ›</button>
        </nav>
      }
    </section>

    @if (editor(); as e) {
      <app-admin-content-form [item]="e.item" (saved)="onSaved(e.item)" (closed)="editor.set(null)" />
    }
  `,
})
export class AdminMainScreen {
  private readonly service = inject(ManagementService);
  private readonly router = inject(Router);
  private request?: Subscription;
  private noticeTimer?: ReturnType<typeof setTimeout>;

  /** Bound from ?keyword= and ?pageIndex= (see withComponentInputBinding in app.config). */
  readonly keyword = input<string>();
  readonly pageIndex = input<string>();

  readonly items = signal<ContentItem[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly activeKeyword = computed(() => this.keyword()?.trim() || null);
  readonly page = computed(() => Math.max(0, Number.parseInt(this.pageIndex() ?? '0', 10) || 0));
  readonly totalPages = computed(() => Math.ceil(this.total() / PAGE_SIZE));

  /** Open editor: `item` null means "create". */
  readonly editor = signal<{ item: ContentItem | null } | null>(null);
  readonly confirmingDelete = signal<string | null>(null);
  readonly deleting = signal(false);
  readonly notice = signal<{ text: string; error: boolean } | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => {
      this.request?.unsubscribe();
      clearTimeout(this.noticeTimer);
    });

    // Reload whenever the keyword or page in the URL changes.
    effect(() => {
      const keyword = this.activeKeyword();
      const page = this.page();
      untracked(() => this.load(keyword, page));
    });
  }

  coverOf(item: ContentItem): string {
    return item.defaultImageUrl || item.mediaItems?.[0]?.previewUrl || item.mediaItems?.[0]?.url || '';
  }

  openEditor(item: ContentItem | null): void {
    this.confirmingDelete.set(null);
    this.editor.set({ item });
  }

  onSaved(item: ContentItem | null): void {
    this.showNotice(item ? '已保存修改。' : '已新增。');
    if (!item && this.page() !== 0) {
      // New items appear first, so jump back to page 1 to show it.
      this.goToPage(0);
    } else {
      this.reload();
    }
  }

  remove(item: ContentItem): void {
    this.deleting.set(true);
    this.service.deleteContentItem(item.id)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          this.confirmingDelete.set(null);
          this.showNotice('已删除。');
          // Deleting the last row of a page: step back a page instead of showing an empty one.
          if (this.items().length === 1 && this.page() > 0) {
            this.goToPage(this.page() - 1);
          } else {
            this.reload();
          }
        },
        error: (err: unknown) => this.showNotice(describeError(err), true),
      });
  }

  goToPage(page: number): void {
    this.router.navigate([], { queryParams: { pageIndex: page > 0 ? page : null }, queryParamsHandling: 'merge' });
  }

  clearSearch(): void {
    this.router.navigate([], { queryParams: { keyword: null, pageIndex: null }, queryParamsHandling: 'merge' });
  }

  private reload(): void {
    this.load(this.activeKeyword(), this.page());
  }

  private load(keyword: string | null, page: number): void {
    this.request?.unsubscribe();
    this.loading.set(true);
    this.request = this.service.getContent(keyword, page, PAGE_SIZE)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: result => {
          this.items.set(result.data ?? []);
          this.total.set(result.total ?? 0);
        },
        error: (err: unknown) => {
          this.items.set([]);
          this.total.set(0);
          this.showNotice(describeError(err), true);
        },
      });
  }

  private showNotice(text: string, error = false): void {
    clearTimeout(this.noticeTimer);
    this.notice.set({ text, error });
    if (!error) this.noticeTimer = setTimeout(() => this.notice.set(null), 4000);
  }
}
