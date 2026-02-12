import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ExperienceSection } from "@/components/ExperienceSection";
import Skills from "@/pages/Skills";
import Contact from "@/pages/Contact";

const roleSteps = [
  { base: "AI focused ", suffix: "software engineer", holdMs: 1100 },
  { base: "AI focused ", suffix: "full stack developer", holdMs: 1100 },
  { base: "", suffix: "Machine Learning Engineer", holdMs: 1400 },
];

export default function Home() {
  const [roleStepIndex, setRoleStepIndex] = useState(0);
  const [typedRole, setTypedRole] = useState("");
  const [isDeletingRole, setIsDeletingRole] = useState(false);

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
            <span className="text-primary font-mono text-sm tracking-wider uppercase">
              Hi there I'm
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

      <section id="skills">
        <Skills />
      </section>

      <section className="px-4 md:px-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <div className="glass rounded-2xl border border-primary/20 px-6 py-8 md:px-10 md:py-10 text-center shadow-[0_0_20px_rgba(0,240,255,0.12)]">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-5">Check out my works</h3>
            <Link href="/projects">
              <span className="inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-6 py-3 text-sm md:text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Check out my works
              </span>
            </Link>
          </div>
        </motion.div>
      </section>

      <section id="contact">
        <Contact />
      </section>
    </div>
  );
}
