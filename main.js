const CATEGORIES = [
  "AI Ads & Reels",
  "AI Twins & Talking Avatars",
  "Claymation & Stylized",
  "Trailers & Cinematic",
  "Brand & Explainer",
];

const showreelRoot = document.querySelector("#showreel");
const heroGrid = document.querySelector(".hero-grid");
const filters = document.querySelector("#filters");
const grid = document.querySelector("#grid");
const status = document.querySelector("#work-status");
const player = document.querySelector("#player");
const playerFrame = document.querySelector("#player-frame");
const playerTitle = document.querySelector("#player-title");
const playerOpen = document.querySelector("#player-open");
const playerClose = document.querySelector("#player-close");

let videos = [];
let activeCategory = "All";

document.addEventListener("click", (event) => {
  const placeholder = event.target.closest("a.is-placeholder");
  if (placeholder) event.preventDefault();
});

playerClose.addEventListener("click", () => closePlayer());
player.addEventListener("click", (event) => {
  if (event.target === player) closePlayer();
});
player.addEventListener("close", () => {
  playerFrame.replaceChildren();
});

try {
  const response = await fetch(new URL("videos.json", import.meta.url));
  if (!response.ok) throw new Error(`videos.json returned ${response.status}`);
  const data = await response.json();
  if (!data || !Array.isArray(data.videos)) throw new Error("videos.json needs a videos array");
  videos = data.videos.filter((video) => video && typeof video.title === "string");
  applyContact(data.contact);
  renderShowreel();
  renderFilters();
  renderGrid();
} catch (error) {
  console.error(error);
  showLoadError();
}

function showLoadError() {
  const note = document.createElement("p");
  note.className = "empty";
  note.textContent = "The work list did not load. Serve this folder with a local web server so videos.json can be fetched.";
  grid.replaceChildren(note);
}

function applyContact(contact) {
  if (!contact) return;
  const email = document.querySelector("#contact-email");
  if (email && contact.email) {
    email.textContent = contact.email;
    email.href = `mailto:${contact.email}`;
  }
  const phone = document.querySelector("#contact-phone");
  if (phone && contact.phone) {
    phone.textContent = contact.phone;
    phone.href = `tel:${String(contact.phone).replace(/\s+/g, "")}`;
  }
  const xLink = document.querySelector("#contact-x");
  if (xLink && safeUrl(contact.x)) {
    xLink.href = safeUrl(contact.x);
    xLink.textContent = contact.xHandle ? `X · ${contact.xHandle}` : "X";
    xLink.classList.remove("is-placeholder");
  }
  setOptionalLink("#contact-upwork", contact.upwork, "Upwork");
  setOptionalLink("#contact-linkedin", contact.linkedin, "LinkedIn");
}

function setOptionalLink(selector, url, label) {
  const node = document.querySelector(selector);
  if (!node) return;
  const href = safeUrl(url);
  if (!href) {
    node.classList.add("is-placeholder");
    node.removeAttribute("href");
    node.textContent = `${label} · placeholder`;
    node.setAttribute("aria-disabled", "true");
    return;
  }
  node.classList.remove("is-placeholder");
  node.href = href;
  node.target = "_blank";
  node.rel = "noopener noreferrer";
  node.textContent = label;
  node.removeAttribute("aria-disabled");
}

function categoryList() {
  const extras = [];
  for (const video of videos) {
    const category = video.category;
    if (category && !CATEGORIES.includes(category) && !extras.includes(category)) extras.push(category);
  }
  return ["All", ...CATEGORIES, ...extras];
}

function renderFilters() {
  filters.replaceChildren();
  for (const category of categoryList()) {
    const button = document.createElement("button");
    button.type = "button";
    button.append(document.createTextNode(category));
    const count = document.createElement("span");
    count.className = "count";
    const total = category === "All"
      ? videos.length
      : videos.filter((video) => video.category === category).length;
    count.textContent = String(total);
    button.append(count);
    button.setAttribute("aria-pressed", category === activeCategory ? "true" : "false");
    button.addEventListener("click", () => {
      activeCategory = category;
      for (const other of filters.querySelectorAll("button")) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      }
      renderGrid();
    });
    filters.append(button);
  }
}

function renderGrid() {
  const visible = videos.filter((video) => activeCategory === "All" || video.category === activeCategory);
  const noun = visible.length === 1 ? "piece" : "pieces";
  status.textContent = `${visible.length} ${noun} in ${activeCategory}`;
  grid.replaceChildren();
  if (!visible.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Nothing in this category yet. Add a video in videos.json.";
    grid.append(empty);
    return;
  }
  for (const video of visible) grid.append(createCard(video));
}

function createCard(video) {
  const vertical = video.orientation === "vertical";
  const card = document.createElement("article");
  card.className = `card ${vertical ? "is-vertical" : "is-horizontal"}${video.placeholder ? " is-placeholder" : ""}`;
  if (video.placeholder) card.dataset.placeholder = "true";

  const media = document.createElement("div");
  media.className = "card-media";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "media-button";
  if (video.placeholder) {
    button.disabled = true;
    button.setAttribute("aria-label", `${video.title}. Sample slot, not a finished piece.`);
  } else {
    button.setAttribute("aria-label", `Play ${video.title}`);
    button.addEventListener("click", () => openPlayer(video));
  }
  fillPoster(button, video);
  media.append(button);

  const body = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = video.category || "Work";
  const title = document.createElement("h3");
  title.textContent = video.title;
  const description = document.createElement("p");
  description.className = "description";
  description.textContent = video.description || "";
  body.append(eyebrow, title, description);

  if (Array.isArray(video.tools) && video.tools.length) {
    const list = document.createElement("ul");
    list.className = "tool-list";
    for (const tool of video.tools) {
      const item = document.createElement("li");
      item.textContent = String(tool);
      list.append(item);
    }
    body.append(list);
  }

  const href = safeUrl(video.url);
  if (href && !video.placeholder) {
    const link = document.createElement("a");
    link.className = "card-link";
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open original";
    body.append(link);
  }

  card.append(media, body);
  return card;
}

function renderShowreel() {
  const video = videos.find((item) => item.showreel && !item.placeholder)
    || videos.find((item) => !item.placeholder);
  showreelRoot.replaceChildren();
  if (!video) return;
  const vertical = video.orientation === "vertical";
  showreelRoot.classList.toggle("is-vertical", vertical);
  showreelRoot.classList.toggle("is-horizontal", !vertical);
  heroGrid.classList.toggle("is-vertical", vertical);
  heroGrid.classList.toggle("is-horizontal", !vertical);

  const figure = document.createElement("figure");
  const frame = document.createElement("div");
  frame.className = "showreel-frame";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "media-button";
  button.setAttribute("aria-label", `Play showreel: ${video.title}`);
  fillPoster(button, video, { eager: true });
  button.addEventListener("click", () => openPlayer(video));
  frame.append(button);

  const caption = document.createElement("figcaption");
  caption.className = "showreel-caption";
  const kicker = document.createElement("p");
  kicker.className = "kicker";
  kicker.textContent = "Showreel";
  const title = document.createElement("p");
  title.className = "showreel-title";
  title.textContent = video.title;
  caption.append(kicker, title);
  figure.append(frame, caption);
  showreelRoot.append(figure);
}

function fillPoster(button, video, options = {}) {
  const src = posterSrc(video);
  if (!src) {
    button.classList.add("is-fallback");
    if (video.placeholder || options.label) button.append(fallbackLabel(video));
  } else {
    const image = document.createElement("img");
    image.alt = "";
    image.src = src;
    image.decoding = "async";
    if (!options.eager) image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      button.classList.add("is-fallback");
      button.prepend(fallbackLabel(video));
    });
    button.append(image);
  }

  if (video.placeholder) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "Placeholder";
    button.append(badge);
    return;
  }

  const play = document.createElement("span");
  play.className = "play";
  play.setAttribute("aria-hidden", "true");
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("width", "18");
  icon.setAttribute("height", "18");
  icon.setAttribute("viewBox", "0 0 20 20");
  icon.setAttribute("fill", "currentColor");
  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("points", "6,4 16,10 6,16");
  icon.append(polygon);
  play.append(icon);
  button.append(play);
}

function fallbackLabel(video) {
  const label = document.createElement("span");
  label.className = "fallback-title";
  label.textContent = video.placeholder ? "Sample slot" : video.title;
  return label;
}

function posterSrc(video) {
  const thumb = String(video.thumbnail || "").trim();
  if (!thumb) return "";
  if (/^(https?:)?\/\//i.test(thumb)) return safeUrl(thumb);
  if (/^[a-z0-9_./-]+$/i.test(thumb) && !thumb.includes("..")) return thumb;
  return "";
}

function openPlayer(video) {
  const src = embedSrc(video.url);
  const pageUrl = safeUrl(video.url);
  if (!src) {
    if (pageUrl) window.open(pageUrl, "_blank", "noopener");
    return;
  }
  const vertical = video.orientation === "vertical";
  playerFrame.className = `player-frame ${vertical ? "is-vertical" : "is-horizontal"}`;
  playerFrame.replaceChildren();
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.title = video.title;
  iframe.allow = "autoplay; fullscreen; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  playerFrame.append(iframe);
  playerTitle.textContent = video.title;
  playerOpen.href = pageUrl || src;
  if (!player.open) player.showModal();
}

function closePlayer() {
  if (player.open) player.close();
  playerFrame.replaceChildren();
}

function embedSrc(url) {
  const safe = safeUrl(url);
  if (!safe) return "";
  let match = safe.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  match = safe.match(/drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([^&#]+)/i);
  if (match) return `https://drive.google.com/file/d/${decodeURIComponent(match[1])}/preview`;
  match = safe.match(/(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i);
  if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0`;
  match = safe.match(/player\.vimeo\.com\/video\/(\d+)/i) || safe.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;
  return "";
}

function safeUrl(url) {
  if (!url || typeof url !== "string") return "";
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.href;
  } catch {
    return "";
  }
  return "";
}
