"use client";

import { useEffect, useState } from "react";

export function useKolkataNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();

    const delay = 1000 - (Date.now() % 1000);
    let intervalId = 0;
    const timeoutId = window.setTimeout(() => {
      tick();
      intervalId = window.setInterval(tick, 1000);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  return now;
}
