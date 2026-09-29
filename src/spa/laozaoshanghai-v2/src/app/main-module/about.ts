import { Component, ErrorHandler, afterNextRender, inject } from '@angular/core';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { DataService } from './data.service';
import { SiteActivity } from '../shared/models/data.model';

interface LogItem { isoDate: string; label: string; text: string; }
interface LogYear { year: number; items: LogItem[]; }

/** Sorts newest first and groups by (local) year; dates render as "MM · DD" like the design. */
function groupByYear(activities: SiteActivity[] | null): LogYear[] {
  const two = (n: number) => String(n).padStart(2, '0');
  const entries = (activities ?? [])
    .map(a => ({ date: new Date(a.dateCreated), text: (a.text ?? '').trim().replace(/[.．]$/, '。') }))
    .filter(a => a.text && !isNaN(a.date.getTime()))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const years: LogYear[] = [];
  for (const { date, text } of entries) {
    const year = date.getFullYear();
    const month = two(date.getMonth() + 1);
    const day = two(date.getDate());
    let group = years[years.length - 1];
    if (group?.year !== year) years.push((group = { year, items: [] }));
    group.items.push({ isoDate: `${year}-${month}-${day}`, label: `${month} · ${day}`, text });
  }
  return years;
}

@Component({
  imports: [],
  selector: 'app-about',
  host: { '(document:keydown.escape)': 'onEscape($event)' },
  styles: ``,
  template: ` 
<div class="view page-about" data-view="about">
      <button class="page-close" type="button" aria-label="关闭，返回旧影" title="关闭 (Esc)" (click)="close()">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"></path></svg>
      </button>
      <section class="about" aria-labelledby="aboutTitle">
        <h1 class="about__title">老早<br>关于</h1>
        <div class="about__body">
          <p class="about__big">闲来无事的<em>顺手为之</em></p>
          <p>这里收集的，大多是二〇〇〇年以前的上海，绝大部分资料来自互联网——旧书、旧报、家庭相册与热心网友的分享。</p>
          
          <!-- <dl class="about__facts">
            <div><dt>旧影</dt><dd><b id="factPhotos">2,757</b><small>帧</small></dd></div>
            <div><dt>上线</dt><dd><b id="factSince">2022</b><small>年起</small></dd></div>
            <div><dt>站务</dt><dd><b id="factLogs">13</b><small>则</small></dd></div>
          </dl> -->
          <p class="about__links">
            <a href="https://twitter.com/laozaoshanghai" target="_blank" rel="noopener">Twitter · @laozaoshanghai</a>
            <a href="#contact">投稿 · 来信 ↓</a>
          </p>
        </div>
      </section>

      <div class="about-grid">
        <!-- Site updates: GET api/activities/site -->
        <section class="updates" aria-labelledby="updatesTitle">
          <header class="block-head">
            <h2 id="updatesTitle">更新日志</h2>
            <p>站务 · 由近及远</p>
          </header>
          <ol class="log">
            @if (logYears(); as years) {
              @for (year of years; track year.year) {
                <li class="log__year">
                  <h3>{{ year.year }}</h3>
                  <ol>
                    @for (item of year.items; track $index) {
                      <li class="log__item">
                        <time [attr.datetime]="item.isoDate">{{ item.label }}</time>
                        <p>{{ item.text }}</p>
                      </li>
                    }
                  </ol>
                </li>
              } @empty {
                <li class="log__empty">暂无更新</li>
              }
            } @else {
              <li class="log__empty">载入中…</li>
            }
          </ol>
        </section>

        <!-- Contact: POST api/messages { name, email, content } -->
        <section class="contact" aria-labelledby="contactTitle">
          <header class="block-head">
            <h2>来信</h2>
            <p>投稿 · 纠错 · 闲谈</p>
          </header>
          <p class="contact__lede">家中若藏着老照片，或认出了照片里的人与地方，都欢迎来信。</p>
          <form class="contact-form">
            <label><span>署名</span><input name="name" maxlength="30" required="" autocomplete="name"></label>
            <label><span>Email</span><input name="email" type="email" required="" autocomplete="email"></label>
            <label><span>内容</span><textarea name="content" rows="5" maxlength="500" required=""></textarea></label>
            <p class="contact-form__foot"><small>0 / 500</small><button type="submit">寄出</button></p>
          </form>
        </section>
      </div>
    </div>
  
  `,
})
export class About {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly errorHandler = inject(ErrorHandler);
  // Came from another page in this app (vs. opening /about directly), so closing can simply go Back.
  private readonly cameFromApp = !!this.router.currentNavigation()?.previousNavigation;

  /** Site update log grouped by year, newest first; undefined while loading. */
  readonly logYears = toSignal(
    inject(DataService).getSiteUpdates().pipe(
      map(groupByYear),
      catchError(err => {
        this.errorHandler.handleError(err);
        return of([] as LogYear[]);
      }),
    ),
  );

  constructor() {
    afterNextRender(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  }

  close(): void {
    if (this.cameFromApp) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  onEscape(event: Event): void {
    // Let Esc close an open menu or leave a form field first, like the design.
    if ((event.target as HTMLElement | null)?.closest?.('input, textarea, select')) return;
    if (document.querySelector('.nav__group.is-open') || document.body.classList.contains('nav-open')) return;
    this.close();
  }
}
