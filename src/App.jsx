import { useEffect, useRef, useState } from "react";

const projects = [
  {
    title: "Music App UI",
    type: "Mobile app design",
    year: "2025",
    tools: "Figma · Canva",
    tone: "coral",
    mark: "♫",
    images: ["/music1.png", "/music2.png", "/music3.png", "/music4.png"],
  },
  {
    title: "Attendance System",
    type: "UI/UX · Front-end",
    year: "2026",
    tools: "Figma · React · Tailwind",
    tone: "blue",
    mark: "↗",
    images: ["/attendance1.png", "/attendance2.png", "/attendance3.png"],
  },
  {
    title: "Courier Management System",
    type: "Mobile App design",
    year: "2025",
    tools: "Figma · Canva",
    tone: "peach",
    mark: "✦",
    images: [
      "/Courier1.png",
      "/Courier2.png",
      "/Courier3.png",
      "/Courier4.png",
    ],
  },
  {
    title: "Music Web Application",
    type: "React · CSS · JavaScript",
    year: "2025",
    tools: "React · JavaScript",
    tone: "violet",
    mark: "▶",
    images: ["/webapp1.png", "/webapp2.png", "/webapp3.png"],
  },
];
const skills = [
  "Wireframing",
  "User flows",
  "High-fidelity prototyping",
  "Responsive web design",
  "Mobile app design",
  "User research",
  "Usability testing",
  "Design systems",
];

function Typewriter({
  text,
  delay = 0,
  onComplete,
  wrapper: Wrapper = "span",
  className = "",
  showCursor = false,
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let i = 0;
    let interval;
    const timeout = setTimeout(() => {
      setIsTyping(true);
      interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      }, 50);
    }, delay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay]);

  return (
    <Wrapper className={className}>
      {displayedText}
      {showCursor && isTyping && (
        <span className="inline-block w-[3px] h-[1em] ml-1 align-middle bg-current animate-pulse" />
      )}
    </Wrapper>
  );
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        }),
      { threshold: 0.14 },
    );
    root
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function useScrollProgress(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const pageProgress =
        window.scrollY /
        Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--scroll-progress", pageProgress.toFixed(3));
      root.querySelectorAll(".scroll-panel").forEach((panel) => {
        const bounds = panel.getBoundingClientRect();
        const viewportCenter = window.innerHeight * 0.5;
        const panelCenter = bounds.top + bounds.height * 0.5;
        const distance =
          (panelCenter - viewportCenter) /
          Math.max(window.innerHeight, bounds.height);
        const progress = Math.max(0, Math.min(1, 0.5 - distance));
        const travel = Math.max(0, Math.min(1, Math.abs(distance) * 1.35));
        const leaving = distance < 0;
        panel.style.setProperty("--scroll-progress", progress.toFixed(3));
        panel.style.setProperty("--section-travel", travel.toFixed(3));
        panel.style.setProperty("--section-leaving", leaving ? "1" : "0");
        panel.style.setProperty(
          "--scroll-direction",
          distance < 0 ? "-1" : "1",
        );
        panel.classList.toggle(
          "panel-active",
          bounds.top < window.innerHeight * 0.72 &&
            bounds.bottom > window.innerHeight * 0.28,
        );
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}

function ImageCarousel({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const handleMouseEnter = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 950);
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setCurrentIndex(0);
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${title} screenshot ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

function Tilt({ children, className = "" }) {
  const handleMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${y * -8}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${x * 8}deg`);
    event.currentTarget.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    event.currentTarget.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };
  const reset = (event) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };
  return (
    <div
      className={`tilt-wrap ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [typingStep, setTypingStep] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pageRef = useReveal();
  useScrollProgress(pageRef);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="site-shell" ref={pageRef}>
      <div className="scroll-rail" aria-hidden="true">
        <span />
      </div>
      <header className="site-header">
        <a
          className="brand overflow-hidden"
          href="#top"
          aria-label="Prashant Deuja home"
        >
          <img
            src="/LogoMyself.png"
            alt="Prashant Deuja Logo"
            className="w-full h-full object-cover"
          />
        </a>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav
          className={menuOpen ? "nav open" : "nav"}
          aria-label="Main navigation"
        >
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#learn" onClick={() => setMenuOpen(false)}>
            Learn
          </a>
          <a href="#work" onClick={() => setMenuOpen(false)}>
            Portfolio
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </nav>
        <div className="header-socials">
          <a
            href="https://www.linkedin.com/in/prashant-deuja-16a899339"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            href="https://github.com/Prashant471-cmd"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-github"></i>
          </a>
        </div>
      </header>
      <section className="hero" id="top">
        <div className="hero-copy reveal">
          <p className="eyebrow">
            <Typewriter
              text="Hello, I'm Prashant Deuja"
              showCursor={typingStep === 0}
              onComplete={() => setTypingStep(1)}
            />
          </p>
          <h1>
            {typingStep >= 1 && (
              <Typewriter
                text="I design"
                showCursor={typingStep === 1}
                onComplete={() => setTypingStep(2)}
              />
            )}
            {typingStep >= 2 && <br />}
            {typingStep >= 2 && (
              <Typewriter
                text="interfaces"
                wrapper="em"
                showCursor={typingStep === 2}
                onComplete={() => setTypingStep(3)}
              />
            )}
            {typingStep >= 3 && <br />}
            {typingStep >= 3 && (
              <Typewriter
                text="that feel"
                showCursor={typingStep === 3}
                onComplete={() => setTypingStep(4)}
              />
            )}
            {typingStep >= 4 && <br />}
            {typingStep >= 4 && (
              <Typewriter text="like home." showCursor={typingStep === 4} />
            )}
          </h1>
          <p className="hero-intro">
            A BSc.IT student, UI/UX designer and front-end developer crafting
            thoughtful digital experiences from Kathmandu, Nepal.
          </p>
          <a className="arrow-link" href="#work">
            See my work <span>↘</span>
          </a>
        </div>
        <Tilt className="hero-tilt reveal">
          <div
            className="hero-art"
            aria-label="Illustration of a designer and coder at work"
            role="img"
          >
            <div className="art-grid" />
            <div className="art-circle" />
            <img
              src="/mypic.png"
              alt="Prashant Deuja"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] object-contain z-10"
            />
            <div className="art-label label-one">&lt;design /&gt;</div>
            <div className="art-label label-two">{`{ code }`}</div>
            <div className="art-sticker">
              MAKE
              <br />
              IT
              <br />
              <strong>USEFUL</strong>
            </div>
          </div>
        </Tilt>
      </section>
      <section className="statement scroll-panel" id="about">
        <div className="reveal">
          <p className="eyebrow">A little about me</p>
          <h2>
            Good design is invisible.
            <br />
            <span>Great design feels obvious.</span>
          </h2>
        </div>
        <div className="statement-grid reveal">
          <p>
            I&apos;m a fourth-semester BSc.IT student with a love for the space
            where visual design meets useful technology. I turn complex ideas
            into clear, accessible and human-centered products.
          </p>
          <p>
            From research and wireframes to high-fidelity prototypes and clean
            React builds, I care about every detail that makes an interface feel
            effortless.
          </p>
        </div>
      </section>
      <section className="work-section scroll-panel" id="work">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2>
              Things I&apos;ve
              <br />
              <em>been making.</em>
            </h2>
          </div>
          <p className="section-note">
            A small collection of interfaces, systems
            <br />
            and experiments made with intention.
          </p>
        </div>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <a
              className={`project-card reveal ${project.tone} ${project.featured ? "featured" : ""}`}
              href="#contact"
              key={project.title}
              style={{ "--delay": `${index * 90}ms` }}
            >
              <Tilt>
                <div
                  className={`project-visual ${project.images ? "has-images" : ""}`}
                >
                  {project.images ? (
                    project.title === "Attendance System" ? (
                      <ImageCarousel
                        images={project.images}
                        title={project.title}
                      />
                    ) : (
                      <div className="flex justify-center items-center gap-2 w-full h-full p-4 overflow-hidden">
                        {project.images.map((img, i) => (
                          <div key={i} className="flex-1 h-full relative group">
                            <img
                              src={img}
                              alt={`${project.title} screenshot ${i + 1}`}
                              className="absolute inset-0 w-full h-full object-contain rounded-lg shadow-lg group-hover:scale-[1.15] transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <>
                      <span className="project-mark">{project.mark}</span>
                      <span className="project-number">0{index + 1}</span>
                      <div className="visual-lines" />
                    </>
                  )}
                </div>
              </Tilt>
              <div className="project-meta">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.type}</p>
                </div>
                <span>{project.year}</span>
              </div>
              <small>{project.tools}</small>
            </a>
          ))}
        </div>
      </section>
      <section className="learn-section scroll-panel" id="learn">
        <div className="learn-intro reveal">
          <p className="eyebrow">The toolkit</p>
          <h2>
            Curious by
            <br />
            <em>nature.</em>
          </h2>
          <p>
            I&apos;m always learning, testing and looking for a better way to
            make things. Here&apos;s what I bring to the table.
          </p>
        </div>
        <div className="skills-panel reveal">
          <h3>Design skills</h3>
          <div className="skill-list">
            {skills.map((skill, index) => (
              <span
                className="reveal"
                style={{ "--delay": `${index * 60}ms` }}
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="tech-stack">
            <div>
              <b>Languages</b>
              <p>JavaScript · Python · Java</p>
            </div>
            <div>
              <b>Build with</b>
              <p>React.js · Tailwind CSS</p>
            </div>
            <div>
              <b>Tools</b>
              <p>Figma · Canva · MySQL · Git</p>
            </div>
          </div>
        </div>
      </section>
      <section className="experience scroll-panel">
        <div className="experience-head reveal">
          <p className="eyebrow">The timeline</p>
          <h2>
            Still growing,
            <br />
            <em>every day.</em>
          </h2>
        </div>
        <div className="timeline">
          {[
            [
              "2024 — 2027",
              "BSc. Information Technology",
              "Techspire College · Kathmandu",
              "Building a foundation in technology, systems and creative problem solving.",
            ],
            ["2024", "+2 NEB Boards", "Rehdon College", ""],
            [
              "Selected learning",
              "UI/UX Design & Figma",
              "Simplilearn · Udemy · Techspire College",
              "",
            ],
          ].map(([date, title, school, desc], index) => (
            <div
              className="timeline-item reveal"
              style={{ "--delay": `${index * 100}ms` }}
              key={title}
            >
              <span>{date}</span>
              <div>
                <h3>{title}</h3>
                <p>{school}</p>
                {desc && <small>{desc}</small>}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="contact-section scroll-panel" id="contact">
        <div className="contact-inner reveal">
          <p className="eyebrow">Have a project in mind?</p>
          <h2>
            Let&apos;s make
            <br />
            <em>something good.</em>
          </h2>
          <a className="contact-email" href="mailto:deujaprashant21@gmail.com">
            deujaprashant21@gmail.com <span>↗</span>
          </a>
          <p className="location">
            Currently in Kathmandu, Nepal · Available for creative
            collaborations
          </p>
        </div>
      </section>
      <footer className="site-footer">
        <span>© 2026 Prashant Deuja</span>
        <span>Designed & built with curiosity</span>
        <div className="footer-socials">
          <a
            href="https://www.linkedin.com/in/prashant-deuja-16a899339"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            href="https://github.com/Prashant471-cmd"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
          </a>
        </div>
      </footer>
      <button
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </main>
  );
}
