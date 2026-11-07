import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    ignorePatterns: ["dist/**", ".astro/**"],
    plugins: ["typescript", "jsx-a11y"],
    categories: {
      correctness: "error",
      suspicious: "warn",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns: ["dist/**", ".astro/**", "public/**", "bun.lock", "AGENTS.md", "CLAUDE.md"],
    printWidth: 100,
    sortPackageJson: true,
  },
});
