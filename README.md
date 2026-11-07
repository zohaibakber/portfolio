# zohaibakber.com

One-screen portfolio built with [Astro](https://astro.build). Content lives in `src/data/portfolio.ts`.

```bash
bun install
bun run dev      # http://localhost:4321
bun run build    # static output in dist/
bun run check    # astro check + Vite+ lint, format and types
```

`scripts/brand.sh` regenerates the favicon, touch icon and `public/og.png` after a build.
