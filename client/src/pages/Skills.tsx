import { useSkills } from "@/hooks/use-skills";
import { motion } from "framer-motion";
import { Loader2, Zap, Database, Globe, Layers } from "lucide-react";

export default function Skills() {
  const { data: skills, isLoading } = useSkills();

  // Group skills by category
  const categories = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Sort skills by proficiency
  Object.keys(categories || {}).forEach(key => {
    categories![key].sort((a, b) => b.proficiency - a.proficiency);
  });

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "frontend": return <Globe className="w-5 h-5 text-primary" />;
      case "backend": return <Database className="w-5 h-5 text-primary" />;
      case "ai/ml": return <Zap className="w-5 h-5 text-primary" />;
      default: return <Layers className="w-5 h-5 text-primary" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-start">
        <div className="flex items-center gap-2 text-primary font-mono animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          ANALYZING_SKILLS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 max-w-2xl"
      >
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">Technical Proficiency</h2>
        <p className="text-muted-foreground">
          A comprehensive breakdown of my technical capabilities across various domains of software engineering.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {Object.entries(categories || {}).map(([category, categorySkills], index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border border-white/5 hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                {getIcon(category)}
              </div>
              <h3 className="text-xl font-bold font-display">{category}</h3>
            </div>

            <div className="space-y-6">
              {categorySkills.map((skill) => (
                <div key={skill.id} className="group">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {skill.name}
                    </span>
                    <span className="font-mono text-muted-foreground text-xs">
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
