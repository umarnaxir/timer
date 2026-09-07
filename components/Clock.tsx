"use client";

import styled from "styled-components";
import {
  formatKolkataDateTimeAttribute,
  formatKolkataTime,
} from "@/lib/time";
import { getDailyQuote } from "@/lib/quotes";
import { usePreferences } from "@/components/PreferencesProvider";
import DateDisplay from "@/components/DateDisplay";
import SmoothSeconds from "@/components/SmoothSeconds";

type ClockProps = {
  now: Date;
};

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: fit-content;
  max-width: 100%;
`;

const TimeRow = styled.time<{ $showSeconds: boolean }>`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  max-width: 100%;
  margin: 0;
  color: var(--text);
  font-family: var(--font-clock), Diplomata, serif;
  font-size: ${({ $showSeconds }) =>
    $showSeconds ? "clamp(1.7rem, 6.6vw, 5.8rem)" : "clamp(2.6rem, 11.5vw, 8.4rem)"};
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
  line-height: 1.15;
  text-shadow: 0 0 48px var(--glow);
  white-space: nowrap;

  @media (max-height: 560px) {
    font-size: ${({ $showSeconds }) =>
      $showSeconds ? "clamp(1.45rem, 5.6vw, 3.6rem)" : "clamp(2rem, 8.4vw, 5rem)"};
  }

  @media (max-width: 420px) {
    font-size: ${({ $showSeconds }) =>
      $showSeconds ? "clamp(1.25rem, 5.8vw, 2.1rem)" : "clamp(1.8rem, 10vw, 3.2rem)"};
  }
`;

const Unit = styled.span`
  display: inline-block;
`;

const Colon = styled.span`
  display: inline-block;
  margin: 0 0.02em;
  color: var(--accent);
  opacity: 0.62;
`;

const Period = styled.span`
  margin: 0 0 0.18em 0.28em;
  font-family: var(--font-sans), "Segoe UI", sans-serif;
  color: var(--text-muted);
  font-size: 0.22em;
  font-weight: 600;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
`;

const Quote = styled.p`
  max-width: min(36rem, 88vw);
  margin: 0.95rem auto 0;
  color: var(--text-muted);
  font-size: clamp(0.86rem, 1.55vw, 1.05rem);
  font-style: italic;
  letter-spacing: 0.02em;
  line-height: 1.55;
  text-align: center;
`;

const Zone = styled.p`
  margin: 0.55rem 0 0;
  color: var(--accent);
  font-size: clamp(0.62rem, 1.1vw, 0.72rem);
  font-weight: 500;
  letter-spacing: 0.16em;
  text-align: center;
  text-transform: uppercase;
`;

export default function Clock({ now }: ClockProps) {
  const { preferences } = usePreferences();
  const hour12 = preferences.hourFormat === "12";
  const showSeconds = preferences.showSeconds;
  const time = formatKolkataTime(now, hour12, showSeconds);
  const dateTime = formatKolkataDateTimeAttribute(now);

  return (
    <Stack>
      <TimeRow
        $showSeconds={showSeconds}
        dateTime={dateTime}
        aria-label={`Current time, ${time.text} India Standard Time`}
        suppressHydrationWarning
      >
        <Unit suppressHydrationWarning>{time.hours}</Unit>
        <Colon aria-hidden="true">:</Colon>
        <Unit suppressHydrationWarning>{time.minutes}</Unit>
        {showSeconds ? (
          <>
            <Colon aria-hidden="true">:</Colon>
            <SmoothSeconds value={time.seconds} />
          </>
        ) : null}
        {time.period ? <Period suppressHydrationWarning>{time.period}</Period> : null}
      </TimeRow>
      {preferences.showDate ? <DateDisplay now={now} /> : null}
      {preferences.showQuote ? (
        <Quote suppressHydrationWarning>{getDailyQuote(now)}</Quote>
      ) : null}
      {preferences.showTimezone ? <Zone>Kolkata, India (IST)</Zone> : null}
    </Stack>
  );
}
