import { Component } from '@angular/core';
import { Reveal } from '../shared/directives/reveal';

@Component({
  imports: [Reveal],
  selector: 'app-card-list',
  styles: ``,
  template: ` 
<section class="archive" id="archive" aria-labelledby="archiveTitle">
  <div class="archive__bar">
    <h2 id="archiveTitle">旧影<em>Archive</em></h2>
    <div class="filter" id="filterState" aria-live="polite"><span class="filter__hint">全部年代 · 全部地区</span></div>
    <p class="archive__meta" id="archiveMeta">共 <b>2,757</b> 帧<span class="sample">（样本 84）</span> · 已展 <b>12</b></p>
  </div>
  <div class="grid" id="grid">
    <button class="card" appReveal type="button" aria-label="查看：90年代的年轻人们 现在应该都起码60多了" style="transition-delay: 0ms;">
      <div class="card__media">
        <img alt="90年代的年轻人们 现在应该都起码60多了" loading="lazy" decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/86ecddeb-c0f7-49b3-9c04-8b3274bdac8d.jpeg"
          class="is-loaded"><span class="card__multi">3 帧</span>
      </div><span class="card__meta"><span class="num">№ 0001</span><span class="rule"></span><span>九十年代 · 卢湾 ·
          南市</span></span>
      <p class="card__text">90年代的年轻人们 现在应该都起码60多了</p>
    </button>
    <button class="card" appReveal type="button" aria-label="查看：或许是最美好的90年代" style="transition-delay: 70ms;">
      <div class="card__media"><img alt="或许是最美好的90年代" loading="lazy" decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/151ac049-17a8-4d3a-a5e3-34211601dba0.jpeg"
          class="is-loaded"><span class="card__multi">2 帧</span></div><span class="card__meta"><span class="num">№
          0002</span><span class="rule"></span><span>九十年代 · 南市 · 黄浦</span></span>
      <p class="card__text">或许是最美好的90年代</p>
    </button>
    <button class="card" appReveal type="button" aria-label="查看：Shanghai 1995, summer"
      style="transition-delay: 140ms;">
      <div class="card__media"><img alt="Shanghai 1995, summer" loading="lazy" decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/41922d2a-5cd5-4359-81d3-68a7012967ad.jpeg"
          class="is-loaded"><span class="card__multi">2 帧</span></div><span class="card__meta"><span class="num">№
          0003</span><span class="rule"></span><span>九十年代 · 黄浦</span></span>
      <p class="card__text">Shanghai 1995, summer</p>
    </button>
    <button class="card" appReveal type="button" aria-label="查看：Shanghai 1995, summer"
      style="transition-delay: 210ms;">
      <div class="card__media"><img alt="Shanghai 1995, summer" loading="lazy" decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/5009639a-b614-421d-b81b-b7ae7be7771d.jpeg"
          class="is-loaded"><span class="card__multi">2 帧</span></div><span class="card__meta"><span class="num">№
          0004</span><span class="rule"></span><span>九十年代 · 黄浦 · 卢湾</span></span>
      <p class="card__text">Shanghai 1995, summer</p>
    </button>
    <button class="card" appReveal type="button" aria-label="查看：Shanghai 1990s" style="transition-delay: 280ms;">
      <div class="card__media"><img alt="Shanghai 1990s" loading="lazy" decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/9ed9b8f2-c197-4fd4-b3c0-17c084b44370.jpeg"
          class="is-loaded"><span class="card__multi">2 帧</span></div><span class="card__meta"><span class="num">№
          0005</span><span class="rule"></span><span>九十年代 · 黄浦</span></span>
      <p class="card__text">Shanghai 1990s</p>
    </button>
    <button class="card" appReveal type="button" aria-label="查看：Shanghai 1990s" style="transition-delay: 350ms;">
      <div class="card__media"><img alt="Shanghai 1990s" loading="lazy" decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/a5f282dc-9646-43b0-83ed-7fd0e22d736c.jpeg"
          class="is-loaded"></div><span class="card__meta"><span class="num">№ 0006</span><span
          class="rule"></span><span>九十年代 · 黄浦</span></span>
      <p class="card__text">Shanghai 1990s</p>
    </button>
    <button class="card" appReveal type="button" aria-label="查看：Shanghai 1990s" style="transition-delay: 0ms;">
      <div class="card__media"><img alt="Shanghai 1990s" loading="lazy" decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/a309e93d-7c76-4e70-975c-1545c740247d.jpeg"
          class="is-loaded"></div><span class="card__meta"><span class="num">№ 0007</span><span
          class="rule"></span><span>九十年代 · 黄浦</span></span>
      <p class="card__text">Shanghai 1990s</p>
    </button>
    <button class="card" appReveal type="button" aria-label="查看：上海江南造纸厂厂址在光复西路1003号。就在原三官堂桥北岸东桥堍，边上是542厂。"
      style="transition-delay: 70ms;">
      <div class="card__media"><img alt="上海江南造纸厂厂址在光复西路1003号。就在原三官堂桥北岸东桥堍，边上是542厂。" loading="lazy" decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/428687e1-a1df-4d9f-80be-ff32d834b993.jpg"
          class="is-loaded"></div><span class="card__meta"><span class="num">№ 0008</span><span
          class="rule"></span><span>八十年代 · 长宁</span></span>
      <p class="card__text">上海江南造纸厂厂址在光复西路1003号。就在原三官堂桥北岸东桥堍，边上是542厂。</p>
    </button>
    <button class="card" appReveal type="button" aria-label="查看：1996年11月9日，上海徐家汇 - 东方商厦"
      style="transition-delay: 140ms;">
      <div class="card__media"><img alt="1996年11月9日，上海徐家汇 - 东方商厦" loading="lazy" decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/d2d25013-caef-42c0-80f6-67c96a36e082.jpg"
          class="is-loaded"></div><span class="card__meta"><span class="num">№ 0009</span><span
          class="rule"></span><span>九十年代 · 徐汇</span></span>
      <p class="card__text">1996年11月9日，上海徐家汇 - 东方商厦</p>
    </button>
    <button class="card" appReveal type="button" aria-label="查看：00年前后，静安寺" style="transition-delay: 210ms;">
      <div class="card__media"><img alt="00年前后，静安寺" loading="lazy" decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/ba49d25b-5397-428a-871e-c83c1fbded9b.jpg"
          class="is-loaded"></div><span class="card__meta"><span class="num">№ 0010</span><span
          class="rule"></span><span>九十年代 · 静安</span></span>
      <p class="card__text">00年前后，静安寺</p>
    </button>
    <button class="card" appReveal type="button"
      aria-label="查看：2000年，港汇的味千拉面，当时大部分人对于日式拉面的初体验都是来自于味千拉面。坊间传闻，老板是崇明人，也有说是台湾人。我当年最常去的是位于淮海中路上的味千拉面店。"
      style="transition-delay: 280ms;">
      <div class="card__media"><img
          alt="2000年，港汇的味千拉面，当时大部分人对于日式拉面的初体验都是来自于味千拉面。坊间传闻，老板是崇明人，也有说是台湾人。我当年最常去的是位于淮海中路上的味千拉面店。" loading="lazy"
          decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/7978beaa-6355-4cd1-ac48-2ebea4e7d50d.jpg"
          class="is-loaded"></div><span class="card__meta"><span class="num">№ 0011</span><span
          class="rule"></span><span>九十年代</span></span>
      <p class="card__text">2000年，港汇的味千拉面，当时大部分人对于日式拉面的初体验都是来自于味千拉面。坊间传闻，老板是崇明人，也有说是台湾人。我当年最常去的是位于淮海中路上的味千拉面店。</p>
    </button>
    <button class="card" appReveal type="button" aria-label="查看：2006年，茂名南路上林东圃了了自己开的爵士酒吧门口，当年的茂名南路还是很热闹的。"
      style="transition-delay: 350ms;">
      <div class="card__media"><img alt="2006年，茂名南路上林东圃了了自己开的爵士酒吧门口，当年的茂名南路还是很热闹的。" loading="lazy" decoding="async"
          src="https://stlaoshanghaiprod.blob.core.windows.net/photos/0fe5e7a4-c09b-46a4-997c-054b8dbe2d33.jpg"
          class="is-loaded"></div><span class="card__meta"><span class="num">№ 0012</span><span
          class="rule"></span><span>卢湾</span></span>
      <p class="card__text">2006年，茂名南路上林东圃了了自己开的爵士酒吧门口，当年的茂名南路还是很热闹的。</p>
    </button>
  </div>
  <div class="archive__more">
    <button class="btn-ink" id="loadMore" type="button"><span>续展</span><small>更多旧影</small></button>
    <p class="archive__end" id="archiveEnd" hidden="">卷终 · 已是最后一帧</p>
  </div>
</section>
  `,
})
export class CardList {}
