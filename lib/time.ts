export const KOLKATA_TIME_ZONE = "Asia/Kolkata";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: KOLKATA_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: KOLKATA_TIME_ZONE,
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: KOLKATA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

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

export function formatKolkataTime(date: Date): KolkataTime {
  const parts = timeFormatter.formatToParts(date);
  const hours = partValue(parts, "hour").padStart(2, "0");
  const minutes = partValue(parts, "minute").padStart(2, "0");
  const seconds = partValue(parts, "second").padStart(2, "0");
  const period = partValue(parts, "dayPeriod").replace(/\./g, "").toUpperCase();

  return {
    hours,
    minutes,
    seconds,
    period,
    text: `${hours}:${minutes}:${seconds} ${period}`,
  };
}

export function formatKolkataDate(date: Date) {
  return dateFormatter.format(date);
}

export function formatKolkataDateTimeAttribute(date: Date) {
  return dateTimeFormatter.format(date).replace(" ", "T");
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
