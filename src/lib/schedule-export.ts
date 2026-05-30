// Client-side helpers to export the generated weekly schedule.

const DAY_INDEX: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
};

export interface ScheduleRow {
  day: string;
  timeBlock: string;
  category: string;
  task: string;
  notes: string;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

export function parseScheduleRows(html: string): ScheduleRow[] {
  // Grab the first <table>...</table> — that's the Prioritized Weekly Schedule
  const tableMatch = html.match(/<table[\s\S]*?<\/table>/i);
  if (!tableMatch) return [];
  const table = tableMatch[0];

  const rows: ScheduleRow[] = [];
  const rowRe = /<tr[\s\S]*?<\/tr>/gi;
  const trs = table.match(rowRe) ?? [];
  for (const tr of trs) {
    // Skip header rows (rows that only contain <th>)
    if (/<th[\s>]/i.test(tr) && !/<td[\s>]/i.test(tr)) continue;
    const cellRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = cellRe.exec(tr)) !== null) cells.push(stripTags(m[1]));
    if (cells.length < 4) continue;
    rows.push({
      day: cells[0] ?? "",
      timeBlock: cells[1] ?? "",
      category: cells[2] ?? "",
      task: cells[3] ?? "",
      notes: cells[4] ?? "",
    });
  }
  return rows;
}

function parseTimeBlock(block: string): { startH: number; startM: number; endH: number; endM: number } | null {
  // Accept "9:00 – 11:00", "9:00 - 11:00", "09:00–11:00", "9:00 AM - 11:00 AM"
  const cleaned = block.replace(/\s+/g, " ").trim();
  const re = /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*[–\-—~to]+\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i;
  const m = cleaned.match(re);
  if (!m) return null;
  const to24 = (h: number, ap?: string) => {
    if (!ap) return h;
    const u = ap.toUpperCase();
    if (u === "AM") return h === 12 ? 0 : h;
    return h === 12 ? 12 : h + 12;
  };
  const startH = to24(parseInt(m[1], 10), m[3]);
  const startM = m[2] ? parseInt(m[2], 10) : 0;
  const endH = to24(parseInt(m[4], 10), m[6]);
  const endM = m[5] ? parseInt(m[5], 10) : 0;
  return { startH, startM, endH, endM };
}

function getMondayOfThisWeek(today = new Date()): Date {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dow = d.getDay(); // 0=Sun..6=Sat
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return d;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function fmtLocal(d: Date, h: number, m: number): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(h)}${pad(m)}00`;
}

function fmtStamp(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours(),
  )}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function escIcs(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcsFromScheduleHtml(html: string): string {
  const rows = parseScheduleRows(html);
  const monday = getMondayOfThisWeek();
  const stamp = fmtStamp(new Date());

  const events: string[] = [];
  rows.forEach((row, i) => {
    const dayKey = row.day.trim().toLowerCase();
    const dayIdx = DAY_INDEX[dayKey];
    if (dayIdx === undefined) return;
    const t = parseTimeBlock(row.timeBlock);
    if (!t) return;
    const date = new Date(monday);
    date.setDate(monday.getDate() + dayIdx);

    const summary = row.task || row.category || "Scheduled task";
    const descParts = [
      row.category ? `Priority: ${row.category}` : "",
      row.notes ? `Notes: ${row.notes}` : "",
    ].filter(Boolean);

    events.push(
      [
        "BEGIN:VEVENT",
        `UID:careermate-${date.getTime()}-${i}@careermate.ai`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${fmtLocal(date, t.startH, t.startM)}`,
        `DTEND:${fmtLocal(date, t.endH, t.endM)}`,
        `SUMMARY:${escIcs(summary)}`,
        descParts.length ? `DESCRIPTION:${escIcs(descParts.join(" | "))}` : "",
        row.category ? `CATEGORIES:${escIcs(row.category)}` : "",
        "END:VEVENT",
      ]
        .filter(Boolean)
        .join("\r\n"),
    );
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CareerMate AI//Weekly Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadScheduleIcs(html: string, filename = "CareerMate_Schedule.ics"): number {
  const ics = buildIcsFromScheduleHtml(html);
  const eventCount = (ics.match(/BEGIN:VEVENT/g) ?? []).length;
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return eventCount;
}

export function printElementById(id: string): void {
  const root = document.documentElement;
  root.setAttribute("data-print-target", id);
  const cleanup = () => {
    root.removeAttribute("data-print-target");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  // Give the browser a tick to apply the attribute before opening the dialog
  setTimeout(() => window.print(), 50);
}
