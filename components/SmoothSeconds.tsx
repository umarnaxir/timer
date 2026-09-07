"use client";

import { useState } from "react";
import styled, { keyframes } from "styled-components";

const Frame = styled.span`
  position: relative;
  display: inline-block;
  overflow: hidden;
  width: 2.8em;
  min-width: 2.8em;
  height: 1.2em;
  vertical-align: baseline;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(42%);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
  to {
    opacity: 0;
    transform: translateY(-42%);
    filter: blur(4px);
  }
`;

const Incoming = styled.span`
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  animation: ${slideIn} 520ms cubic-bezier(0.16, 1, 0.3, 1);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Outgoing = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 100%;
  animation: ${slideOut} 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

export default function SmoothSeconds({ value }: { value: string }) {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(value);
  const [version, setVersion] = useState(0);

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
    setVersion((count) => count + 1);
  }

  return (
    <Frame data-clock="seconds" aria-hidden="true">
      {previous !== current ? (
        <Outgoing key={`out-${version}`}>{previous}</Outgoing>
      ) : null}
      <Incoming key={`in-${version}`} suppressHydrationWarning>
        {current}
      </Incoming>
    </Frame>
  );
}
