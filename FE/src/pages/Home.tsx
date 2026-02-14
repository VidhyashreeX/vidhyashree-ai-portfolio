import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
import { Download, Github, Linkedin, Mail } from "lucide-react";
import { type ProjectResponse } from "@shared/schema";
import { ExperienceSection } from "@/components/ExperienceSection";
import { useProjects } from "@/hooks/use-projects";

const roleSteps = [
  { base: "AI focused ", suffix: "software engineer", holdMs: 1100 },
  { base: "AI focused ", suffix: "full stack developer", holdMs: 1100 },
  { base: "", suffix: "Machine Learning Engineer", holdMs: 1400 },
];

function CompactProjectCard({ project, slot }: { project: ProjectResponse | null; slot: number }) {
  if (!project) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/5 h-full min-h-[220px]">
        <h3 className="text-lg font-bold font-display text-muted-foreground">Project Slot {slot}</h3>
        <p className="mt-2 text-sm text-muted-foreground/80">Placeholder for upcoming work.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 h-full min-h-[220px]">
      <h3 className="text-lg font-bold font-display line-clamp-2">{project.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-4">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.slice(0, 3).map((tech) => (
          <span
            key={`${project.id}-${tech}`}
            className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [roleStepIndex, setRoleStepIndex] = useState(0);
  const [typedRole, setTypedRole] = useState("");
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [showBottomActions, setShowBottomActions] = useState(false);
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const { data: projects } = useProjects();
  const projectCards = useMemo(() => {
    const cards: (ProjectResponse | null)[] = [...(projects ?? [])].slice(0, 9);
    while (cards.length < 9) cards.push(null);
    return cards;
  }, [projects]);

  useEffect(() => {
    const currentStep = roleSteps[roleStepIndex];
    const currentTarget = `${currentStep.base}${currentStep.suffix}`;
    const nextStep = roleSteps[(roleStepIndex + 1) % roleSteps.length];
    const nextBaseLength = currentTarget.startsWith(nextStep.base)
      ? nextStep.base.length
      : 0;

    let timer: number;

    if (!isDeletingRole) {
      if (typedRole.length < currentTarget.length) {
        timer = window.setTimeout(() => {
          setTypedRole(currentTarget.slice(0, typedRole.length + 1));
        }, 55);
      } else {
        timer = window.setTimeout(() => {
          setIsDeletingRole(true);
        }, currentStep.holdMs);
      }
    } else if (typedRole.length > nextBaseLength) {
      timer = window.setTimeout(() => {
        setTypedRole(typedRole.slice(0, -1));
      }, 35);
    } else {
      timer = window.setTimeout(() => {
        setIsDeletingRole(false);
        setRoleStepIndex((index) => (index + 1) % roleSteps.length);
      }, 180);
    }

    return () => window.clearTimeout(timer);
  }, [typedRole, isDeletingRole, roleStepIndex]);

  useEffect(() => {
    const updateBottomVisibility = () => {
      const bottomReached =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 48;
      setShowBottomActions(bottomReached);
    };

    updateBottomVisibility();
    window.addEventListener("scroll", updateBottomVisibility, { passive: true });
    window.addEventListener("resize", updateBottomVisibility);

    return () => {
      window.removeEventListener("scroll", updateBottomVisibility);
      window.removeEventListener("resize", updateBottomVisibility);
    };
  }, []);

  const handleProjectsWheel = (event: WheelEvent<HTMLDivElement>) => {
    const scroller = projectsScrollRef.current;
    if (!scroller) return;
    scroller.scrollLeft += event.deltaY;
    event.preventDefault();
  };

  return (
    <div className="flex flex-col">
      <section id="home" className="pt-14 pb-8 md:pt-16 md:pb-10 px-4 md:px-12 w-full flex flex-col relative">
        <div className="flex flex-col items-start w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-12 bg-primary/50" />
            <span className="font-mono text-sm tracking-[0.22em] text-[#8BFFA8] drop-shadow-[0_0_8px_rgba(139,255,168,0.55)]">
              Hello world I&apos;m..
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-display leading-tight tracking-tight"
          >
            Vidhyashree <span className="text-primary">S</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed"
          >
            <span className="relative inline-flex min-h-[1.75em] items-baseline">
              <span className="text-primary">{typedRole}</span>
              <span className="ml-1 inline-block h-[1em] w-[2px] bg-primary align-middle animate-pulse" />
            </span>
          </motion.p>
        </div>
      </section>

      <section id="about" className="py-10 md:py-12 px-4 md:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold font-display">About Me</h2>
            <p className="text-lg text-foreground leading-relaxed">
              My love and passion for{" "}
              <span className="text-primary font-semibold">AI</span> began the first time I
              encountered the word back in{" "}
              <span className="text-primary font-semibold">high school</span>. What started as
              simple curiosity quickly turned into a long-term{" "}
              <span className="text-primary font-semibold">pursuit</span>.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Fast forward to today, my work revolves around{" "}
              <span className="text-primary font-semibold">
                machine learning, generative AI, LLMs, and intelligent systems.
              </span>{" "}
              I enjoy exploring, experimenting, and building because in the world of AI, standing
              still means falling behind.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              For me, AI is not just an{" "}
              <span className="text-primary font-semibold">area of interest</span>. It is the{" "}
              <span className="text-primary font-semibold">foundation</span> of how I think about
              the future of software.
            </p>
          </div>
        </motion.div>
      </section>

      <ExperienceSection />

      <section id="projects" className="py-8 md:py-10 px-4 md:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display">Projects</h2>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Scroll to browse projects horizontally.
          </p>
        </motion.div>

        <div
          ref={projectsScrollRef}
          onWheel={handleProjectsWheel}
          className="overflow-x-auto overflow-y-hidden pb-2"
        >
          <div className="flex gap-6 min-w-max">
            {projectCards.map((project, index) => (
              <div
                key={project ? project.id : `placeholder-${index + 1}`}
                className="w-[84vw] sm:w-[46vw] lg:w-[31vw] max-w-[420px]"
              >
                <CompactProjectCard project={project} slot={index + 1} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="h-20" />

      <div
        className={`fixed right-4 bottom-5 md:right-8 md:bottom-8 z-50 group/fab transition-all duration-300 ${
          showBottomActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-col gap-2 overflow-hidden max-h-0 opacity-0 translate-y-2 transition-all duration-300 group-hover/fab:max-h-44 group-hover/fab:opacity-100 group-hover/fab:translate-y-0">
            <a
              href="https://github.com/VidhyashreeX"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="glass h-11 w-11 rounded-xl border border-white/20 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/vidhyashree-s"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className="glass h-11 w-11 rounded-xl border border-white/20 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:vidyashri1510@gmail.com"
              aria-label="Email"
              className="glass h-11 w-11 rounded-xl border border-white/20 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          <div className="glass rounded-2xl border border-white/20 px-4 py-2 text-sm font-medium tracking-wide shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            Contact
          </div>
        </div>
      </div>

      <a
        href="/resume.pdf"
        download
        className={`fixed left-4 bottom-5 md:left-8 md:bottom-8 z-50 inline-flex items-center gap-2 glass rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold hover:border-primary/50 hover:text-primary transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.25)] ${
          showBottomActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        aria-label="Download CV"
      >
        <span>CV</span>
        <Download className="h-4 w-4" />
      </a>

      <p
        className={`fixed left-1/2 -translate-x-1/2 bottom-8 z-50 text-[10px] md:text-xs tracking-wide text-foreground/85 transition-all duration-300 ${
          showBottomActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        with love from Vidhyashree Shanmugam
      </p>
    </div>
  );
}
