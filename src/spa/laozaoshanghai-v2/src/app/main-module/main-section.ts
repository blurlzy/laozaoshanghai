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
          <img alt="Shanghai 1995, summer" decoding="async" src="https://stlaoshanghaiprod.blob.core.windows.net/photos/5009639a-b614-421d-b81b-b7ae7be7771d.jpeg" class="">
          <img alt="Shanghai 1990s" decoding="async" src="https://stlaoshanghaiprod.blob.core.windows.net/photos/9ed9b8f2-c197-4fd4-b3c0-17c084b44370.jpeg" class="is-on">
        </div>
        <figcaption class="hero__caption">
          <span class="num" id="heroNum">№ 0005</span>
          <span class="txt" id="heroCaption" style="opacity: 1;">Shanghai 1990s</span>
        </figcaption>
      </figure>

      <div class="hero__title-wrap">
        <!-- <h1 class="hero__title" id="heroTitle">
          <span style="--i:0">老</span><span style="--i:1">早</span><span style="--i:2">上</span><span style="--i:3">海</span>
        </h1> -->
        <p class="hero__years">老早上海</p>
        <!-- <span class="seal seal--lg stamp" aria-hidden="true">
          <svg viewBox="0 0 100 100"><g filter="url(#seal-grain)">
            <rect x="4" y="4" width="92" height="92" rx="7" fill="var(--cinnabar)"></rect>
            <text x="50" y="66" text-anchor="middle" class="seal__glyph seal__glyph--one">憶</text>
          </g></svg>
        </span> -->
      </div>

      <div class="hero__foot">
        <p class="hero__count"><span class="brush">旧影</span><b id="totalCount">2,757</b><span>帧</span></p>
        <p class="hero__lede">一座关于上海的纸上档案。<br>从民国的石库门，到九十年代的淮海路——<br>把散落的记忆，一帧一帧收回来。</p>
        <a class="scroll-hint" href="#archive"><span>展卷</span><i></i></a>
      </div>
    </section>
    
  `,
})
export class MainSection {}
