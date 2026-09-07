import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const ogSize = {
  width: 1200,
  height: 630,
};

export const ogAlt = `${SITE_NAME} — full-screen clock and countdown timer`;

export async function createOgImage() {
  const diplomata = await readFile(
    join(process.cwd(), "assets/fonts/Diplomata-Regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090c",
          color: "#f4f0e6",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "70%",
            height: "42%",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(212,179,127,0.18), transparent 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            fontFamily: "Diplomata",
            fontSize: 88,
            fontWeight: 400,
            letterSpacing: 2,
            lineHeight: 0.9,
          }}
        >
          02:15:42
          <span
            style={{
              marginLeft: 18,
              marginBottom: 18,
              fontFamily: "sans-serif",
              fontSize: 36,
              letterSpacing: 6,
              color: "#8d887c",
            }}
          >
            AM
          </span>
        </div>
        <div
          style={{
            marginTop: 28,
            color: "#8d887c",
            fontSize: 22,
            letterSpacing: 1,
          }}
        >
          Tuesday, September 8, 2026
        </div>
        <div
          style={{
            width: 88,
            height: 1,
            marginTop: 36,
            background: "rgba(244,240,230,0.16)",
          }}
        />
        <div
          style={{
            marginTop: 28,
            color: "#d4b37f",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            maxWidth: 720,
            marginTop: 12,
            color: "#8d887c",
            fontSize: 20,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        {
          name: "Diplomata",
          data: diplomata,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
