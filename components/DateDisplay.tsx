"use client";

import styled from "styled-components";
import { formatKolkataDate, formatKolkataDateTimeAttribute } from "@/lib/time";

const DateText = styled.p`
  margin: 0.55rem 0.05em 0 0;
  color: var(--text-muted);
  font-size: clamp(0.68rem, 1.35vw, 0.84rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.3;
  text-align: right;

  @media (max-height: 560px) {
    margin-top: 0.35rem;
  }
`;

export default function DateDisplay({ now }: { now: Date }) {
  return (
    <DateText aria-live="off">
      <time dateTime={formatKolkataDateTimeAttribute(now)} suppressHydrationWarning>
        {formatKolkataDate(now)}
      </time>
    </DateText>
  );
}
