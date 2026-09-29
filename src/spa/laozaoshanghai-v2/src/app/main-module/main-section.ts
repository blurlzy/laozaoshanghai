import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-main-section',
  styles: ``,
  template: ` 
      <section class="hero" aria-labelledby="heroTitle">
      <div class="hero__mist" aria-hidden="true"><i></i><i></i><i></i></div>

      <aside class="hero__aside" aria-hidden="true">
        <span>上海老照片</span><span class="dot">·</span><span>记忆上海</span>
      </aside>

      <figure class="hero__frame">
        <div class="hero__photo">
          <img alt="laozaoshanghai.com" decoding="async" src="https://stlaoshanghaiprod.blob.core.windows.net/photos/5bcc457d-7a37-47a3-9079-50e3ab8effb8.png" class="is-on">
        </div>
        <figcaption class="hero__caption">
          <span class="num" id="heroNum">建设中的南京东路</span>
          <span class="txt" id="heroCaption" style="opacity: 1;">Shanghai 1990s</span>
        </figcaption>
      </figure>

      <div class="hero__title-wrap">
        <h1 class="hero__title">
          <span style="--i:0">老</span>
          <span style="--i:1">早</span>
          <span style="--i:2">上</span>
          <span style="--i:3">海</span>
        </h1>
        <p class="hero__years">侬好呀</p>
        <span class="seal seal--lg stamp" aria-hidden="true">
          <svg viewBox="0 0 100 100"><g filter="url(#seal-grain)">
            <rect x="4" y="4" width="92" height="92" rx="7" fill="var(--cinnabar)"></rect>
            <text x="50" y="66" text-anchor="middle" class="seal__glyph seal__glyph--one">SH</text>
          </g></svg>
        </span>
      </div>

      <div class="hero__foot">
        <p class="hero__count">
          <span class="brush">旧影</span>
          <b></b>
          <span></span>
        </p>
        <p class="hero__lede">往事如烟<br>只有咖啡会一直飘香<br>霞飞路上不再有飘落的梧桐树叶</p>
        <a class="scroll-hint" href="#archive"><span>展卷</span><i></i></a>
      </div>
    </section>
    
  `,
})
export class MainSection {}
