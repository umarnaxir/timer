"use client";

import styled from "styled-components";
import {
  formatKolkataDateTimeAttribute,
  formatKolkataTime,
} from "@/lib/time";
import DateDisplay from "@/components/DateDisplay";
import SmoothSeconds from "@/components/SmoothSeconds";

type ClockProps = {
  now: Date;
};

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: fit-content;
  max-width: 100%;
`;

const TimeRow = styled.time`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 0;
  color: var(--text);
  font-family: var(--font-clock), Diplomata, serif;
  font-size: clamp(2.15rem, 9.2vw, 6.4rem);
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
  line-height: 1.15;
  text-shadow: 0 0 56px var(--glow);
  white-space: nowrap;

  @media (max-height: 560px) {
    font-size: clamp(1.7rem, 7.2vw, 3.6rem);
  }

  @media (max-width: 380px) {
    font-size: clamp(1.55rem, 8.4vw, 2.4rem);
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
  font-size: 0.2em;
  font-weight: 600;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;

  @media (max-width: 380px) {
    margin-bottom: 0.14em;
    font-size: 0.22em;
  }
`;

export default function Clock({ now }: ClockProps) {
  const time = formatKolkataTime(now);
  const dateTime = formatKolkataDateTimeAttribute(now);

  return (
    <Stack>
      <TimeRow
        dateTime={dateTime}
        aria-label={`Current time, ${time.text}`}
        suppressHydrationWarning
      >
        <Unit suppressHydrationWarning>{time.hours}</Unit>
        <Colon aria-hidden="true">:</Colon>
        <Unit suppressHydrationWarning>{time.minutes}</Unit>
        <Colon aria-hidden="true">:</Colon>
        <SmoothSeconds value={time.seconds} />
        <Period suppressHydrationWarning>{time.period}</Period>
      </TimeRow>
      <DateDisplay now={now} />
    </Stack>
  );
}
