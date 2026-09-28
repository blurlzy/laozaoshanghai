/* 老早上海 · front-end
   Live data comes from the production API. Its CORS policy only allows https://laozaoshanghai.com,
   so anywhere else (local preview) we fall back to the bundled snapshot automatically. */
(() => {
  "use strict";

  const API = "https://aca-laozaoshanghai-api.jollyflower-2b3452a1.eastasia.azurecontainerapps.io/api/";
  const PAGE_SIZE = 30;          // accepted by the API
  const LOCAL_PAGE_SIZE = 12;    // snapshot pagination, so "load more" is still demonstrable
  const AUTO_LOADS = 2;          // infinite-scroll a couple of times, then hand control back to the reader
  const SNAP = window.LZSH_SNAPSHOT || { totals: {}, items: [] };

  const ERAS = [
    { key: "民国",   label: "民國", sub: "时期", range: "1912 — 1949", name: "民国" },
    { key: "60年代", label: "六〇", sub: "年代", range: "1960 — 1969", name: "六十年代" },
    { key: "70年代", label: "七〇", sub: "年代", range: "1970 — 1979", name: "七十年代" },
    { key: "80年代", label: "八〇", sub: "年代", range: "1980 — 1989", name: "八十年代" },
    { key: "90年代", label: "九〇", sub: "年代", range: "1990 — 1999", name: "九十年代" },
  ];
  const DISTRICTS = ["黄浦", "静安", "卢湾", "徐汇", "虹口", "长宁", "南市", "杨浦", "闸北", "普陀", "浦东"];
  const INTERLUDES = [
    "弄堂深处\n一声阿要白兰花",
    "外滩的钟\n敲过了一百年",
    "老早老早\n辰光慢　人情厚",
  ];
  const ERA_NAME = Object.fromEntries(ERAS.map(e => [e.key, e.name]));
  ERA_NAME["40年代"] = "四十年代"; ERA_NAME["50年代"] = "五十年代";

  const $ = (s, el = document) => el.querySelector(s);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "style") n.style.cssText = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null) n.append(kid.nodeType ? kid : document.createTextNode(kid));
    return n;
  };
  const pad = n => String(n).padStart(4, "0");
  const fmtNum = n => Number(n || 0).toLocaleString("en-US");

  const state = {
    mode: "unknown",   // unknown → live | snapshot
    filter: null,      // { type: 'era'|'district'|'search', value, label }
    page: 0, total: 0, displayTotal: 0, items: [], loading: false, autoLoads: 0, done: false,
    interludeIdx: 0,
    viewer: { index: -1, media: 0, item: null },
    reqId: 0,
  };

  /* ───────────────────────── Data ───────────────────────── */
  const normalize = it => ({
    id: it.id,
    text: (it.text || "").trim(),
    tags: it.tags || [],
    date: it.dateCreated || it.date,
    comments: it.totalComments ?? it.comments ?? null,
    cover: it.defaultImageUrl || it.cover || (it.mediaItems && it.mediaItems[0] && it.mediaItems[0].url),
    media: it.media || (it.mediaItems || []).filter(m => m.type === "photo").map(m => m.url),
  });

  async function live(path, init) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 7000);
    try {
      const r = await fetch(API + path, { ...init, signal: ctrl.signal });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const ct = r.headers.get("content-type") || "";
      return ct.includes("json") ? r.json() : r.text();
    } finally { clearTimeout(t); }
  }

  function snapshotQuery(keyword, page) {
    let list = SNAP.items;
    if (keyword) list = list.filter(i => i.tags.some(t => t.includes(keyword)) || i.text.includes(keyword));
    const s = page * LOCAL_PAGE_SIZE;
    // Show the real archive size for known filters; paginate over the sample we actually have.
    const known = keyword ? SNAP.totals[keyword] : SNAP.totals["全部"];
    return { total: list.length, displayTotal: known ?? list.length, items: list.slice(s, s + LOCAL_PAGE_SIZE).map(normalize), pageSize: LOCAL_PAGE_SIZE };
  }

  async function query(keyword, page) {
    if (state.mode !== "snapshot") {
      try {
        const kw = keyword ? "&keyword=" + encodeURIComponent(keyword) : "";
        const d = await live(`contentItems?pageIndex=${page}&pageSize=${PAGE_SIZE}${kw}`);
        state.mode = "live";
        return { total: d.total, items: (d.data || []).map(normalize), pageSize: PAGE_SIZE };
      } catch (err) {
        if (state.mode === "live") throw err;
        state.mode = "snapshot";
        toast("本地预览 · 使用样本数据");
      }
    }
    return snapshotQuery(keyword, page);
  }

  async function getItem(id) {
    const local = state.items.find(i => i.id === id) || SNAP.items.find(i => i.id === id);
    if (state.mode === "snapshot") return local ? normalize(local) : null;
    try { return normalize(await live("contentItems/" + id)); }
    catch { return local ? normalize(local) : null; }
  }

  /* ───────────────────────── Hero ───────────────────────── */
  const hero = { list: [], i: -1, timer: 0, token: 0 };
  function startHero(items) {
    hero.list = items.filter(i => i.cover).slice(0, 8);
    if (!hero.list.length) return;
    clearInterval(hero.timer);
    nextHero();
    hero.timer = setInterval(nextHero, 7500);
  }
  function nextHero() {
    const box = $("#heroPhoto");
    hero.i = (hero.i + 1) % hero.list.length;
    const i = hero.i, it = hero.list[i], token = ++hero.token;
    const img = new Image();
    img.alt = it.text || "上海老照片";
    img.decoding = "async";
    img.src = it.cover;
    img.onload = () => {
      if (token !== hero.token) return; // a newer slide started loading; drop this one
      box.append(img);
      requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add("is-on")));
      [...box.querySelectorAll("img")].slice(0, -1).forEach(old => {
        old.classList.remove("is-on");
        setTimeout(() => old.remove(), 2000);
      });
      const cap = $("#heroCaption");
      cap.style.opacity = 0;
      setTimeout(() => { cap.textContent = it.text || "上海"; $("#heroNum").textContent = "№ " + pad(i + 1); cap.style.opacity = 1; }, 500);
      box.onclick = () => openViewerFor(it);
    };
  }

  /* ───────────────────────── Era & district menus ───────────────────────── */
  function pick(ev, f) {
    ink(ev);
    closeMenus();
    document.body.classList.remove("nav-open"); $("#menuBtn").setAttribute("aria-expanded", false);
    setFilter(f);
  }

  function renderEraMenu() {
    $("#eraMenu").replaceChildren(...[...ERAS].reverse().map(e => el("li", {}, el("button", {
      class: "menu-era", type: "button", "data-type": "era", "data-key": e.key,
      "aria-label": `${e.name}，${fmtNum(SNAP.totals[e.key])} 帧`,
      onclick: ev => pick(ev, { type: "era", value: e.key, label: e.name }),
    },
      el("b", {}, e.label), el("small", {}, e.sub),
      el("span", { class: "range" }, e.range),
      el("span", { class: "count" }, fmtNum(SNAP.totals[e.key]), el("small", {}, "帧")),
    ))));
  }

  function renderDistrictMenu() {
    $("#districtMenu").replaceChildren(...DISTRICTS.map(d => el("li", {}, el("button", {
      class: "menu-district", type: "button", "data-type": "district", "data-key": d,
      onclick: ev => pick(ev, { type: "district", value: d, label: d }),
    }, d, el("sup", {}, fmtNum(SNAP.totals[d]))))));
  }

  function syncActive() {
    const f = state.filter;
    document.querySelectorAll(".menu-era, .menu-district").forEach(n =>
      n.classList.toggle("is-active", f?.type === n.dataset.type && f.value === n.dataset.key));
    document.querySelectorAll(".nav__group").forEach(g => g.classList.toggle("is-current", f?.type === g.dataset.type));
  }

  function closeMenus(except) {
    document.querySelectorAll(".nav__group").forEach(g => {
      if (g === except) return;
      g.classList.remove("is-open");
      $(".nav__trigger", g).setAttribute("aria-expanded", false);
    });
  }
  document.querySelectorAll(".nav__group").forEach(g => {
    const trigger = $(".nav__trigger", g);
    trigger.addEventListener("click", () => {
      closeMenus(g);
      const open = g.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", open);
    });
  });
  document.addEventListener("click", e => { if (!e.target.closest(".nav__group")) closeMenus(); });
  document.addEventListener("keydown", e => {
    const g = document.querySelector(".nav__group.is-open");
    if (e.key === "Escape" && g) { closeMenus(); $(".nav__trigger", g).focus(); }
  });

  /* ───────────────────────── Archive grid ───────────────────────── */
  // Row-based CSS grid (column count lives in styles.css); interludes go after multiples of 12
  // so they always close a full row at 1, 2, 3 or 4 columns.
  const INTERLUDE_AT = [12, 36, 60];

  function tagLine(tags) {
    const era = tags.map(t => ERA_NAME[t]).filter(Boolean)[0];
    const dist = tags.filter(t => t.endsWith("区")).map(t => t.replace(/区$/, "")).slice(0, 2);
    return [era, ...dist].filter(Boolean).join(" · ");
  }

  function card(item, index) {
    const img = el("img", { alt: item.text || "上海老照片", loading: "lazy", decoding: "async", src: item.cover });
    const media = el("div", { class: "card__media" }, img,
      item.media.length > 1 ? el("span", { class: "card__multi" }, `${item.media.length} 帧`) : null);
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });

    return el("button", {
      class: "card", type: "button",
      "aria-label": `查看：${item.text || "上海老照片"}`,
      onclick: ev => { ink(ev); openViewer(index); },
    },
      media,
      el("span", { class: "card__meta" },
        el("span", { class: "num" }, "№ " + pad(index + 1)),
        el("span", { class: "rule" }),
        el("span", {}, tagLine(item.tags))),
      item.text ? el("p", { class: "card__text" }, item.text) : null,
    );
  }

  function interlude() {
    const text = INTERLUDES[state.interludeIdx++ % INTERLUDES.length];
    return el("aside", { class: "interlude", "aria-hidden": "true" }, el("p", {}, ...text.split("\n").map(l => el("span", {}, l))));
  }

  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px" });

  function append(items) {
    const grid = $("#grid");
    const start = state.items.length;
    state.items.push(...items);
    items.forEach((it, k) => {
      const idx = start + k;
      if (!state.filter && INTERLUDE_AT.includes(idx)) {
        const i = interlude(); grid.append(i); io.observe(i);
      }
      const c = card(it, idx);
      c.style.transitionDelay = `${(k % 6) * 70}ms`;
      grid.append(c); io.observe(c);
    });
  }

  function renderMeta() {
    const shown = state.items.length;
    const sample = state.mode === "snapshot" ? `<span class="sample">（样本 ${fmtNum(state.total)}）</span>` : "";
    $("#archiveMeta").innerHTML = `共 <b>${fmtNum(state.displayTotal)}</b> 帧${sample} · 已展 <b>${fmtNum(shown)}</b>`;
    const f = $("#filterState");
    if (state.filter) {
      f.replaceChildren(el("span", { class: "chip" }, state.filter.label,
        el("button", { type: "button", "aria-label": "清除筛选", onclick: () => setFilter(null) }, "×")));
    } else {
      f.replaceChildren(el("span", { class: "filter__hint" }, "全部年代 · 全部地区"));
    }
    $("#loadMore").hidden = state.done;
    $("#archiveEnd").hidden = !state.done || !shown;
  }

  async function load({ reset = false } = {}) {
    if (state.loading || (state.done && !reset)) return;
    const req = ++state.reqId;
    if (reset) {
      state.page = 0; state.items = []; state.done = false; state.autoLoads = 0; state.interludeIdx = 0;
      $("#grid").replaceChildren(...Array.from({ length: 8 }, () => el("div", { class: "skeleton" })));
    }
    state.loading = true;
    const btn = $("#loadMore"); btn.classList.add("is-loading"); btn.disabled = true;
    try {
      const res = await query(state.filter?.value, state.page);
      if (req !== state.reqId) return;
      document.querySelectorAll(".skeleton").forEach(s => s.remove());
      state.total = res.total;
      state.displayTotal = res.displayTotal ?? res.total;
      append(res.items);
      state.page++;
      state.done = state.items.length >= res.total || res.items.length < res.pageSize;
      if (!state.items.length) {
        $("#grid").replaceChildren(el("p", { class: "empty" }, el("b", {}, "空"), "此处尚无旧影，换个词试试"));
      }
      if (!state.filter) $("#totalCount").textContent = fmtNum(state.displayTotal);
      renderMeta();
      return res;
    } catch (err) {
      console.error(err);
      toast("网络似乎断了，稍后再试");
    } finally {
      if (req === state.reqId) { state.loading = false; btn.classList.remove("is-loading"); btn.disabled = false; }
    }
  }

  function setFilter(f) {
    if (f && state.filter && f.type === state.filter.type && f.value === state.filter.value) f = null; // toggle off
    state.filter = f;
    syncActive();
    load({ reset: true });
    const bar = $("#archive");
    if (bar.getBoundingClientRect().top > innerHeight * .3 || bar.getBoundingClientRect().bottom < 0) bar.scrollIntoView({ behavior: "smooth" });
  }

  $("#loadMore").addEventListener("click", ev => { ink(ev); state.autoLoads = AUTO_LOADS; load(); });
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && state.autoLoads < AUTO_LOADS && state.items.length) { state.autoLoads++; load(); }
  }, { rootMargin: "400px 0px" }).observe($("#loadMore"));

  /* ───────────────────────── Search & nav ───────────────────────── */
  $("#searchForm").addEventListener("submit", e => {
    e.preventDefault();
    const q = $("#q").value.trim();
    document.body.classList.remove("nav-open");
    setFilter(q ? { type: "search", value: q, label: `「${q}」` } : null);
    $("#q").blur();
  });
  $("#menuBtn").addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    $("#menuBtn").setAttribute("aria-expanded", open);
  });
  document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
    document.body.classList.remove("nav-open"); $("#menuBtn").setAttribute("aria-expanded", false);
  }));

  const head = $(".masthead");
  const onScroll = () => head.classList.toggle("is-scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const navIO = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) {
      document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id));
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["archive", "about"].forEach(id => navIO.observe(document.getElementById(id)));

  /* ───────────────────────── Viewer ───────────────────────── */
  const dlg = $("#viewer");
  const isCJK = s => s && (s.match(/[\u3400-\u9fff]/g) || []).length / s.replace(/\s/g, "").length > .4;

  function openViewer(index) {
    state.viewer.index = index;
    showItem(state.items[index], 0);
  }
  async function openViewerFor(item) {
    const idx = state.items.findIndex(i => i.id === item.id);
    if (idx >= 0) return openViewer(idx);
    state.viewer.index = -1;
    showItem(item, 0);
  }

  function showItem(item, mediaIdx) {
    if (!item) return;
    const v = state.viewer;
    const changed = v.item?.id !== item.id;
    v.item = item; v.media = mediaIdx;
    if (!dlg.open) {
      dlg.showModal();
      document.documentElement.style.overflow = "hidden";
      $("#vFigure").focus({ preventScroll: true }); // keep arrow keys working without a stray focus ring on ‹
    }
    history.replaceState(null, "", "#/p/" + item.id);

    const url = item.media[mediaIdx] || item.cover;
    const img = $("#vImg");
    img.classList.remove("is-in");
    img.alt = item.text || "上海老照片";
    img.onload = () => img.classList.add("is-in");
    img.src = url;
    if (img.complete && img.naturalWidth) requestAnimationFrame(() => img.classList.add("is-in"));
    $("#vOpen").href = url;

    if (!changed) { syncThumbs(); return; }
    $("#vNum").textContent = v.index >= 0 ? `№ ${pad(v.index + 1)} / ${fmtNum(state.displayTotal)}` : "№ —";
    const t = $("#viewerText");
    t.textContent = item.text || "（无题）";
    t.classList.toggle("is-vertical", isCJK(item.text) && item.text.length <= 140);

    $("#vTags").replaceChildren(...item.tags.map(tag => {
      const era = ERAS.find(e => e.key === tag);
      const d = tag.replace(/区$/, "");
      const f = era ? { type: "era", value: era.key, label: era.name }
        : DISTRICTS.includes(d) ? { type: "district", value: d, label: d }
        : { type: "search", value: tag, label: `「${tag}」` };
      return el("li", {}, el("button", { type: "button", onclick: () => { closeViewer(); setFilter(f); } }, ERA_NAME[tag] || tag));
    }));

    $("#vThumbs").replaceChildren(...(item.media.length > 1 ? item.media.map((m, i) =>
      el("li", {}, el("button", { type: "button", "aria-label": `第 ${i + 1} 帧`, onclick: () => showItem(item, i) },
        el("img", { src: m, alt: "", loading: "lazy" })))) : []));
    syncThumbs();
    loadComments(item);
  }
  function syncThumbs() {
    [...$("#vThumbs").querySelectorAll("button")].forEach((b, i) => b.setAttribute("aria-current", i === state.viewer.media));
  }

  function step(dir) {
    const v = state.viewer, it = v.item;
    if (!it) return;
    const m = v.media + dir;
    if (m >= 0 && m < it.media.length) return showItem(it, m);
    if (v.index < 0) return;
    const ni = v.index + dir;
    if (ni < 0) return;
    if (ni >= state.items.length) {
      if (state.done) return;
      return load().then(() => state.items[ni] && (v.index = ni, showItem(state.items[ni], 0)));
    }
    v.index = ni;
    showItem(state.items[ni], dir > 0 ? 0 : Math.max(0, state.items[ni].media.length - 1));
  }

  function closeViewer() { if (dlg.open) dlg.close(); }
  dlg.addEventListener("close", () => {
    document.documentElement.style.overflow = "";
    state.viewer.item = null;
    history.replaceState(null, "", location.pathname + location.search);
  });
  $("#vClose").addEventListener("click", closeViewer);
  $("#vPrev").addEventListener("click", () => step(-1));
  $("#vNext").addEventListener("click", () => step(1));
  dlg.addEventListener("keydown", e => {
    if (e.target.closest("input, textarea")) return;
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  let touchX = null;
  $(".viewer__stage").addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
  $(".viewer__stage").addEventListener("touchend", e => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });

  $("#vShare").addEventListener("click", async () => {
    const it = state.viewer.item; if (!it) return;
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title: "老早上海", text: it.text, url });
      else { await navigator.clipboard.writeText(url); toast("链接已复制"); }
    } catch { /* user cancelled */ }
  });

  async function loadComments(item) {
    const list = $("#vComments"), form = $("#commentForm");
    form.reset();
    if (state.mode !== "live") {
      list.replaceChildren(el("li", { class: "muted" }, "本地预览中，留言请在线查看"));
      form.setAttribute("aria-disabled", "true");
      return;
    }
    form.removeAttribute("aria-disabled");
    list.replaceChildren(el("li", { class: "muted" }, "…"));
    try {
      const cs = (await live(`contentItems/${item.id}/comments`)) || [];
      if (state.viewer.item?.id !== item.id) return;
      const shown = cs.filter(c => c.reviewed !== false);
      list.replaceChildren(...(shown.length ? shown.map(c => el("li", {},
        el("p", {}, c.commentText),
        el("small", {}, `—— ${c.name || "佚名"} · ${new Date(c.dateCreated).toLocaleDateString("zh-CN")}`)))
        : [el("li", { class: "muted" }, "尚无留言。若您认得此处，请讲讲它的故事。")]));
    } catch { list.replaceChildren(el("li", { class: "muted" }, "留言暂时无法载入")); }
  }

  $("#commentForm").addEventListener("submit", async e => {
    e.preventDefault();
    const it = state.viewer.item; if (!it) return;
    const fd = new FormData(e.target);
    try {
      await live("comments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentItemId: it.id, name: fd.get("name"), commentText: fd.get("commentText") }),
      });
      e.target.reset();
      toast("已落款 · 审核后显示");
    } catch { toast("提交失败，请稍后再试"); }
  });

  /* ───────────────────────── Ink, toast ───────────────────────── */
  function ink(ev) {
    if (!ev || !ev.clientX || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const d = el("span", { class: "inkdrop", style: `left:${ev.clientX}px;top:${ev.clientY}px` });
    document.body.append(d);
    d.addEventListener("animationend", () => d.remove());
  }

  let toastT = 0;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  /* ───────────────────────── Boot ───────────────────────── */
  renderEraMenu();
  renderDistrictMenu();
  $("#totalCount").textContent = fmtNum(SNAP.totals["全部"] || 0);
  load({ reset: true }).then(res => {
    startHero(res?.items?.length ? res.items : SNAP.items.map(normalize));
    const m = location.hash.match(/^#\/p\/([\w-]+)/);
    if (m) getItem(m[1]).then(it => it && openViewerFor(it));
  });
})();
