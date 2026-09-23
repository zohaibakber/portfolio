export const portfolio = {
  name: "Zohaib Akber",
  title: "Full-Stack Developer",
  location: "Lahore, Pakistan",
  email: "mail@zohaibakber.com",
  website: "zohaibakber.com",
  intro: "Full-stack developer in Lahore, Pakistan.",
  statement:
    "I turn designs into fast, precise websites, from the first Figma frame to a live storefront.",
  projects: [
    {
      name: "Kråkvik & D'Orazio",
      url: "https://krakvikdorazio.com",
      image: "/work/krakvik.webp",
      note: "Built with SPEC47",
    },
    {
      name: "Lafine",
      url: "https://lafine-lab.com",
      image: "/work/lafine.webp",
      note: "Built with SPEC47",
    },
    {
      name: "Silvens",
      url: "https://silvens.store",
      image: "/work/silvens.webp",
      note: "Next.js and Shopify",
    },
  ],
} as const;

export type Project = (typeof portfolio.projects)[number];
