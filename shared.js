export function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

export async function loadGuestGroups() {
  const response = await fetch(new URL("./guests.json", import.meta.url), { cache: "no-store" });
  if (!response.ok) throw new Error("Không tải được danh sách khách mời.");
  const groups = await response.json();
  return Object.fromEntries(["testing", "bride", "groom"].map(key => {
    const guests = groups?.[key];
    if (!Array.isArray(guests)) throw new Error(`Danh sách ${key} phải là một mảng.`);
    return [key, guests.filter(guest => guest && typeof guest.slug === "string" &&
      typeof guest.prefix === "string" && typeof guest.name === "string" &&
      Array.isArray(guest.events))];
  }));
}

export async function loadGuests() {
  return Object.values(await loadGuestGroups()).flat();
}

let iconScript;

export async function drawIcons() {
  iconScript ??= new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/lucide@0.468.0/dist/umd/lucide.min.js";
    script.onload = script.onerror = resolve;
    document.head.append(script);
  });
  await iconScript;
  globalThis.lucide?.createIcons();
}
