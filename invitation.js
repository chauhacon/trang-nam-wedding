import { calendarFilename, localTime } from "./calendar.js";
import { wedding } from "./config.js?v=photo-descriptions";
import { drawIcons, element, loadGuests } from "./shared.js";

const byId = id => document.getElementById(id);
const setText = (id, text) => { byId(id).textContent = text; };
const formatDate = (date, separator) => date.split("-").reverse().join(separator);

function image(photo, eager = false) {
  const img = element("img");
  img.alt = photo.alt;
  img.width = photo.width;
  img.height = photo.height;
  img.style.setProperty("--photo-position", photo.position || "center");
  img.style.setProperty("--photo-position-mobile", photo.mobilePosition || photo.position || "center");
  img.decoding = "async";
  img.loading = eager ? "eager" : "lazy";
  if (eager) img.fetchPriority = "high";
  img.src = photo.src;
  return img;
}

function calendarLink(event, session) {
  const filename = calendarFilename(event, session);
  const link = action("Thêm vào Lịch", "calendar-plus", `./assets/calendars/${filename}`);
  link.download = filename;
  return link;
}

function action(label, icon, href) {
  const link = element("a", undefined, "button");
  const symbol = element("i");
  symbol.dataset.lucide = icon;
  symbol.setAttribute("aria-hidden", "true");
  link.href = href;
  link.append(symbol, label);
  return link;
}

function renderEvent(event) {
  const card = element("article", undefined, "event-card");
  card.id = event.slug;
  const date = element("time", `${event.weekday}, ${formatDate(event.date, "/")}`, "event-date");
  date.dateTime = event.date;
  card.append(element("p", event.city, "eyebrow"), element("h3", event.label), date,
    element("p", `Âm lịch · ${event.lunarDate}`, "event-lunar"));

  for (const session of event.sessions) {
    const start = localTime(event, session);
    const row = element("div", undefined, "event-session");
    const time = element("time", session.time);
    time.dateTime = start;
    const details = element("div");
    details.append(element("h4", session.title), element("p", session.venue));
    if (session.address) details.append(element("p", session.address, "address"));
    const actions = element("div", undefined, "actions");
    if (session.mapsUrl) {
      const map = action("Xem Bản Đồ", "map-pin", session.mapsUrl);
      map.target = "_blank";
      map.rel = "noopener noreferrer";
      actions.append(map);
    }
    actions.append(calendarLink(event, session));
    details.append(actions);
    row.append(time, details);
    card.append(row);
  }
  return card;
}

function startCountdown(events) {
  const times = events.map(event => ({
    label: event.label, iso: localTime(event, event.sessions[0]),
  })).sort((a, b) => Date.parse(a.iso) - Date.parse(b.iso));
  const clock = byId("clock");
  function update() {
    const now = Date.now();
    const target = times.find(time => Date.parse(time.iso) > now);
    if (!target) {
      setText("countdown-event", "Ngày cưới đã đến. Cảm ơn bạn đã chung vui!");
      clock.hidden = true;
      return false;
    }
    if (clock.dataset.target !== target.iso) {
      clock.dataset.target = target.iso;
      setText("countdown-event", `${target.label} · Giờ Việt Nam (UTC+7)`);
    }
    const remaining = Math.ceil((Date.parse(target.iso) - now) / 1000);
    const parts = { days: Math.floor(remaining / 86400), hours: Math.floor(remaining / 3600) % 24,
      minutes: Math.floor(remaining / 60) % 60, seconds: remaining % 60 };
    Object.entries(parts).forEach(([id, value]) => setText(id, String(value).padStart(2, "0")));
    return true;
  }
  if (update()) {
    const timer = setInterval(() => { if (!update()) clearInterval(timer); }, 1000);
  }
}

function renderStory() {
  setText("story-intro", wedding.story);
  for (const photo of wedding.couplePhotos) {
    const figure = element("figure");
    const caption = element("figcaption");
    caption.append(element("span", photo.role, "story-roles"), wedding[photo.person]);
    figure.append(image(photo), caption);
    byId("story-photos").append(figure);
  }
}

function renderGallery() {
  const dialog = byId("lightbox");
  const photos = wedding.galleryImages;
  let selected = 0;
  function show(index) {
    selected = (index + photos.length) % photos.length;
    const photo = photos[selected];
    const full = byId("lightbox-img");
    full.alt = photo.alt;
    full.src = photo.fullSrc || photo.src;
    setText("lightbox-caption", photo.alt);
  }
  photos.forEach((photo, index) => {
    const button = element("button", undefined, photo.wide ? "wide" : undefined);
    button.type = "button";
    button.setAttribute("aria-label", photo.alt ? `Mở ảnh: ${photo.alt}` : `Mở ảnh ${index + 1}`);
    button.append(image(photo));
    button.addEventListener("click", () => {
      show(index);
      dialog.showModal();
    });
    byId("gallery").append(button);
  });
  dialog.querySelector(".lightbox-close").onclick = () => dialog.close();
  dialog.querySelector(".lightbox-prev").onclick = () => show(selected - 1);
  dialog.querySelector(".lightbox-next").onclick = () => show(selected + 1);
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(selected + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
}

function initMotion() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove("waiting");
          observer.unobserve(entry.target);
        }
      }
    });
    document.querySelectorAll("[data-reveal]").forEach(node => {
      if (node.getBoundingClientRect().top > innerHeight) node.classList.add("waiting");
      observer.observe(node);
    });
  }
  if (!matchMedia("(pointer: fine)").matches) return;
  const hero = byId("hero-photo");
  window.addEventListener("scroll", () => {
    if (scrollY < innerHeight) hero.style.setProperty("--parallax", `${Math.min(scrollY * .08, 34)}px`);
  }, { passive: true });
  import("https://cdn.jsdelivr.net/npm/lenis@1.3.17/+esm").then(({ default: Lenis }) => {
    new Lenis({ autoRaf: true, anchors: true });
  }).catch(() => {});
}

async function init() {
  byId("hero-photo").append(image(wedding.heroImage, true));
  setText("groom", wedding.groom);
  setText("bride", wedding.bride);
  setText("invitation-copy", wedding.invitation);
  ["signature", "footer-names"].forEach(id => setText(id, wedding.signature));
  renderStory();
  renderGallery();

  const slug = new URLSearchParams(location.search).get("guest")
    ?.trim()
    .toLowerCase()
    .replace(/[\u2010-\u2015\u2212]/g, "-");
  const guests = slug ? await loadGuests().catch(() => []) : [];
  const guest = guests.find(entry => entry.slug === slug);
  const invited = guest ? wedding.events.filter(event => guest.events.includes(event.slug)) : [];
  const selected = invited.length ? guest : null;
  const events = selected ? invited : wedding.events;
  const greeting = selected || wedding.defaultGreeting;
  setText("guest-prefix", greeting.prefix);
  setText("guest-name", greeting.name);
  setText("hero-date", events.map(event => formatDate(event.date, ".")).join(" & "));
  byId("events").append(...events.map(renderEvent));
  startCountdown(events);
  initMotion();
  void drawIcons();
}

void init();
