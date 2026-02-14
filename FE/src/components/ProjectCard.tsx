import { motion } from "framer-motion";
import { type ProjectResponse } from "@shared/schema";
import { ExternalLink, Github, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProjectCard({ project }: { project: ProjectResponse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col h-full glass-card rounded-2xl overflow-hidden hover:border-primary/50 transition-colors duration-300"
    >
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10 opacity-60" />
        {/* Use Unsplash source if image_url is a placeholder path, otherwise use it directly */}
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {project.featured && (
          <div className="absolute top-4 right-4 z-20">
            <Badge variant="default" className="bg-primary text-primary-foreground border-none shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6 relative z-20">
        <h3 className="text-2xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="mt-3 text-muted-foreground line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="border-white/10 bg-white/5 text-xs font-mono text-primary/80"
            >
              {tech}
            </Badge>
          ))}
        </div>

        <div className="mt-auto pt-8 flex items-center gap-4">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              <Github className="w-4 h-4" />
              Source Code
            </a>
          )}
          {!project.projectUrl && !project.repoUrl && (
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50">
              <Code2 className="w-4 h-4" />
              Private Repo
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
