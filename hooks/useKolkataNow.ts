"use client";

import { useEffect, useState } from "react";

export function useKolkataNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const delay = 1000 - (Date.now() % 1000);
    let intervalId = 0;

    const timeoutId = window.setTimeout(() => {
      setNow(new Date());
      intervalId = window.setInterval(() => {
        setNow(new Date());
      }, 1000);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  return now;
}
