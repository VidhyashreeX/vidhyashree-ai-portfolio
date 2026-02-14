import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, ArrowLeft, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type ProjectResponse } from "@shared/schema";
import { Link } from "wouter";

function PlaceholderProjectCard({ slot }: { slot: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col h-full glass-card rounded-2xl overflow-hidden border border-white/10"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border-b border-white/10" />
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-2xl font-bold font-display text-muted-foreground">Project Slot {slot}</h3>
        <p className="mt-3 text-muted-foreground/70 leading-relaxed">
          Placeholder for upcoming work.
        </p>
      </div>
    </motion.div>
  );
}

export default function Projects({ embedded = false }: { embedded?: boolean }) {
  const { data: projects, isLoading, error } = useProjects();
  const projectCards: (ProjectResponse | null)[] = [...(projects ?? [])].slice(0, 9);

  while (projectCards.length < 9) {
    projectCards.push(null);
  }

  if (isLoading) {
    return (
      <div className={embedded ? "py-6 flex justify-center items-start" : "min-h-screen pt-32 flex justify-center items-start"}>
        <div className="flex items-center gap-2 text-primary font-mono animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          LOADING_DATA...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={embedded ? "py-6 max-w-2xl mx-auto px-4" : "min-h-screen pt-32 max-w-2xl mx-auto px-4"}>
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>System Error</AlertTitle>
          <AlertDescription>Failed to retrieve project data. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={embedded ? "relative py-10 px-4 md:px-8 max-w-7xl mx-auto w-full" : "relative min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto"}>
      {!embedded && (
        <div className="fixed top-6 left-4 right-4 md:left-8 md:right-8 z-40 flex items-center justify-between pointer-events-none">
          <Link
            href="/"
            className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full glass border border-white/15 text-foreground hover:text-primary hover:border-primary/50 transition-colors"
            aria-label="Go back to main page"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <a
            href="/resume.pdf"
            download
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full glass border border-white/15 px-4 py-2.5 text-sm font-semibold text-foreground hover:text-primary hover:border-primary/50 transition-colors"
            aria-label="Download CV"
          >
            <span>CV</span>
            <Download className="h-4 w-4" />
          </a>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={embedded ? "mb-10 text-left" : "mb-16 text-center"}
      >
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">My Projects</h2>
        <p className={embedded ? "text-muted-foreground max-w-3xl" : "text-muted-foreground max-w-2xl mx-auto"}>
          Featured projects first, with additional slots ready for upcoming work.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectCards.map((project, index) =>
          project ? (
            <ProjectCard key={project.id} project={project} />
          ) : (
            <PlaceholderProjectCard key={`placeholder-${index + 1}`} slot={index + 1} />
          ),
        )}
      </div>
    </div>
  );
}
