export function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

export async function loadGuests() {
  const response = await fetch(new URL("./guests.json", import.meta.url), { cache: "no-store" });
  if (!response.ok) throw new Error("Không tải được danh sách khách mời.");
  const guests = await response.json();
  if (!Array.isArray(guests)) throw new Error("Danh sách khách mời phải là một mảng.");
  return guests.filter(guest => guest && typeof guest.slug === "string" &&
    typeof guest.prefix === "string" && typeof guest.name === "string" &&
    Array.isArray(guest.events));
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
