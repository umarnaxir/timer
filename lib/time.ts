export const KOLKATA_TIME_ZONE = "Asia/Kolkata";

function kolkataFormatter(locale: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: KOLKATA_TIME_ZONE,
    ...options,
  });
}

function partValue(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

export type KolkataTime = {
  hours: string;
  minutes: string;
  seconds: string;
  period: string;
  text: string;
};

export function formatKolkataTime(
  date: Date,
  hour12 = true,
  showSeconds = true,
): KolkataTime {
  const formatter = hour12
    ? kolkataFormatter("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : kolkataFormatter("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      });
  const parts = formatter.formatToParts(date);
  const hourPart = Number.parseInt(partValue(parts, "hour"), 10);
  const safeHour = Number.isFinite(hourPart) ? hourPart : 0;
  const hours = String(hour12 ? (safeHour % 12 === 0 ? 12 : safeHour % 12) : safeHour).padStart(
    2,
    "0",
  );
  const minutes = partValue(parts, "minute").padStart(2, "0");
  const seconds = partValue(parts, "second").padStart(2, "0");
  const period = hour12
    ? partValue(parts, "dayPeriod").replace(/\./g, "").toUpperCase()
    : "";
  const clock = showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;

  return {
    hours,
    minutes,
    seconds,
    period,
    text: period ? `${clock} ${period}` : clock,
  };
}

export function formatKolkataDate(date: Date) {
  return kolkataFormatter("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatKolkataDateTimeAttribute(date: Date) {
  return kolkataFormatter("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
    .format(date)
    .replace(" ", "T");
}

export function formatDuration(totalSeconds: number) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}
