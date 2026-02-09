import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Terminal, Cpu, Globe } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center relative">
      <div className="flex-1 flex flex-col justify-center items-start max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px w-12 bg-primary/50" />
          <span className="text-primary font-mono text-sm tracking-wider uppercase">
            System Online
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold font-display leading-tight tracking-tight"
        >
          Building the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 text-glow">
            Digital Future
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          I am a Full Stack Engineer and AI Specialist crafting high-performance
          applications with next-generation technologies. Bridging the gap between
          complex data systems and intuitive user experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <Link href="/projects">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg h-14 px-8 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all">
              View Projects
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="border-white/10 hover:bg-white/5 text-foreground font-semibold text-lg h-14 px-8 rounded-full">
              Contact Me
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50"
      >
        <span className="text-xs font-mono uppercase tracking-widest">Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>

      {/* Decorative Grid Items */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 hidden lg:flex flex-col gap-8 opacity-20 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="p-6 rounded-2xl glass border border-primary/20"
        >
          <Terminal className="w-12 h-12 text-primary" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -15, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="p-6 rounded-2xl glass border border-primary/20 ml-12"
        >
          <Cpu className="w-12 h-12 text-primary" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="p-6 rounded-2xl glass border border-primary/20"
        >
          <Globe className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    </div>
  );
}
