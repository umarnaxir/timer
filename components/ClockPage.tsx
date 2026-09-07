"use client";

import styled, { keyframes } from "styled-components";
import { useKolkataNow } from "@/hooks/useKolkataNow";
import Clock from "@/components/Clock";
import Timer from "@/components/Timer";
import ThemeToggle from "@/components/ThemeToggle";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Page = styled.main`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;
  padding:
    max(1.25rem, env(safe-area-inset-top))
    max(1.25rem, env(safe-area-inset-right))
    max(1.25rem, env(safe-area-inset-bottom))
    max(1.25rem, env(safe-area-inset-left));
  background:
    radial-gradient(ellipse 70% 50% at 50% 18%, var(--accent-soft), transparent 58%),
    var(--bg);
  transition: background-color 0.35s ease;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, 56rem);
  max-height: 100%;
  animation: ${fadeUp} 0.7s ease both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ClockBlock = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
`;

export default function ClockPage() {
  const now = useKolkataNow();

  return (
    <Page>
      <ThemeToggle />
      <Content>
        <ClockBlock aria-label="Current time">
          <Clock now={now} />
        </ClockBlock>
      </Content>
      <Timer />
    </Page>
  );
}
