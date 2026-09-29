import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContentItem } from '../shared/models/data.model';
import { ManagementService } from './admin-data.service';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.jfif', '.webp', '.bmp', '.svg', '.tiff', '.tif', '.ico'];

interface SelectedFile { file: File; preview: string; }

/** Add/edit dialog for a content item. Pass `item` to edit, or null to create. */
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-admin-content-form',
  styles: `
    .admin-dialog {
      width: min(680px, calc(100vw - 32px)); max-height: calc(100dvh - 48px); padding: 0;
      border: 1px solid var(--line); background: var(--paper); color: var(--ink);
      box-shadow: 0 30px 80px -30px rgba(21, 20, 18, .5);
    }
    .admin-dialog::backdrop { background: rgba(21, 20, 18, .45); }
    .editor { display: grid; gap: 20px; padding: 28px 32px 24px; }
    .editor__head { display: flex; align-items: center; justify-content: space-between; padding-bottom: 14px; border-bottom: 1px solid var(--ink); }
    .editor__head h2 { margin: 0; font-family: var(--f-display); font-weight: 900; font-size: 24px; letter-spacing: .14em; }
    .editor__close { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; }
    .editor__close:hover { background: var(--paper-2); }
    .editor__close svg { width: 18px; height: 18px; stroke: var(--ink); stroke-width: 1.4; fill: none; }
    .field { display: grid; gap: 6px; }
    .field > span { font-size: 12px; letter-spacing: .3em; color: var(--ink-3); }
    .field input:not([type=file]), .field textarea {
      font: 16px/1.8 var(--f-body); color: var(--ink); background: transparent;
      border: 0; border-bottom: 1px solid var(--line); padding: 6px 0; outline: none; resize: vertical;
    }
    .field input:focus, .field textarea:focus { border-color: var(--ink); }
    .tags { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; border-bottom: 1px solid var(--line); padding: 6px 0; }
    .tags:focus-within { border-color: var(--ink); }
    .tags input { flex: 1; min-width: 12em; border: 0 !important; padding: 2px 0 !important; }
    .thumbs { display: flex; flex-wrap: wrap; gap: 10px; }
    .thumbs figure { margin: 0; display: grid; gap: 4px; width: 96px; }
    .thumbs img { width: 96px; height: 72px; object-fit: cover; background: var(--paper-3); }
    .thumbs figcaption { font-size: 11px; color: var(--ink-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .hint { font-size: 12px; color: var(--ink-3); letter-spacing: .1em; }
    .editor__error { margin: 0; padding: 10px 12px; font-size: 14px; color: var(--cinnabar-deep); background: color-mix(in srgb, var(--cinnabar) 10%, transparent); }
    .editor__foot { display: flex; justify-content: flex-end; gap: 12px; padding-top: 4px; }
  `,
  template: `
    <dialog #dialog class="admin-dialog" aria-labelledby="editorTitle" (cancel)="onCancel($event)">
      <form class="editor" [formGroup]="form" (ngSubmit)="save()">
        <header class="editor__head">
          <h2 id="editorTitle">{{ isEdit() ? '编辑旧影' : '新增旧影' }}</h2>
          <button type="button" class="editor__close" aria-label="关闭" (click)="close()">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"></path></svg>
          </button>
        </header>

        <label class="field">
          <span>文字 *</span>
          <textarea formControlName="text" rows="5"></textarea>
        </label>

        <div class="field">
          <span id="tagsLabel">标签</span>
          <div class="tags">
            @for (tag of tags(); track tag) {
              <span class="chip">{{ tag }}<button type="button" [attr.aria-label]="'移除标签 ' + tag" (click)="removeTag(tag)">×</button></span>
            }
            <input #tagInput aria-labelledby="tagsLabel" placeholder="输入后按回车或逗号添加"
              (keydown)="onTagKeydown($event, tagInput)" (blur)="addTags(tagInput)">
          </div>
        </div>

        <label class="field">
          <span>来源</span>
          <input formControlName="source">
        </label>

        <div class="field">
          <span>图片{{ isEdit() ? '' : ' *' }}</span>
          @if (isEdit()) {
            <div class="thumbs">
              @for (media of item()!.mediaItems; track $index) {
                <figure><img [src]="media.previewUrl || media.url" alt="" loading="lazy"></figure>
              }
            </div>
            <small class="hint">已上传的图片不能在这里修改。</small>
          } @else {
            <input type="file" accept="image/*" multiple (change)="onFilesSelected($event)">
            @if (files().length) {
              <div class="thumbs">
                @for (f of files(); track f.preview) {
                  <figure><img [src]="f.preview" alt=""><figcaption>{{ f.file.name }}</figcaption></figure>
                }
              </div>
            }
          }
        </div>

        @if (error(); as message) {
          <p class="editor__error" role="alert">{{ message }}</p>
        }

        <footer class="editor__foot">
          <button type="button" class="admin-btn" (click)="close()">取消</button>
          <button type="submit" class="admin-btn admin-btn--primary" [disabled]="!canSave()">
            {{ saving() ? '保存中…' : '保存' }}
          </button>
        </footer>
      </form>
    </dialog>
  `,
})
export class AdminContentForm {
  private readonly service = inject(ManagementService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  /** The item to edit, or null to create a new one. */
  readonly item = input<ContentItem | null>(null);
  readonly saved = output<void>();
  readonly closed = output<void>();

  readonly isEdit = computed(() => !!this.item()?.id);
  readonly tags = signal<string[]>([]);
  readonly files = signal<SelectedFile[]>([]);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = inject(FormBuilder).nonNullable.group({
    text: ['', Validators.required],
    source: [''],
  });
  private readonly formValid = signal(false);
  readonly canSave = computed(() => !this.saving() && this.formValid() && (this.isEdit() || this.files().length > 0));

  private hasClosed = false;

  constructor() {
    this.form.statusChanges.subscribe(() => this.formValid.set(this.form.valid));

    afterNextRender(() => {
      const item = this.item();
      if (item) {
        this.form.setValue({ text: item.text ?? '', source: item.source ?? '' });
        this.tags.set([...(item.tags ?? [])]);
      }
      this.formValid.set(this.form.valid);
      this.dialog().nativeElement.showModal();
    });

    inject(DestroyRef).onDestroy(() => this.files().forEach(f => URL.revokeObjectURL(f.preview)));
  }

  onTagKeydown(event: KeyboardEvent, input: HTMLInputElement): void {
    if (event.key === 'Enter' || event.key === ',' || event.key === '，') {
      event.preventDefault();
      this.addTags(input);
    } else if (event.key === 'Backspace' && !input.value && this.tags().length) {
      this.tags.update(tags => tags.slice(0, -1));
    }
  }

  /** Adds the typed tag(s); a pasted "a, b，c" becomes three tags. */
  addTags(input: HTMLInputElement): void {
    const added = input.value.split(/[,，]/).map(t => t.trim()).filter(Boolean);
    if (added.length) {
      this.tags.update(tags => [...new Set([...tags, ...added])]);
    }
    input.value = '';
  }

  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const picked = Array.from(input.files ?? []);
    const invalid = picked.find(f => !IMAGE_EXTENSIONS.some(ext => f.name.toLowerCase().endsWith(ext)));

    this.files().forEach(f => URL.revokeObjectURL(f.preview));
    if (invalid) {
      this.files.set([]);
      input.value = '';
      this.error.set(`不支持的文件类型：${invalid.name}`);
      return;
    }
    this.error.set(null);
    this.files.set(picked.map(file => ({ file, preview: URL.createObjectURL(file) })));
  }

  save(): void {
    if (!this.canSave()) return;
    const { text, source } = this.form.getRawValue();
    const item = this.item();

    let request: Observable<unknown>;
    if (item?.id) {
      request = this.service.updateContentItem({ id: item.id, text, tags: this.tags(), source });
    } else {
      const data = new FormData();
      this.files().forEach(f => data.append('files', f.file));
      data.append('text', text);
      data.append('tags', this.tags().join(','));
      data.append('source', source);
      request = this.service.addContentItem(data);
    }

    this.saving.set(true);
    this.error.set(null);
    request.subscribe({
      next: () => {
        this.saved.emit();
        this.close();
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.error.set(describeError(err));
      },
    });
  }

  onCancel(event: Event): void {
    event.preventDefault();
    if (!this.saving()) this.close();
  }

  close(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) dialog.close();
    if (this.hasClosed) return;
    this.hasClosed = true;
    this.closed.emit();
  }
}

export function describeError(err: unknown): string {
  // Auth0 fails before sending the request when it can't get a token (e.g. the session expired).
  const auth0Code = (err as { error?: unknown } | null)?.error;
  if (typeof auth0Code === 'string' && ['login_required', 'consent_required', 'missing_refresh_token', 'invalid_grant'].includes(auth0Code)) {
    return '登录已过期，请重新登录后再试。';
  }
  const status = err instanceof HttpErrorResponse ? err.status : undefined;
  if (status === 401 || status === 403) return '没有权限，请重新登录后再试。';
  if (status === 0) return '网络连接失败，请稍后再试。';
  return `操作失败（${status || '未知错误'}），请稍后再试。`;
}
