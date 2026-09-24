import { EasterEggs } from "@/components/easter-eggs";
import { Hero } from "@/components/hero";
import { LahoreDateTime } from "@/components/lahore-datetime";
import { Statement } from "@/components/statement";
import { WorkList } from "@/components/work-list";
import { opticalMargin } from "@/lib/optical";
import { portfolio } from "@/lib/portfolio";

export default function Home() {
  const { name, email, intro, statement, projects } = portfolio;
  const [first, last] = name.split(" ");
  const currentYear = new Date().getFullYear();

  return (
    <>
      <EasterEggs email={email} />

      <main className="relative z-10 bg-paper">
        <Hero first={first} last={last} intro={intro} />

        <section id="work" aria-labelledby="work-title" className="px-5 pt-24 md:px-8 md:pt-40">
          <h2 id="work-title" data-spec="Section title" className="mb-8 text-muted md:mb-12">
            Selected work
          </h2>
          <WorkList projects={projects} />
        </section>

        <section aria-label="Approach" className="px-5 py-32 md:px-8 md:py-56">
          <div className="md:grid md:grid-cols-12 md:gap-x-6">
            <div className="md:col-span-9 md:col-start-4">
              <Statement text={statement} />
            </div>
          </div>
        </section>
        <div id="main-end" aria-hidden />
      </main>

      <footer
        id="contact"
        className="accent-block sticky bottom-0 z-0 flex min-h-[60svh] flex-col justify-between bg-accent px-5 pt-24 pb-6 text-on-accent md:min-h-[75svh] md:px-8 md:pb-8"
      >
        <div>
          <p className="mb-4 opacity-80 md:mb-6">Have a project in mind?</p>
          <a
            href={`mailto:${email}`}
            draggable={false}
            className="group display block text-[12vw] select-text md:text-[min(11rem,calc((100vw-4rem)/11.5))] md:whitespace-nowrap"
          >
            <span className="sr-only">{email}</span>
            <span aria-hidden>
              {Array.from(email).map((char, i) => (
                <span
                  key={i}
                  className="swell inline-block"
                  style={{
                    transitionDelay: `${i * 22}ms`,
                    ...(i === 0 ? opticalMargin(char) : {}),
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </a>
        </div>
        <div className="flex flex-col gap-1 text-sm opacity-80 md:flex-row md:justify-between">
          <LahoreDateTime />
          <p>
            <span>
              ©{" "}
              <span id="copyright-year" suppressHydrationWarning>
                {currentYear}
              </span>
              <script
                dangerouslySetInnerHTML={{
                  __html: `document.getElementById("copyright-year").textContent=new Date().getFullYear()`,
                }}
              />{" "}
              {name}
            </span>
          </p>
        </div>
      </footer>
    </>
  );
}
