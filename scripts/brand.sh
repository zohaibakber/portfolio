#!/usr/bin/env bash
# Renders the favicon, touch icon and public/og.png. The OG image uses the Inter Tight file Astro downloads at build time, so run after `bun run build`.
set -euo pipefail
cd "$(dirname "$0")/.."

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

cp "$(ls dist/_astro/fonts/*.woff2 | head -1)" "$work/inter-tight.woff2"
woff2_decompress "$work/inter-tight.woff2"

cat > "$work/fonts.conf" <<CONF
<?xml version="1.0"?>
<fontconfig><dir>$work</dir><cachedir>$work/cache</cachedir></fontconfig>
CONF

cat > "$work/og.svg" <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f2f2f0"/>
  <g font-family="Inter Tight" fill="#1e1f21">
    <text x="36" y="535" font-size="200" font-weight="300" letter-spacing="-9">Zohaib Akber</text>
    <text x="48" y="590" font-size="22" font-weight="400" fill="#6c6f73">zohaibakber.com</text>
  </g>
</svg>
SVG

FONTCONFIG_FILE="$work/fonts.conf" rsvg-convert -w 1200 -h 630 "$work/og.svg" -o public/og.png

cat > public/favicon.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" fill="#1e1f21"/></svg>
SVG

cat > "$work/touch.svg" <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect width="180" height="180" fill="#f2f2f0"/><rect x="54" y="54" width="72" height="72" fill="#1e1f21"/></svg>
SVG

rsvg-convert -w 180 -h 180 "$work/touch.svg" -o public/apple-touch-icon.png
rsvg-convert -w 32 -h 32 public/favicon.svg -o "$work/32.png"
rsvg-convert -w 16 -h 16 public/favicon.svg -o "$work/16.png"
magick "$work/16.png" "$work/32.png" public/favicon.ico
echo "wrote public/og.png, favicon.svg, favicon.ico, apple-touch-icon.png"
