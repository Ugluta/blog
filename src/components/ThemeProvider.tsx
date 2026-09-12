import { prisma } from "@/lib/prisma";

// Server component — runs at request time (or build time with revalidate).
// Reads SiteSetting rows and injects CSS variables into <head>.
// Falls back to safe defaults when the DB is unavailable.

const DEFAULTS: Record<string, string> = {
  primary_color: "#3A6EA8",
  secondary_color: "#1A3A5C",
  text_color: "#111111",
  link_color: "#3A6EA8",
  border_color: "#DDD8CF",
  card_bg: "#FFFFFF",
  bg_color: "#F8F6F1",
  bg_type: "color",
  bg_gradient_from: "#F8F6F1",
  bg_gradient_to: "#EDE9E0",
  font_body: "Inter",
  font_heading: "Inter",
  font_size_base: "16",
  line_height: "1.65",
  font_weight_heading: "700",
  site_width: "1280",
};

async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: Object.keys(DEFAULTS),
        },
      },
    });
    const map: Record<string, string> = { ...DEFAULTS };
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch {
    return DEFAULTS;
  }
}

function buildBackground(s: Record<string, string>): string {
  if (s.bg_type === "gradient") {
    return `linear-gradient(135deg, ${s.bg_gradient_from}, ${s.bg_gradient_to})`;
  }
  if (s.bg_type === "image" && s.bg_image) {
    return `url(${s.bg_image}) center/cover no-repeat fixed`;
  }
  return s.bg_color;
}

function buildGoogleFontsUrl(body: string, heading: string): string {
  const fonts = new Set([body, heading].filter(Boolean));
  if (!fonts.size) return "";
  const families = Array.from(fonts)
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700;800;900`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export default async function ThemeProvider() {
  const s = await getSettings();

  const bg = buildBackground(s);
  const fontsUrl = buildGoogleFontsUrl(s.font_body, s.font_heading);

  const css = `
:root {
  --theme-primary: ${s.primary_color};
  --theme-secondary: ${s.secondary_color};
  --theme-text: ${s.text_color};
  --theme-link: ${s.link_color};
  --theme-border: ${s.border_color};
  --theme-card-bg: ${s.card_bg};
  --theme-bg: ${s.bg_color};
  --theme-site-width: ${s.site_width}px;
  --theme-font-body: '${s.font_body}', -apple-system, BlinkMacSystemFont, sans-serif;
  --theme-font-heading: '${s.font_heading}', Georgia, serif;
  --theme-font-size: ${s.font_size_base}px;
  --theme-line-height: ${s.line_height};
  --theme-heading-weight: ${s.font_weight_heading};

  /* override globals.css tokens */
  --gold-500: ${s.primary_color};
  --gold-400: ${s.primary_color};
  --navy-900: ${s.bg_color};
  --card-bg: ${s.card_bg};
  --border-color: ${s.border_color};
  --text-primary: ${s.text_color};
}

body {
  background: ${bg};
  font-family: var(--theme-font-body);
  font-size: var(--theme-font-size);
  line-height: var(--theme-line-height);
  color: var(--theme-text);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--theme-font-heading);
  font-weight: var(--theme-heading-weight);
}

a:hover { color: var(--theme-primary); }
::selection { background-color: color-mix(in srgb, var(--theme-primary) 30%, transparent); }
:focus-visible { outline-color: var(--theme-primary); }
.section-header { border-left-color: var(--theme-primary); }
.gold-glow { box-shadow: 0 0 0 1px color-mix(in srgb, var(--theme-primary) 30%, transparent); }
.gold-glow:hover { box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-primary) 60%, transparent), 0 4px 20px color-mix(in srgb, var(--theme-primary) 15%, transparent); }
.calendar-day-today { background-color: var(--theme-primary); }
.calendar-day-event::after { background-color: var(--theme-primary); }
.divider-gold { background: linear-gradient(to right, var(--theme-primary), transparent); }
::-webkit-scrollbar-thumb:hover { background: var(--theme-primary); }
`.trim();

  return (
    <>
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
