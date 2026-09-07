"use client";

import styled, { keyframes } from "styled-components";
import { useKolkataNow } from "@/hooks/useKolkataNow";
import Clock from "@/components/Clock";
import Timer from "@/components/Timer";
import TopControls from "@/components/TopControls";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
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
    max(3.6rem, calc(env(safe-area-inset-bottom) + 2.6rem))
    max(1.25rem, env(safe-area-inset-left));
  background:
    radial-gradient(ellipse 70% 50% at 50% 18%, var(--accent-soft), transparent 58%),
    var(--bg);
  transition: background-color 0.35s ease;

  @media (max-width: 720px) {
    padding:
      max(0.85rem, env(safe-area-inset-top))
      max(0.75rem, env(safe-area-inset-right))
      max(3.1rem, calc(env(safe-area-inset-bottom) + 2.2rem))
      max(0.75rem, env(safe-area-inset-left));
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, 96vw);
  max-height: 100%;
  margin-top: -1.6rem;
  margin-bottom: 1.4rem;
  animation: ${fadeUp} 0.65s ease both;

  @media (max-width: 720px) {
    width: min(100%, 100vw);
    margin-top: -0.4rem;
    margin-bottom: 0.35rem;
    padding: 0 0.15rem;
  }

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

const Footer = styled.footer`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  padding: 0.7rem 1rem max(1.15rem, env(safe-area-inset-bottom));
  color: var(--text-muted);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-align: center;

  @media (max-width: 720px) {
    padding: 0.5rem 0.75rem max(0.95rem, env(safe-area-inset-bottom));
    font-size: 0.64rem;
  }
`;

const Rule = styled.hr`
  width: min(12rem, 42vw);
  height: 1px;
  margin: 0 auto 0.7rem;
  border: 0;
  background: var(--text-muted);
  opacity: 0.45;
`;

const Credit = styled.a`
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease, opacity 0.2s ease;

  &:hover {
    color: var(--text);
  }
`;

export default function ClockPage() {
  const now = useKolkataNow();

  return (
    <Page>
      <TopControls />
      <Content>
        <ClockBlock aria-label="Indian Standard Time">
          <Clock now={now} />
        </ClockBlock>
      </Content>
      <Timer />
      <Footer>
        <Rule />
        Build By {" "}
        <Credit href="https://umarnazir.vercel.app/" target="_blank" rel="noopener noreferrer">
          Umar Nazir
        </Credit>
      </Footer>
    </Page>
  );
}
