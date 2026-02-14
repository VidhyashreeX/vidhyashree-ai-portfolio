import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState, type MouseEvent } from "react";

const sectionLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "Background" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

function smoothScrollTo(targetY: number, duration = 800) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

export function Navigation() {
  const [location] = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  const activeKey = useMemo(() => activeSection, [activeSection]);

  useEffect(() => {
    if (location !== "/") {
      return;
    }

    const elements = sectionLinks
      .map((link) => document.getElementById(link.id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [location]);

  const handleSectionClick = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 96;
      const top = element.getBoundingClientRect().top + window.scrollY - navOffset;
      smoothScrollTo(top, 900);
    }
    window.history.replaceState(null, "", `/#${id}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-[2px]">
      <div className="flex items-center gap-2 p-1.5 rounded-full glass border border-white/10 shadow-lg shadow-primary/5">
        {sectionLinks.map((link) => {
          const isActive = activeKey === link.id;
          return (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={handleSectionClick(link.id)}
              className="relative"
            >
              <div
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer relative z-10",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </div>
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary rounded-full z-0 shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
