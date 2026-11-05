import Holidays from "date-holidays";
import { addDays } from "@/lib/calendar-date-utils";
import { HOLIDAYS_CALENDAR_ID, HOLIDAYS_CALENDAR_NAME } from "@/lib/calendar-constants";
import type { CalendarTask } from "@/lib/actions/calendar";

/**
 * Countries on the International Calendar. "EU" is the five main Amazon EU marketplaces. Holiday rules
 * come from the `date-holidays` package (offline, no API), so bump it now and then to pick up
 * newly announced dates. Lunar and Islamic dates are calculated and can be a day off from the
 * official announcement.
 */
const HOLIDAY_COUNTRIES: { code: string; name: string }[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SG", name: "Singapore" },
  { code: "CN", name: "China" },
  { code: "PH", name: "Philippines" },
  { code: "MY", name: "Malaysia" },
];

/**
 * Days the package marks "public" that are not a day off for everyone, only for some groups
 * (e.g. China's Women's Day is a half day for women).
 */
const EXCLUDED: Record<string, string[]> = {
  CN: ["International Women's Day", "Youth Day", "Children's Day", "Army Day"],
};

const HOLIDAY_COLOR = "red";

let instances: { code: string; name: string; hd: Holidays }[] | null = null;
function getInstances() {
  instances ??= HOLIDAY_COUNTRIES.map((c) => ({ ...c, hd: new Holidays(c.code, { languages: ["en"] }) }));
  return instances;
}

/**
 * Public holidays between two "YYYY-MM-DD" dates (inclusive) as read-only calendar tasks. A holiday
 * several countries share on the same day is one entry listing them all, and consecutive days with the
 * same name and countries (e.g. Spring Festival) become one multi-day entry.
 */
export function getHolidayTasks(startDate: string, endDate: string): CalendarTask[] {
  // (date, holiday name) -> countries that observe it.
  const byDay = new Map<string, { date: string; name: string; countries: { code: string; name: string }[] }>();
  const firstYear = Number(startDate.slice(0, 4));
  const lastYear = Number(endDate.slice(0, 4));

  for (const { code, name: countryName, hd } of getInstances()) {
    for (let year = firstYear; year <= lastYear; year++) {
      for (const h of hd.getHolidays(year, "en")) {
        if (h.type !== "public") continue;
        if (EXCLUDED[code]?.includes(h.name)) continue;
        const date = h.date.slice(0, 10);
        if (date < startDate || date > endDate) continue;
        const key = `${date}|${h.name}`;
        const entry = byDay.get(key) ?? { date, name: h.name, countries: [] };
        if (!entry.countries.some((c) => c.code === code)) entry.countries.push({ code, name: countryName });
        byDay.set(key, entry);
      }
    }
  }

  // Merge runs of consecutive days with the same holiday name and the same set of countries.
  const days = Array.from(byDay.values()).map((d) => ({ ...d, group: `${d.name}|${d.countries.map((c) => c.code).join(",")}` }));
  days.sort((a, b) => a.group.localeCompare(b.group) || a.date.localeCompare(b.date));
  const runs: { start: string; end: string; name: string; countries: { code: string; name: string }[] }[] = [];
  for (const d of days) {
    const last = runs[runs.length - 1];
    if (last && `${last.name}|${last.countries.map((c) => c.code).join(",")}` === d.group && addDays(last.end, 1) === d.date) {
      last.end = d.date;
    } else {
      runs.push({ start: d.date, end: d.date, name: d.name, countries: d.countries });
    }
  }

  return runs
    .map((r) => ({
      id: `holiday:${r.start}:${r.countries.map((c) => c.code).join("-")}:${r.name}`,
      calendarId: HOLIDAYS_CALENDAR_ID,
      calendarName: HOLIDAYS_CALENDAR_NAME,
      title: `${r.name} (${r.countries.map((c) => c.code).join(", ")})`,
      notes: `Public holiday in ${r.countries.map((c) => c.name).join(", ")}.`,
      eventDate: r.start,
      dueDate: r.end === r.start ? null : r.end,
      color: HOLIDAY_COLOR,
      createdBy: "",
      assignees: [],
      sharedWith: [],
      createdAt: "",
      repeat: null,
      startTime: null,
      endTime: null,
    }))
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate) || a.title.localeCompare(b.title));
}
