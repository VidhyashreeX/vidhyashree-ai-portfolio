import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/skills", label: "Skills" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-[2px]">
      <div className="flex items-center gap-2 p-1.5 rounded-full glass border border-white/10 shadow-lg shadow-primary/5">
        {links.map((link) => {
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href} className="relative">
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
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
