import { drawIcons, element, loadGuestGroups } from "./shared.js?v=guest-groups";

const status = document.getElementById("link-status");
const tabs = [...document.querySelectorAll(".guest-tabs [role=tab]")];

function selectTab(selected) {
  for (const tab of tabs) {
    const active = tab === selected;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", event => {
    const destinations = {
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    const next = tabs[destinations[event.key]];
    selectTab(next);
    next.focus();
  });
});

try {
  const groups = await loadGuestGroups();
  for (const [key, guests] of Object.entries(groups)) {
    const body = document.getElementById(`guests-${key}`);
    guests.forEach((guest, index) => {
      const url = new URL("./index.html", location.href);
      url.searchParams.set("guest", guest.slug);
      const row = element("tr");
      const number = element("td", String(index + 1), "guest-index");
      const prefix = element("td", guest.prefix);
      const name = element("th", guest.name);
      name.scope = "row";
      const notes = element("td", typeof guest.notes === "string" ? guest.notes : "", "guest-notes");
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
      copy.append(icon, "Copy");
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
      const open = element("a", undefined, "button");
      open.href = url.href;
      open.target = "_blank";
      open.rel = "noopener noreferrer";
      open.setAttribute("aria-label", `Open Link — ${guest.name} (tab mới)`);
      const openIcon = element("i");
      openIcon.dataset.lucide = "external-link";
      openIcon.setAttribute("aria-hidden", "true");
      open.append(openIcon, "Open");
      const actions = element("div", undefined, "actions link-actions");
      actions.append(copy, open);
      name.append(actions);
      link.append(input);
      row.append(number, prefix, name, notes, link);
      body.append(row);
    });
    if (guests.length === 0) {
      const row = element("tr");
      const cell = element("td", "Chưa có khách mời.", "empty-group");
      cell.colSpan = 5;
      row.append(cell);
      body.append(row);
    }
  }
  status.textContent = "";
  void drawIcons();
} catch {
  status.textContent = "Không tải được guests.json. Hãy kiểm tra tệp và mở trang qua HTTP.";
}
