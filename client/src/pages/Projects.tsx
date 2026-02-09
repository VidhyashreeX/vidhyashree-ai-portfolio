import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Projects() {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-start">
        <div className="flex items-center gap-2 text-primary font-mono animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          LOADING_DATA...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 max-w-2xl mx-auto px-4">
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>System Error</AlertTitle>
          <AlertDescription>Failed to retrieve project data. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Selected Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of high-impact projects demonstrating expertise in full-stack development, 
          AI integration, and scalable system architecture.
        </p>
      </motion.div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl glass">
          <p className="text-muted-foreground font-mono">NO_PROJECTS_FOUND</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
