import { nav, portfolio, spec47 } from "@/lib/portfolio";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted">
      {children}
    </p>
  );
}

function ExternalLink({
  href,
  children,
  className = "text-foreground",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} underline decoration-border underline-offset-[3px] transition-colors hover:decoration-foreground`}
    >
      {children}
    </a>
  );
}

function ProjectDescription({ text }: { text: string }) {
  const parts = text.split(spec47.name);
  if (parts.length === 1) {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 ? (
            <ExternalLink href={spec47.url} className="text-muted">
              {spec47.name}
            </ExternalLink>
          ) : null}
        </span>
      ))}
    </>
  );
}

export default function Home() {
  const { name, title, location, email, website } = portfolio;
  const currentYear = new Date().getFullYear();

  return (
    <div className="mx-auto flex min-h-screen max-w-[42rem] flex-col px-6 py-16 sm:px-8 sm:py-20 lg:max-w-[52rem] lg:flex-row lg:gap-20 lg:py-24">
      <aside className="mb-14 lg:sticky lg:top-24 lg:mb-0 lg:w-28 lg:shrink-0 lg:self-start">
        <nav aria-label="Page sections">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-3">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <header id="about" className="scroll-mt-24 border-b border-border pb-14">
          <h1 className="text-[1.125rem] font-normal tracking-tight text-foreground">
            {name}
          </h1>
          <p className="mt-1 text-muted">{title}</p>
          <p className="mt-0.5 text-muted">{location}</p>

          <p className="mt-8">
            <a
              href={`mailto:${email}`}
              className="text-muted transition-colors hover:text-foreground"
            >
              {email}
            </a>
          </p>

          <p className="mt-10 max-w-prose text-foreground/90">
            {portfolio.summary}
          </p>

          <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-2">
            {portfolio.skills.map((skill) => (
              <li
                key={skill}
                className="font-mono text-[0.625rem] text-muted"
              >
                {skill}
              </li>
            ))}
          </ul>
        </header>

        <section id="work" className="scroll-mt-24 border-b border-border py-14">
          <SectionLabel>Selected work</SectionLabel>
          <ul className="space-y-12">
            {portfolio.projects.map((project) => (
              <li key={project.name}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="text-[0.875rem] font-normal text-foreground">
                    <ExternalLink href={project.url}>{project.name}</ExternalLink>
                  </h2>
                  <span className="font-mono text-[0.625rem] text-muted">
                    {project.role}
                  </span>
                </div>
                {project.stack ? (
                  <p className="mt-1 font-mono text-[0.625rem] text-muted">
                    {project.stack}
                  </p>
                ) : null}
                <p className="mt-3 max-w-prose text-muted">
                  <ProjectDescription text={project.description} />
                </p>
              </li>
            ))}
          </ul>
        </section>

        <footer id="contact" className="scroll-mt-24 pt-14">
          <SectionLabel>Contact</SectionLabel>
          <p className="max-w-prose text-muted">
            Open to collaborations on web products, e-commerce, and design-led
            builds. Reach out via{" "}
            <a
              href={`mailto:${email}`}
              className="text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
            >
              email
            </a>{" "}
            or visit{" "}
            <ExternalLink href={`https://${website}`}>{website}</ExternalLink>.
          </p>
          <p className="mt-16 font-mono text-[0.625rem] text-muted">
            © {currentYear} {name}
          </p>
        </footer>
      </main>
    </div>
  );
}
