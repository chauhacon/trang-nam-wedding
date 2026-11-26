import { wedding } from "./config.js";
import { drawIcons, element, loadGuests } from "./shared.js";

const table = document.getElementById("guest-links");
const status = document.getElementById("link-status");

try {
  const guests = await loadGuests();
  for (const [index, guest] of guests.entries()) {
    const events = wedding.events.filter(event => guest.events.includes(event.slug));
    const url = new URL("./index.html", location.href);
    url.searchParams.set("guest", guest.slug);
    const row = element("tr");
    const number = element("td", String(index + 1));
    const name = element("th", `${guest.prefix} ${guest.name}`);
    name.scope = "row";
    const invitation = element("td", events.length === 2 ? "Cả Hai" : events[0]?.label || "Chưa chọn sự kiện");
    const link = element("td");
    const input = element("input");
    input.value = url.href;
    input.readOnly = true;
    input.setAttribute("aria-label", `Liên kết của ${guest.name}`);
    const copy = element("button", undefined, "button");
    copy.type = "button";
    copy.setAttribute("aria-label", `Copy Link — ${guest.name}`);
    const icon = element("i");
    icon.dataset.lucide = "copy";
    icon.setAttribute("aria-hidden", "true");
    copy.append(icon, "Copy Link");
    copy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(input.value);
        status.textContent = `Đã sao chép liên kết của ${guest.name}.`;
      } catch {
        input.focus();
        input.select();
        input.setSelectionRange(0, input.value.length);
        status.textContent = document.execCommand?.("copy")
          ? `Đã sao chép liên kết của ${guest.name}.`
          : "Liên kết đã được chọn. Hãy sao chép bằng menu của thiết bị.";
      }
    };
    const open = element("a", "Open Link", "button");
    open.href = url.href;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.setAttribute("aria-label", `Open Link — ${guest.name} (tab mới)`);
    const actions = element("div", undefined, "actions link-actions");
    actions.append(copy, open);
    link.append(input, actions);
    row.append(number, name, invitation, link);
    table.append(row);
  }
  status.textContent = guests.length ? "" : "Danh sách khách mời đang trống.";
  void drawIcons();
} catch {
  status.textContent = "Không tải được guests.json. Hãy kiểm tra tệp và mở trang qua HTTP.";
}
