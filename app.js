(() => {
  const main = document.getElementById("main");
  const M = window.MANIFEST || {};
  const SITE = window.SITE;
  const ABOUT = window.ABOUT;
  const ALL = [...window.PROJECTS];
  const PAGES = [...ALL, { ...ABOUT, kind: "Profil" }]; // ordre de navigation
  const cvs = ABOUT.cvs || [];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = n => String(n).padStart(2, "0");

  /* ---------- Images : AVIF léger + JPEG de secours ----------
     Chaque image existe en 900 px (thumb/) et 1800 px, en .avif et .jpg.
     `sizes` indique au navigateur la largeur affichée pour choisir la bonne. */
  // Version des images : à augmenter après avoir remplacé des fichiers, pour forcer leur rechargement.
  const V = "?v=2";
  function pic(name, { alt = "", sizes = "(max-width: 720px) 100vw, 50vw", eager = false, cls = "" } = {}) {
    const [w, h] = M[name] || [1600, 1200];
    const base = `assets/img/`;
    return `<picture>
      <source type="image/avif" srcset="${base}thumb/${name}.avif${V} 900w, ${base}${name}.avif${V} 1800w" sizes="${sizes}">
      <img src="${base}thumb/${name}.jpg${V}" srcset="${base}thumb/${name}.jpg${V} 900w, ${base}${name}.jpg${V} 1800w" sizes="${sizes}"
        width="${w}" height="${h}" alt="${esc(alt)}" class="${cls}" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>
    </picture>`;
  }

  const supportsAvif = new Promise(res => {
    const t = new Image();
    t.onload = () => res(t.width > 0);
    t.onerror = () => res(false);
    t.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
  });
  let ext = "jpg";
  supportsAvif.then(ok => { if (ok) ext = "avif"; });

  /* ---------- Liens communs ---------- */
  const socials = SITE.socials;
  const pill = (href, label, { solid = false, ext: external = true, extra = "" } = {}) =>
    `<li><a class="pill${solid ? " pill--solid" : ""}" href="${esc(href)}" ${external ? 'target="_blank" rel="noopener"' : ""} ${extra}>${label}</a></li>`;
  const mailLink = () => SITE.email ? pill(`mailto:${SITE.email}`, `Écrire à ${esc(SITE.email)}`, { solid: true, ext: false }) : "";
  const cvLinks = () => cvs.map(c => pill(c.file, `${esc(c.label)} <span class="pill__tag">PDF</span>`, { extra: "download" })).join("");
  const socialLinks = () => socials.map(s => pill(s.url, `${esc(s.label)} ↗`)).join("");

  document.getElementById("footer-links").innerHTML = mailLink() + cvLinks() + socialLinks();
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Accueil ---------- */
  function renderHome() {
    return `
      <section class="hero">
        <h1 class="hero__name">${esc(SITE.name)}</h1>
        <p class="hero__tagline">${esc(SITE.tagline)}</p>
        <p class="hero__roles">${SITE.roles.map(esc).join("\u00a0· ")}</p>
        <ul class="hero__actions">
          <li><a class="pill pill--solid" href="#travaux" data-scroll="travaux">Voir les projets ↓</a></li>
          ${cvs[0] ? pill(cvs[0].file, `Télécharger mon CV <span class="pill__tag">PDF</span>`, { extra: "download" }) : ""}
          <li><a class="pill" href="#contact">Me contacter</a></li>
        </ul>
      </section>
      <div class="section-label" id="travaux"><h2>Travaux</h2><span>${ALL.length} projets</span></div>
      <section class="grid" aria-label="Projets">
        ${PAGES.map((p, i) => `
          <a class="card" href="#/${p.slug}">
            <div class="card__media">
              ${pic(p.cover, { alt: "", eager: i < 2, sizes: "(max-width: 720px) 100vw, 50vw" })}
              <span class="card__cta" aria-hidden="true">Voir ${p.slug === ABOUT.slug ? "le profil" : "le projet"} →</span>
            </div>
            <div class="card__meta">
              <h3 class="card__title"><span class="card__num">${pad(i + 1)}</span>${esc(p.title)}</h3>
              <span class="card__kind">${esc(p.kind)}</span>
            </div>
            ${p.summary ? `<p class="card__summary">${esc(p.summary)}</p>` : ""}
          </a>`).join("")}
      </section>`;
  }

  /* ---------- Blocs des pages projet ---------- */
  const blockId = (p, i) => `${p.slug}-${i}`;

  function blockHead(b) {
    if (!b.title && !b.text) return "";
    return `<div class="block__head">
      ${b.title ? `<h2 class="block__title">${esc(b.title)}${b.count ? ` <span class="block__count">${b.count}</span>` : ""}</h2>` : ""}
      ${b.text ? `<p class="block__text">${esc(b.text)}</p>` : ""}
    </div>`;
  }

  const playIcon = `<span class="play" aria-hidden="true"></span>`;

  const renderers = {
    text: b => blockHead(b),

    photos: b => `${blockHead({ ...b, count: b.images.length })}
      <div class="masonry">${b.images.map((n, i) =>
        `<button type="button" class="ph" data-photo="${n}" data-caption="${esc(b.title || "")}" aria-label="Agrandir la photo ${i + 1} sur ${b.images.length}">
          ${pic(n, { alt: b.title ? `${b.title}, photo ${i + 1}` : "", sizes: "(max-width: 720px) 50vw, 33vw" })}
        </button>`).join("")}
      </div>`,

    featured: b => `${blockHead(b)}
      <button type="button" class="featured" data-video="youtube" data-id="${esc(b.id)}" aria-label="Lire la vidéo à la une">
        ${b.label ? `<span class="badge">${esc(b.label)}</span>` : ""}
        ${b.cover ? pic(b.cover, { sizes: "(max-width: 1440px) 100vw, 1440px", cls: "media-fill" }) : `<img class="media-fill" src="https://i.ytimg.com/vi/${esc(b.id)}/hqdefault.jpg" alt="" loading="lazy">`}
        ${playIcon}
      </button>`,

    youtube: b => `${blockHead({ ...b, count: b.items.length })}
      <div class="tiles tiles--wide">${b.items.map((v, i) => `
        <button type="button" class="tile" data-video="youtube" data-id="${esc(v.id)}" aria-label="Lire ${esc(v.label || `la vidéo ${i + 1}`)}">
          <span class="tile__media" style="aspect-ratio:16/9">
            ${v.cover ? pic(v.cover, { sizes: "(max-width: 720px) 100vw, 33vw", cls: "media-fill" }) : `<img class="media-fill" src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy">`}
            ${playIcon}
          </span>
          ${v.label ? `<span class="tile__label">${esc(v.label)}</span>` : ""}
        </button>`).join("")}
      </div>`,

    // Vidéos hébergées par Adobe : on affiche l'aperçu, le lecteur ne se charge qu'au clic.
    adobe: b => {
      const tile = v => `
        <button type="button" class="tile" data-video="adobe" data-id="${esc(v.id)}" data-ratio="${esc(v.ratio)}" aria-label="Lire la vidéo">
          <span class="tile__media" style="aspect-ratio:${v.ratio}">
            ${M[`video-${v.id}`] ? pic(`video-${v.id}`, { sizes: v.ratio === "9/16" ? "(max-width: 720px) 50vw, 25vw" : "(max-width: 720px) 100vw, 50vw", cls: "media-fill" }) : ""}
            ${playIcon}
          </span>
        </button>`;
      const vertical = b.items.filter(v => v.ratio === "9/16");
      const wide = b.items.filter(v => v.ratio !== "9/16");
      return `${blockHead({ ...b, count: b.items.length })}
        ${vertical.length ? `<div class="tiles tiles--vertical">${vertical.map(tile).join("")}</div>` : ""}
        ${wide.length ? `<div class="tiles tiles--wide">${wide.map(tile).join("")}</div>` : ""}`;
    },

    // Posts Instagram : aperçu local, la publication s'ouvre au clic.
    instagram: b => `${blockHead({ ...b, count: b.items.length })}
      <div class="tiles tiles--vertical">${b.items.map(url => {
        const [, kind, code] = url.match(/instagram\.com\/(reel|p)\/([\w-]+)/) || [];
        return `<button type="button" class="tile" data-video="instagram" data-id="${esc(code)}" data-kind="${esc(kind)}" aria-label="Ouvrir ${kind === "reel" ? "le reel" : "la publication"} Instagram">
          <span class="tile__media" style="aspect-ratio:4/5">
            ${M[`insta-${code}`] ? pic(`insta-${code}`, { sizes: "(max-width: 720px) 50vw, 25vw", cls: "media-fill" }) : ""}
            ${kind === "reel" ? playIcon : ""}
            <span class="badge badge--corner">${kind === "reel" ? "Reel" : "Post"}</span>
          </span>
        </button>`;
      }).join("")}
      </div>`
  };

  /* Raccourcis vers les sections d'une page longue */
  function sectionNav(p) {
    const titled = p.blocks.map((b, i) => ({ b, i })).filter(x => x.b.title);
    if (titled.length < 2) return "";
    return `<nav class="chips" aria-label="Sections de la page">${titled.map(({ b, i }) =>
      `<button type="button" class="chip" data-goto="${blockId(p, i)}">${esc(b.title)}</button>`).join("")}</nav>`;
  }

  function pager(slug) {
    const i = PAGES.findIndex(p => p.slug === slug);
    const prev = PAGES[(i - 1 + PAGES.length) % PAGES.length];
    const next = PAGES[(i + 1) % PAGES.length];
    return `<nav class="pager" aria-label="Autres projets">
      <a class="pager__link" href="#/${prev.slug}"><span class="pager__label">← Précédent</span><span class="pager__title">${esc(prev.title)}</span></a>
      <a class="pager__link pager__link--next" href="#/${next.slug}"><span class="pager__label">Suivant →</span><span class="pager__title">${esc(next.title)}</span></a>
    </nav>`;
  }

  const head = (kind, title, intro) => `
    <header class="project__head">
      <a class="back" href="#/">← Tous les projets</a>
      <p class="project__kind">${esc(kind)}</p>
      <h1 class="project__title">${esc(title)}</h1>
      ${intro ? `<p class="project__intro">${esc(intro)}</p>` : ""}
    </header>`;

  function renderProject(p) {
    return `<article class="project">
      ${head(p.kind, p.title, p.intro)}
      ${sectionNav(p)}
      ${p.blocks.map((b, i) => `<section class="block" id="${blockId(p, i)}">${renderers[b.type](b)}</section>`).join("")}
      ${pager(p.slug)}
    </article>`;
  }

  function renderAbout() {
    const a = ABOUT;
    return `<article class="project">
      ${head("Profil", a.title)}
      <div class="about">
        <div class="about__text">
          <div class="about__intro">${a.text.map(t => `<p>${esc(t)}</p>`).join("")}</div>
          <ul class="pills">${mailLink()}${cvLinks()}${socialLinks()}</ul>
          ${a.timeline.map(sec => `
            <section class="timeline">
              <h2 class="timeline__title">${esc(sec.title)}</h2>
              <ol>${sec.items.map(it => `
                <li><span class="timeline__when">${esc(it.when)}</span>
                  <span><strong>${esc(it.what)}</strong>${it.where ? `<span class="timeline__where">${esc(it.where)}</span>` : ""}</span></li>`).join("")}
              </ol>
            </section>`).join("")}
          ${a.skills ? `<section class="timeline"><h2 class="timeline__title">Compétences & outils</h2>
            <ul class="tags">${a.skills.map(s => `<li>${esc(s)}</li>`).join("")}</ul></section>` : ""}
        </div>
        ${cvs.length ? `<figure class="about__cv">
          <div class="cv-tabs" role="group" aria-label="Langue du CV">${cvs.map((c, i) =>
            `<button type="button" class="cv-tab" data-cv="${i}" aria-pressed="${i === 0}">${esc(c.lang)}</button>`).join("")}</div>
          <a class="cv-preview" href="${esc(cvs[0].file)}" target="_blank" rel="noopener">
            <picture><source type="image/avif" srcset="${esc(cvs[0].preview.replace(/\.jpg$/, ".avif"))}${V}">
            <img src="${esc(cvs[0].preview)}" width="989" height="1400" alt="Aperçu du CV de Thomas Dumas" loading="lazy"></picture>
          </a>
          <figcaption>Cliquer sur l'aperçu pour ouvrir le PDF</figcaption>
        </figure>` : ""}
      </div>
      ${pager(a.slug)}
    </article>`;
  }

  /* ---------- Routeur (#/projet) ---------- */
  const scrollMemory = {};
  let current = null;

  function route() {
    const raw = location.hash;
    // Ancres internes (#contact, #travaux) : on défile, sans changer de page
    if (raw && !raw.startsWith("#/")) {
      const target = document.getElementById(raw.slice(1));
      if (current !== null && target) { target.scrollIntoView({ behavior: "smooth" }); return; }
    }
    const slug = raw.startsWith("#/") ? raw.slice(2) : "";
    if (current === slug && main.innerHTML) return;
    if (current !== null) scrollMemory[current] = scrollY;
    current = slug;

    const project = ALL.find(p => p.slug === slug);
    let title = `${SITE.name} — Portfolio`;
    let desc = SITE.description;
    if (project) { main.innerHTML = renderProject(project); title = `${project.title} — ${SITE.name}`; desc = project.intro; }
    else if (slug === ABOUT.slug) { main.innerHTML = renderAbout(); title = `À propos — ${SITE.name}`; desc = ABOUT.text[0]; }
    else { main.innerHTML = renderHome(); current = ""; }
    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute("content", desc.slice(0, 160));

    document.querySelectorAll("[data-nav]").forEach(a => {
      const n = a.dataset.nav;
      const active = (n === "home" && current !== ABOUT.slug) || n === current;
      a.classList.toggle("is-active", active);
      active ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
    });

    // Retour à l'accueil : on revient là où on était dans la grille
    const y = current === "" ? scrollMemory[""] || 0 : 0;
    window.scrollTo({ top: y, behavior: "instant" });
    if (raw && !raw.startsWith("#/")) document.getElementById(raw.slice(1))?.scrollIntoView();
    main.focus({ preventScroll: true });
  }

  /* ---------- Visionneuse photo ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img");
  const lbCount = lb.querySelector(".lb-count");
  let gallery = [], idx = 0, caption = "";
  const full = name => `assets/img/${name}.${ext}${V}`;

  function showPhoto(i) {
    idx = (i + gallery.length) % gallery.length;
    lbImg.classList.add("is-loading");
    lbImg.onload = () => lbImg.classList.remove("is-loading");
    lbImg.src = full(gallery[idx]);
    lbImg.alt = caption ? `${caption}, photo ${idx + 1}` : "";
    lbCount.textContent = `${caption ? caption + " · " : ""}${idx + 1} / ${gallery.length}`;
    // précharge les voisines
    [idx + 1, idx - 1].forEach(j => { new Image().src = full(gallery[(j + gallery.length) % gallery.length]); });
  }

  lb.addEventListener("click", e => {
    const a = e.target.closest("[data-lb]")?.dataset.lb;
    if (a === "close" || e.target === lb || e.target.classList.contains("lb-figure")) lb.close();
    else if (a === "prev") showPhoto(idx - 1);
    else if (a === "next") showPhoto(idx + 1);
  });
  lb.addEventListener("close", () => lbImg.removeAttribute("src"));

  let touchX = null;
  lb.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showPhoto(idx + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------- Lecteur (YouTube, Adobe, Instagram) ---------- */
  const player = document.getElementById("player");
  const frame = player.querySelector(".player__frame");
  const playerLink = player.querySelector(".player__link");

  function openVideo(el) {
    const { video, id, ratio, kind } = el.dataset;
    let src, r = "16/9", link = "";
    if (video === "youtube") {
      src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`;
      link = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
    } else if (video === "adobe") {
      src = `https://www-ccv.adobe.io/v1/player/ccv/${encodeURIComponent(id)}/embed?bgcolor=%23000000&autoplay=true&api_key=BehancePro2View`;
      r = ratio || "16/9";
    } else {
      src = `https://www.instagram.com/${kind}/${encodeURIComponent(id)}/embed/`;
      link = `https://www.instagram.com/${kind}/${encodeURIComponent(id)}/`;
      r = "instagram";
    }
    frame.dataset.ratio = r;
    frame.style.setProperty("--ratio", r === "instagram" ? "" : r);
    frame.innerHTML = `<iframe src="${src}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" title="Lecteur"></iframe>`;
    playerLink.hidden = !link;
    playerLink.href = link || "#";
    playerLink.textContent = video === "instagram" ? "Ouvrir sur Instagram ↗" : "Ouvrir sur YouTube ↗";
    player.showModal();
  }

  player.addEventListener("click", e => {
    if (e.target.closest("[data-player=close]") || e.target === player) player.close();
  });
  player.addEventListener("close", () => { frame.innerHTML = ""; });

  /* ---------- Clics ---------- */
  main.addEventListener("click", e => {
    const ph = e.target.closest("[data-photo]");
    if (ph) {
      gallery = [...ph.parentElement.querySelectorAll("[data-photo]")].map(b => b.dataset.photo);
      caption = ph.dataset.caption || "";
      lb.showModal();
      showPhoto(gallery.indexOf(ph.dataset.photo));
      return;
    }
    const v = e.target.closest("[data-video]");
    if (v) return openVideo(v);

    const go = e.target.closest("[data-goto]");
    if (go) return document.getElementById(go.dataset.goto)?.scrollIntoView({ behavior: "smooth" });

    const sc = e.target.closest("[data-scroll]");
    if (sc) { e.preventDefault(); return document.getElementById(sc.dataset.scroll)?.scrollIntoView({ behavior: "smooth" }); }

    const tab = e.target.closest("[data-cv]");
    if (tab) {
      const c = cvs[+tab.dataset.cv];
      const fig = tab.closest(".about__cv");
      fig.querySelectorAll("[data-cv]").forEach(t => t.setAttribute("aria-pressed", t === tab));
      fig.querySelector(".cv-preview").href = c.file;
      fig.querySelector(".cv-preview source").srcset = c.preview.replace(/\.jpg$/, ".avif") + V;
      fig.querySelector(".cv-preview img").src = c.preview;
    }
  });

  document.addEventListener("keydown", e => {
    if (!lb.open) return;
    if (e.key === "ArrowRight") showPhoto(idx + 1);
    if (e.key === "ArrowLeft") showPhoto(idx - 1);
  });

  /* ---------- Barre du haut + bouton « haut de page » ---------- */
  const topbar = document.querySelector(".topbar");
  const toTop = document.getElementById("to-top");
  const onScroll = () => {
    topbar.classList.toggle("is-scrolled", scrollY > 8);
    toTop.classList.toggle("is-visible", scrollY > innerHeight * 1.5);
  };
  addEventListener("scroll", onScroll, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  addEventListener("hashchange", route);
  route();
  onScroll();
})();
