import { KOLKATA_TIME_ZONE } from "@/lib/time";

const QUOTES = [
  "A better you is built in quiet hours, not in rushed ones. Stay with this moment and let the work deepen.",
  "Slow is smooth, and smooth is fast. Give the next hour your full attention and the rest of the day will follow.",
  "One focused hour can change the shape of a day. Protect this time as if it were the most valuable thing you own.",
  "Stay with the work in front of you. Progress is rarely loud; it is the calm decision to begin again.",
  "Quiet time is still progress. Stillness, patience, and a clear mind will take you further than hurry ever could.",
  "Begin again without hurry. The clock is not your enemy; it is a reminder that this hour belongs to you.",
  "Small steps still move the clock. Do the next right thing, then the one after that, and trust the accumulation.",
  "Protect your attention. In a noisy world, the person who can stay present for one full hour already has an advantage.",
  "Done is built one minute at a time. You do not need the whole day figured out — only the next honest stretch of work.",
  "Presence is the real luxury. Put the noise aside, keep your hands on the task, and let this hour be enough.",
  "Make the next hour count. Not by doing more, but by doing what matters with a quieter, steadier mind.",
  "Stillness is a kind of strength. Breathe, return to the work, and let consistency finish what motivation started.",
  "You do not need a perfect plan to start. You need a clear desk, a chosen hour, and the courage to stay with it.",
  "Great days are assembled from ordinary minutes. Treat this one as if it were the foundation of everything after it.",
  "Focus is a kindness you give your future self. Stay here a little longer; the work will meet you halfway.",
  "The day becomes lighter when you stop chasing it. Choose one task, give it your hour, and let the rest wait.",
  "Discipline is just devotion, repeated. Return to the work with patience, and the clock will reward your steadiness.",
  "There is time enough for what matters if you stop giving the rest of it away. This hour is yours — use it well.",
];

export function getDailyQuote(date: Date) {
  const key = new Intl.DateTimeFormat("en-CA", {
    timeZone: KOLKATA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  const index = key.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return QUOTES[index % QUOTES.length];
}
