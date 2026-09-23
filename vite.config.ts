import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    ignorePatterns: [".next/**", "next-env.d.ts"],
    plugins: ["react", "nextjs", "jsx-a11y", "typescript", "react-perf"],
    categories: {
      correctness: "error",
      suspicious: "warn",
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "typescript/consistent-return": "off",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
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
    sortTailwindcss: {
      stylesheet: "./app/globals.css",
    },
  },
});
