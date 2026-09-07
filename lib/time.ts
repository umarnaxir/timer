export const KOLKATA_TIME_ZONE = "Asia/Kolkata";

const time12Formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: KOLKATA_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

const time24Formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: KOLKATA_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
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

export function formatKolkataTime(
  date: Date,
  hour12 = true,
  showSeconds = true,
): KolkataTime {
  const parts = (hour12 ? time12Formatter : time24Formatter).formatToParts(date);
  const hours = partValue(parts, "hour").padStart(2, "0");
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
