(() => {
  const main = document.getElementById("main");
  const M = window.MANIFEST || {};
  const ALL = [...window.PROJECTS];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const img = (name, { thumb = true, alt = "", eager = false, cls = "" } = {}) => {
    const [w, h] = M[name] || [1600, 1200];
    const src = `assets/img/${thumb ? "thumb/" : ""}${name}.jpg`;
    return `<img src="${src}" width="${w}" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" class="${cls}">`;
  };

  /* ---------- Pied de page ---------- */
  const footerLinks = document.getElementById("footer-links");
  const socials = [...window.SITE.socials];
  if (window.SITE.email) socials.unshift({ label: window.SITE.email, url: `mailto:${window.SITE.email}` });
  footerLinks.innerHTML = socials.map(s => `<li><a class="pill" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a></li>`).join("");
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Pages ---------- */
  function renderHome() {
    const cards = [...ALL, { ...window.ABOUT, kind: "Profil" }];
    return `
      <section class="hero">
        <h1 class="hero__name reveal">${esc(window.SITE.name)}</h1>
        <p class="hero__tagline reveal">${esc(window.SITE.tagline)}</p>
        <ul class="hero__roles reveal">${window.SITE.roles.map(r => `<li>${esc(r)}</li>`).join("")}</ul>
      </section>
      <div class="section-label"><span>Travaux</span><span>${ALL.length} projets</span></div>
      <section class="grid" aria-label="Projets">
        ${cards.map((p, i) => `
          <a class="card reveal" href="#/${p.slug}">
            <div class="card__media">${img(p.cover, { alt: p.title, eager: i < 2 })}</div>
            <div class="card__meta">
              <h2 class="card__title"><span class="card__num">${String(i + 1).padStart(2, "0")}</span>${esc(p.title)}</h2>
              <span class="card__kind">${esc(p.kind)}</span>
            </div>
          </a>`).join("")}
      </section>`;
  }

  function blockHead(b) {
    if (!b.title && !b.text) return "";
    return `<div class="block__head">
      ${b.title ? `<h2 class="block__title">${esc(b.title)}</h2>` : ""}
      ${b.text ? `<p class="block__text">${esc(b.text)}</p>` : ""}
    </div>`;
  }

  const renderers = {
    text: b => blockHead(b),
    photos: b => `${blockHead(b)}
      <div class="masonry">${b.images.map(n =>
        `<button type="button" data-photo="${n}" aria-label="Agrandir la photo">${img(n, { cls: "is-loading" })}</button>`).join("")}
      </div>`,
    featured: b => `${blockHead(b)}
      <button type="button" class="featured" data-yt="${esc(b.id)}" aria-label="Lire la vidéo">
        ${b.label ? `<span class="featured__label">${esc(b.label)}</span>` : ""}
        ${b.cover ? img(b.cover, { thumb: false, cls: "featured__img" }) : `<img class="featured__img" src="https://i.ytimg.com/vi/${esc(b.id)}/hqdefault.jpg" alt="" loading="lazy">`}
        <span class="play" aria-hidden="true"></span>
      </button>`,
    youtube: b => `${blockHead(b)}
      <div class="tiles">${b.items.map(v => `
        <button type="button" class="tile" data-yt="${esc(v.id)}" aria-label="Lire ${esc(v.label || "la vidéo")}">
          <span class="tile__media">
            ${v.cover ? img(v.cover) : `<img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy">`}
            <span class="play" aria-hidden="true"></span>
          </span>
          ${v.label ? `<span class="tile__label">${esc(v.label)}</span>` : ""}
        </button>`).join("")}
      </div>`,
    adobe: b => {
      const frame = v => {
        const [w, h] = v.ratio.split("/").map(Number);
        return `<div class="vframe" style="aspect-ratio:${w}/${h}">
          <iframe src="https://www-ccv.adobe.io/v1/player/ccv/${esc(v.id)}/embed?bgcolor=%23121212&lazyLoading=true&api_key=BehancePro2View"
            loading="lazy" referrerpolicy="no-referrer" allow="autoplay; fullscreen" title="Vidéo"></iframe></div>`;
      };
      const vertical = b.items.filter(v => v.ratio === "9/16");
      const wide = b.items.filter(v => v.ratio !== "9/16");
      return `${blockHead(b)}
        ${vertical.length ? `<div class="videos videos--vertical">${vertical.map(frame).join("")}</div>` : ""}
        ${wide.length ? `<div class="videos videos--wide">${wide.map(frame).join("")}</div>` : ""}`;
    },
    instagram: b => `${blockHead(b)}
      <div class="insta">${b.items.map(url => `
        <blockquote class="instagram-media" data-instgrm-permalink="${esc(url)}?utm_source=ig_embed" data-instgrm-version="14">
          <a class="insta__fallback" href="${esc(url)}" target="_blank" rel="noopener">Voir sur Instagram ↗</a>
        </blockquote>`).join("")}
      </div>`
  };

  function nextLink(slug) {
    const order = [...ALL.map(p => p.slug), window.ABOUT.slug];
    const all = [...ALL, window.ABOUT];
    const next = all[(order.indexOf(slug) + 1) % all.length];
    return `<a class="next" href="#/${next.slug}">
      <span><span class="next__label">Projet suivant</span><span class="next__title">${esc(next.title)}</span></span>
      <span class="next__arrow" aria-hidden="true">→</span>
    </a>`;
  }

  function renderProject(p) {
    return `<article class="project">
      <header class="project__head">
        <a class="back" href="#/">← Tous les projets</a>
        <p class="project__kind">${esc(p.kind)}</p>
        <h1 class="project__title">${esc(p.title)}</h1>
        <p class="project__intro">${esc(p.intro)}</p>
      </header>
      ${p.blocks.map(b => `<section class="block">${renderers[b.type](b)}</section>`).join("")}
      ${nextLink(p.slug)}
    </article>`;
  }

  function renderAbout() {
    const a = window.ABOUT;
    return `<article class="project">
      <header class="project__head">
        <a class="back" href="#/">← Tous les projets</a>
        <p class="project__kind">Profil</p>
        <h1 class="project__title">${esc(a.title)}</h1>
      </header>
      <div class="about">
        <div class="about__text">
          ${a.text.map(t => `<p>${esc(t)}</p>`).join("")}
          <ul class="about__links">${socials.map(s => `<li><a class="pill" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a></li>`).join("")}</ul>
          ${a.timeline.map(sec => `
            <section class="timeline">
              <h2 class="timeline__title">${esc(sec.title)}</h2>
              <ol>${sec.items.map(it => `
                <li><span class="timeline__when">${esc(it.when)}</span>
                  <span><strong>${esc(it.what)}</strong>${it.where ? `<span class="timeline__where">${esc(it.where)}</span>` : ""}</span></li>`).join("")}
              </ol>
            </section>`).join("")}
          ${a.skills ? `<section class="timeline"><h2 class="timeline__title">Compétences</h2>
            <ul class="tags">${a.skills.map(s => `<li>${esc(s)}</li>`).join("")}</ul></section>` : ""}
        </div>
        ${a.cv ? `<figure class="about__cv">
          <div class="masonry masonry--single"><button type="button" data-photo="${a.cv}" aria-label="Agrandir le CV">${img(a.cv, { alt: "CV de Thomas Dumas" })}</button></div>
          <figcaption>CV — cliquer pour agrandir</figcaption>
        </figure>` : ""}
      </div>
      ${nextLink(a.slug)}
    </article>`;
  }

  /* ---------- Routeur ---------- */
  let lastHash = null;
  function route() {
    const raw = location.hash;
    if (raw === "#contact") { // ancre vers le pied de page, pas un changement de page
      document.getElementById("contact").scrollIntoView();
      return;
    }
    const slug = raw.replace(/^#\/?/, "");
    if (raw === lastHash && main.innerHTML) return;
    lastHash = raw;

    const project = ALL.find(p => p.slug === slug);
    let title = `${window.SITE.name} — Portfolio`;
    if (project) { main.innerHTML = renderProject(project); title = `${project.title} — ${window.SITE.name}`; }
    else if (slug === window.ABOUT.slug) { main.innerHTML = renderAbout(); title = `À propos — ${window.SITE.name}`; }
    else main.innerHTML = renderHome();
    document.title = title;

    document.querySelectorAll("[data-nav]").forEach(a => {
      const n = a.dataset.nav;
      a.classList.toggle("is-active", (n === "home" && (slug === "" || project)) || n === slug);
    });

    window.scrollTo({ top: 0, behavior: "instant" });
    main.focus({ preventScroll: true });
    afterRender();
  }

  /* ---------- Effets après rendu ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" })
    : null;

  function afterRender() {
    main.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("is-in"));
    main.querySelectorAll("img.is-loading").forEach(im => {
      const done = () => im.classList.remove("is-loading");
      im.complete ? done() : (im.addEventListener("load", done), im.addEventListener("error", done));
    });
    if (main.querySelector(".instagram-media")) loadInstagram();
  }

  let igLoading = false;
  function loadInstagram() {
    if (window.instgrm) { window.instgrm.Embeds.process(); return; }
    if (igLoading) return;
    igLoading = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    s.onload = () => window.instgrm && window.instgrm.Embeds.process();
    document.body.appendChild(s);
  }

  /* ---------- Visionneuse photo ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img");
  const lbCount = lb.querySelector(".lb-count");
  let gallery = [], idx = 0;

  function showPhoto(i) {
    idx = (i + gallery.length) % gallery.length;
    const name = gallery[idx];
    lbImg.src = `assets/img/${name}.jpg`;
    lbCount.textContent = `${idx + 1} / ${gallery.length}`;
    // précharge la suivante
    new Image().src = `assets/img/${gallery[(idx + 1) % gallery.length]}.jpg`;
  }

  lb.addEventListener("click", e => {
    const a = e.target.closest("[data-lb]")?.dataset.lb;
    if (a === "close" || e.target === lb) lb.close();
    else if (a === "prev") showPhoto(idx - 1);
    else if (a === "next") showPhoto(idx + 1);
  });
  lb.addEventListener("close", () => { lbImg.removeAttribute("src"); });

  let touchX = null;
  lb.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showPhoto(idx + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------- Lecteur YouTube ---------- */
  const player = document.getElementById("player");
  const frame = player.querySelector(".player__frame");
  player.addEventListener("click", e => {
    if (e.target.closest("[data-player=close]") || e.target === player) player.close();
  });
  player.addEventListener("close", () => { frame.innerHTML = ""; });

  /* ---------- Clics globaux ---------- */
  main.addEventListener("click", e => {
    const ph = e.target.closest("[data-photo]");
    if (ph) {
      gallery = [...ph.parentElement.querySelectorAll("[data-photo]")].map(b => b.dataset.photo);
      showPhoto(gallery.indexOf(ph.dataset.photo));
      lb.showModal();
      return;
    }
    const yt = e.target.closest("[data-yt]");
    if (yt) {
      frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt.dataset.yt)}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="Vidéo YouTube"></iframe>`;
      player.showModal();
    }
  });

  document.addEventListener("keydown", e => {
    if (!lb.open) return;
    if (e.key === "ArrowRight") showPhoto(idx + 1);
    if (e.key === "ArrowLeft") showPhoto(idx - 1);
  });

  const topbar = document.querySelector(".topbar");
  addEventListener("scroll", () => topbar.classList.toggle("is-scrolled", scrollY > 8), { passive: true });

  addEventListener("hashchange", route);
  route();
})();
