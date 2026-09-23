import { defineConfig } from "vite-plus";

// Vite+ is only the static-checks toolchain here (`vp lint`, `vp fmt`, `vp check`); Next.js still builds the app.
export default defineConfig({
  lint: {
    ignorePatterns: [".next/**", "next-env.d.ts"],
    // Oxlint's built-in ports of the rules eslint-config-next used to provide.
    plugins: ["react", "nextjs", "jsx-a11y", "typescript", "react-perf"],
    categories: {
      correctness: "error",
      suspicious: "warn",
    },
    rules: {
      // Next uses the automatic JSX runtime; React never needs to be in scope.
      "react/react-in-jsx-scope": "off",
      // Effects legitimately return nothing on early exit and a cleanup otherwise.
      "typescript/consistent-return": "off",
    },
    options: {
      // Type-aware rules and type checking via tsgolint on the TypeScript 7 toolchain.
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    // AGENTS.md / CLAUDE.md hold the block Next.js manages; leave them byte-for-byte.
    ignorePatterns: [
      ".next/**",
      "public/**",
      "bun.lock",
      "next-env.d.ts",
      "AGENTS.md",
      "CLAUDE.md",
    ],
    printWidth: 100,
    sortPackageJson: true,
    // Same ordering as prettier-plugin-tailwindcss, reading our Tailwind v4 theme.
    sortTailwindcss: {
      stylesheet: "./app/globals.css",
    },
  },
});
