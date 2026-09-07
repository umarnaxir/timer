import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const ogSize = {
  width: 1200,
  height: 1200,
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
            top: 80,
            width: "78%",
            height: "38%",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(212,179,127,0.2), transparent 72%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            fontFamily: "Diplomata",
            fontSize: 84,
            fontWeight: 400,
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          02:15:42
          <span
            style={{
              marginLeft: 16,
              marginBottom: 12,
              fontFamily: "sans-serif",
              fontSize: 32,
              letterSpacing: 5,
              color: "#8d887c",
            }}
          >
            AM
          </span>
        </div>
        <div
          style={{
            marginTop: 24,
            color: "#8d887c",
            fontSize: 24,
            letterSpacing: 1,
          }}
        >
          Tuesday, September 8, 2026
        </div>
        <div
          style={{
            width: 96,
            height: 1,
            marginTop: 48,
            background: "rgba(244,240,230,0.16)",
          }}
        />
        <div
          style={{
            marginTop: 36,
            color: "#d4b37f",
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            maxWidth: 760,
            marginTop: 16,
            color: "#8d887c",
            fontSize: 26,
            textAlign: "center",
            lineHeight: 1.45,
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
