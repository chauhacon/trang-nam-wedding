import { mkdir, writeFile } from "node:fs/promises";
import { wedding } from "../config.js";
import { calendarFilename, localTime } from "../calendar.js";

function calendarText(event, session, signature) {
  const start = localTime(event, session);
  const timestamp = date => new Date(date).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const escape = value => value.replace(/[\\,;]/g, "\\$&").replace(/\r\n?|\n/g, "\\n");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Hai Nam and Ha Trang//Wedding Invitation//VI",
    "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${event.slug}-${timestamp(start)}@trang-nam-wedding`,
    `DTSTAMP:${timestamp(Date.now())}`, `DTSTART:${timestamp(start)}`,
    `SUMMARY:${escape(`${session.title} · ${signature}`)}`,
    `LOCATION:${escape([session.venue, session.address].filter(Boolean).join(", "))}`,
    "END:VEVENT", "END:VCALENDAR",
  ];
  const encoder = new TextEncoder();
  const folded = lines.map(line => {
    let bytes = 0;
    let result = "";
    for (const char of line) {
      const length = encoder.encode(char).length;
      if (bytes + length > 75) {
        result += "\r\n ";
        bytes = 1;
      }
      result += char;
      bytes += length;
    }
    return result;
  });
  return folded.join("\r\n") + "\r\n";
}

const directory = new URL("../assets/calendars/", import.meta.url);
await mkdir(directory, { recursive: true });
for (const event of wedding.events) {
  for (const session of event.sessions) {
    const file = new URL(calendarFilename(event, session), directory);
    await writeFile(file, calendarText(event, session, wedding.signature));
  }
}
