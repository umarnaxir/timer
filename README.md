# Full-Screen Real-Time Clock & Timer

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![styled-components](https://img.shields.io/badge/styled--components-6-DB7093?style=flat-square&logo=styledcomponents&logoColor=white)](https://styled-components.com)

A fullscreen **real-time Kolkata clock** and **countdown timer** for laptops, desktops, tablets, and large displays.

I originally built this project for my own personal use — mainly to keep a large, real-time clock and timer visible on my screen. However, it's completely open for anyone who finds it useful. Feel free to use it, customize it, or build upon it.

**Live Demo:** [https://timerdv.vercel.app](https://timerdv.vercel.app)  
**Repository:** [github.com/umarnaxir/timer](https://github.com/umarnaxir/timer)

The app shows:

- Real-time India / Kolkata time (`Asia/Kolkata`)
- Current date
- Countdown timer with Start / Pause / Resume / Reset
- Dark and light mode
- A responsive, full-screen interface
- Smooth, subtle animations

---

## Table of Contents

- [Live Demo](#live-demo)
- [Preview](#preview)
- [Features](#features)
- [Why This Project Exists](#why-this-project-exists)
- [Tech Stack](#tech-stack)
- [Packages & Dependencies](#packages--dependencies)
- [Project Structure](#project-structure)
- [Components](#components)
- [APIs & Browser APIs](#apis--browser-apis)
- [Timezone](#timezone)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Development](#development)
- [Production Build](#production-build)
- [Deployment](#deployment)
- [How to Use](#how-to-use)
- [Browser Compatibility](#browser-compatibility)
- [Performance & Design Philosophy](#performance--design-philosophy)
- [Author](#author)
- [Open for Everyone](#open-for-everyone)
- [License](#license)

---

## Live Demo

| Environment | URL |
| ----------- | --- |
| **Production** | [https://timerdv.vercel.app](https://timerdv.vercel.app) |

The production URL is the project's canonical site URL (`lib/site.ts`). A preview or local environment is not configured separately.

---

## Preview

<p align="center">
  <img src="public/image.png" alt="Timer — Focus, Do, Repeat" width="420">
</p>

The image above is the project's artwork and Open Graph / social preview (`public/image.png`). Interface screenshots can be added here later.

---

## Features

### Real-Time Kolkata Clock

- Displays the current time using `Asia/Kolkata`.
- Updates automatically every second.
- Works independently of the visitor's local timezone.
- Supports 12-hour and 24-hour formats.
- Seconds can be shown or hidden; when shown, they use a short slide animation.

### Date

- Displays the current date in Indian Standard Time.
- Stays in sync with the same Kolkata timezone as the clock.

### Countdown Timer

- Set a custom duration (hours, minutes, and seconds).
- Start, pause, resume, and reset.
- Automatically stops when it reaches zero.
- Optional focus mode for a large, centered countdown.
- Can collapse into a compact launcher in the corner.
- Optional completion sounds (bell, beep, digital, or soft chime).
- Keyboard shortcuts: <kbd>Space</kbd> start / pause / resume, <kbd>R</kbd> reset, <kbd>F</kbd> focus mode, <kbd>Esc</kbd> exit focus.

### Theme Support

- Dark mode and light mode.
- Preference is stored in `localStorage` (`clock-theme`).
- If no preference is stored, the app follows the system color scheme.
- A small inline script applies the theme before paint to avoid a flash of the wrong theme.

### Display Preferences

- Toggle the daily quote, date, timezone label, and seconds.
- Preferences persist in `localStorage` (`timer-preferences`).

### Responsive Design

The layout is built for a full-screen experience across:

- Mobile phones (iPhone and Android)
- Tablets and iPads
- Laptops and desktop monitors
- Large displays
- Different screen sizes and resolutions, including safe-area insets

### UI / UX

- Minimal, distraction-free interface
- Modern typography (Geist for UI, Diplomata for the clock digits)
- Smooth, restrained animations
- Accessible controls and labels
- Clean visual hierarchy
- Full-screen clock as the primary view

---

## Why This Project Exists

This was never meant to be a commercial product. I wanted a large, easy-to-read clock on my screen — something I could leave open on a laptop, a spare monitor, or a tablet while working or studying — plus a simple timer that did not get in the way.

The result is a single-page utility: the time stays visible, the timer is available when you need it, and the rest of the interface stays quiet.

It can also be useful if you want:

- A fullscreen clock
- A simple countdown timer
- A desk or workspace display
- A study or work timer
- A large-screen clock
- A distraction-free time display

---

## Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| [Next.js](https://nextjs.org) 16 (App Router) | Application framework, routing, metadata, and fonts |
| [React](https://react.dev) 19 | UI |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [styled-components](https://styled-components.com) | Component-based styling |
| `Intl.DateTimeFormat` | Timezone-aware time and date formatting |
| `Date`, `setTimeout`, `setInterval` | Client-side clock updates |
| `localStorage` | Theme and preference persistence |
| Web Audio API | Timer completion sounds |

Fonts are loaded with `next/font`: **Geist**, **Geist Mono**, and **Diplomata**.

---

## Packages & Dependencies

The project uses **npm** (`package-lock.json`).

### Core

| Package | Purpose |
| ------- | ------- |
| `next` | Next.js framework |
| `react` | UI library |
| `react-dom` | React DOM renderer |
| `styled-components` | CSS-in-JS styling |

`next.config.ts` enables the styled-components SWC compiler (`compiler.styledComponents`).

### Development

| Package | Purpose |
| ------- | ------- |
| `typescript` | Type checking |
| `eslint` | Linting |
| `eslint-config-next` | Next.js ESLint rules |
| `@types/node` | Node.js type definitions |
| `@types/react` | React type definitions |
| `@types/react-dom` | React DOM type definitions |

There is no database, auth, or HTTP client dependency. The runtime stack is intentionally small.

---

## Project Structure

```text
timer/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata, providers
│   ├── page.tsx                # Home page (renders ClockPage)
│   ├── globals.css             # Minimal global CSS
│   ├── robots.ts               # robots.txt
│   ├── sitemap.ts              # sitemap.xml
│   ├── favicon.ico
│   ├── opengraph-image.png
│   └── twitter-image.png
├── components/
│   ├── ClockPage.tsx           # Full-screen page layout
│   ├── Clock.tsx               # Live Kolkata clock
│   ├── DateDisplay.tsx         # Kolkata date
│   ├── Timer.tsx               # Countdown timer, focus mode, shortcuts
│   ├── TopControls.tsx         # Sound, theme, and settings
│   ├── ThemeProvider.tsx       # Theme state
│   ├── ThemeToggle.tsx         # Standalone theme button
│   ├── PreferencesProvider.tsx # Preference state
│   ├── SmoothSeconds.tsx       # Seconds digit animation
│   └── GlobalStyles.tsx        # Theme tokens and global styles
├── hooks/
│   └── useKolkataNow.ts        # 1-second Kolkata clock tick
├── lib/
│   ├── time.ts                 # Asia/Kolkata formatters
│   ├── theme.ts                # Theme persistence and pre-paint script
│   ├── preferences.ts          # Preference defaults and storage
│   ├── quotes.ts               # Daily quote selection
│   ├── sounds.ts               # Web Audio alerts
│   ├── site.ts                 # Site URL, title, and description
│   └── registry.tsx            # styled-components SSR registry
├── public/
│   └── image.png               # Brand / social preview image
├── next.config.ts
├── package.json
└── README.md
```

| Path | Purpose |
| ---- | ------- |
| `app/` | App Router entry, metadata, and SEO files |
| `components/` | UI and providers |
| `hooks/` | Client hook for the live clock |
| `lib/` | Timezone, theme, preferences, site metadata, and sounds |
| `public/` | Static assets served as-is |
| `package.json` | Dependencies and scripts |
| `next.config.ts` | Next.js configuration |
| `README.md` | Project documentation |

There are no `app/api` routes.

---

## Components

| Component | Responsibility |
| --------- | -------------- |
| `ClockPage` | Full-screen layout: clock, timer, controls, and footer |
| `Clock` | Live Kolkata time, optional quote, and timezone label |
| `DateDisplay` | Current Kolkata date |
| `Timer` | Countdown, collapse/focus modes, and keyboard shortcuts |
| `TopControls` | Sound toggle, theme toggle, and settings menu |
| `ThemeProvider` | Dark / light theme context |
| `ThemeToggle` | Standalone theme switch button |
| `PreferencesProvider` | Display and timer preference context |
| `SmoothSeconds` | Animated seconds digits |
| `GlobalStyles` | CSS variables, reset, and theme tokens |

---

## APIs & Browser APIs

This project does not require a backend API or external time API.

The current time is generated client-side with JavaScript's built-in date/time APIs and the `Asia/Kolkata` timezone. There is no server clock, no third-party time service, and no `app/api` route.

| API | How it is used |
| --- | -------------- |
| `Date` | Current instant on the client |
| `Intl.DateTimeFormat` | Format time and date in `Asia/Kolkata` |
| `setTimeout` / `setInterval` | Tick the clock once per second, aligned to the next second |
| `localStorage` | Persist theme (`clock-theme`) and preferences (`timer-preferences`) |
| `matchMedia` | Detect system light / dark preference when none is stored |
| `AudioContext` | Play a short completion sound when the timer ends |

`app/robots.ts` and `app/sitemap.ts` only generate static SEO files. They do not fetch time or user data.

---

## Timezone

**Timezone:** `Asia/Kolkata`

```text
Timezone: Asia/Kolkata
Display:  Kolkata, India (IST)
```

The clock and date always show India Standard Time, regardless of the visitor's local timezone. The daily quote is also keyed to the Kolkata calendar day so it changes with IST, not the browser's local date.

---

## Environment Variables

No environment variables are required for the core application.

The only optional variable is a public site URL override used for metadata, sitemap, and Open Graph URLs:

```env
NEXT_PUBLIC_SITE_URL=https://timerdv.vercel.app
```

If it is unset, the app falls back to `https://timerdv.vercel.app`. There is no `.env` or `.env.example` in the repository.

---

## Installation

### Clone

```bash
git clone https://github.com/umarnaxir/timer.git
cd timer
```

### Install Dependencies

```bash
npm install
```

---

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Command | Purpose |
| ------ | ------- | ------- |
| `dev` | `next dev` | Local development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve the production build |
| `lint` | `eslint` | Lint the project |

---

## Production Build

```bash
npm run build
npm run start
```

The production server uses the default Next.js port (`3000`) unless you set `PORT`.

---

## Deployment

The app is deployed on **Vercel**.

| Item | Value |
| ---- | ----- |
| Platform | [Vercel](https://vercel.com) |
| Production URL | [https://timerdv.vercel.app](https://timerdv.vercel.app) |
| Framework | Next.js |
| Build command | `npm run build` |
| Start command | `npm run start` (used by a Node host; Vercel serves the Next.js build directly) |
| Environment variables | None required. Optional: `NEXT_PUBLIC_SITE_URL` |

A typical Vercel deploy is: connect the GitHub repository, keep the default Next.js settings, and deploy. No extra platform config file is in the repo.

---

## How to Use

The interface is intentionally small. Most of the screen is the clock.

### Clock

Open the site. The current Kolkata time appears immediately. Use the settings menu (`•••`) to switch 12 / 24 hour time, or to show or hide seconds, date, quote, and timezone.

### Timer

1. Set hours, minutes, and seconds.
2. Click **Start**.
3. Use **Pause** when you need a break.
4. Click **Resume** to continue.
5. Click **Reset** to return to the configured duration.

Optional: open **Focus** for a large centered countdown, or collapse the panel into a small launcher. When the timer reaches zero, it stops and can play a short alert.

### Theme

Use the sun / moon control in the top-right to switch between dark and light mode. The choice is remembered for the next visit.

---

## Browser Compatibility

The app is intended for modern browsers:

- Chrome
- Safari
- Firefox
- Edge
- Current mobile browsers on iOS and Android

It relies on standard JavaScript APIs (`Intl`, `localStorage`, CSS custom properties). Older or unsupported browsers are not a target.

---

## Performance & Design Philosophy

- Lightweight, with a short dependency list
- No backend and no time API calls
- One client-side tick per second
- Responsive full-screen layout
- Preferences stay on the device
- Small component surface: clock, timer, and a few controls

The goal is a quiet utility you can leave open — not a dashboard, not a product suite.

---

## Author

Built by **[Umar Nazir](https://umarnazir.vercel.app/)**

- GitHub: [umarnaxir](https://github.com/umarnaxir)
- Repository: [umarnaxir/timer](https://github.com/umarnaxir/timer)

Originally created for personal use as a large-screen clock and timer.

---

## Open for Everyone

This started as a personal utility, but there's no reason it should stay personal. If you find the clock or timer useful, feel free to use it, customize it, or adapt it for your own workspace.

---

## License

Licensing information has not yet been specified.
