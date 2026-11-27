import { calendarFilename, localTime } from "./calendar.js";
import { wedding } from "./config.js?v=rsvp";
import { drawIcons, element, loadGuests } from "./shared.js?v=guest-groups";

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
  const section = byId("countdown-clocks");
  const units = [["Ngày", 86400], ["Giờ", 3600], ["Phút", 60], ["Giây", 1]];
  const clocks = events.map(event => {
    const group = element("div", undefined, "countdown-clock");
    if (events.length > 1) group.append(element("h3", event.label, "countdown-label"));
    const clock = element("div", undefined, "clock");
    const values = units.map(([label]) => {
      const cell = element("div");
      const value = element("span", "00");
      cell.append(value, label);
      clock.append(cell);
      return value;
    });
    const done = element("p", "Ngày cưới đã đến. Cảm ơn bạn đã chung vui!", "countdown-done");
    done.hidden = true;
    group.append(clock, done);
    section.append(group);
    return { clock, done, values, target: Date.parse(localTime(event, event.sessions[0])) };
  });

  function update() {
    const now = Date.now();
    let hasUpcoming = false;
    for (const { clock, done, values, target } of clocks) {
      const finished = now >= target;
      clock.hidden = finished;
      done.hidden = !finished;
      if (finished) continue;
      hasUpcoming = true;
      let remaining = Math.ceil((target - now) / 1000);
      units.forEach(([, size], index) => {
        values[index].textContent = String(Math.floor(remaining / size)).padStart(2, "0");
        remaining %= size;
      });
    }
    return hasUpcoming;
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
  if (selected) {
    const rsvp = new URL(wedding.rsvp.url);
    rsvp.searchParams.set("usp", "pp_url");
    rsvp.searchParams.set(wedding.rsvp.nameField, selected.name);
    byId("rsvp-link").href = rsvp.href;
    const headerRsvp = byId("header-rsvp-link");
    headerRsvp.href = rsvp.href;
    headerRsvp.hidden = false;
    byId("rsvp-action").hidden = false;
  }
  startCountdown(events);
  initMotion();
  void drawIcons();
}

void init();
