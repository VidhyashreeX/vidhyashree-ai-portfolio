import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Braces,
  ServerCog,
  TerminalSquare,
  Wrench,
} from "lucide-react";

export default function Skills() {
  const terminalLabel = "Developer arsenal";
  const [typedLabel, setTypedLabel] = useState("");

  useEffect(() => {
    if (typedLabel === terminalLabel) return;
    const timer = window.setTimeout(() => {
      setTypedLabel(terminalLabel.slice(0, typedLabel.length + 1));
    }, 55);

    return () => window.clearTimeout(timer);
  }, [typedLabel, terminalLabel]);

  const sections = useMemo(
    () => [
      {
        key: "ai-ml",
        title: "AI & ML",
        icon: BrainCircuit,
        items: [
          "Python",
          "PySpark",
          "LLMs",
          "RAG",
          "NLP",
          "Prompt Engineering",
          "Scikit-learn",
          "TensorFlow",
          "Keras",
          "Vector DB",
          "OpenCLAW",
        ],
      },
      {
        key: "web-analytics",
        title: "Web & Analytics",
        icon: Braces,
        items: [
          "React",
          "Node.js",
          "Flask",
          "Pandas",
          "NumPy",
          "Matplotlib",
        ],
      },
      {
        key: "cloud-deployment",
        title: "Cloud & Deployment",
        icon: Wrench,
        items: [
          "Google Cloud Platform",
          "Docker",
          "Containerization",
          "Git",
        ],
      },
      {
        key: "databases",
        title: "Databases",
        icon: ServerCog,
        items: ["MySQL", "MongoDB"],
      },
    ],
    [],
  );

  const maxSectionItems = Math.max(...sections.map((section) => section.items.length), 1);

  return (
    <div className="py-14 md:py-16 px-4 md:px-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="text-3xl md:text-5xl font-bold font-display">Skills</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-colors h-full"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold font-display">{section.title}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {section.items.length} skills
                </p>
              </div>
            </div>

            <>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${Math.max(
                      12,
                      Math.round((section.items.length / maxSectionItems) * 100),
                    )}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.05, ease: "easeOut", delay: index * 0.08 }}
                  className="h-full bg-gradient-to-r from-primary/35 via-primary/70 to-primary rounded-full shadow-[0_0_10px_rgba(0,240,255,0.35)]"
                />
              </div>

              <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-white/10 bg-secondary/40 px-3 py-2 text-sm text-foreground/90"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8"
      >
        <div className="inline-flex items-center gap-2 rounded-md border border-primary/25 bg-primary/5 px-3 py-2 font-mono text-xs md:text-sm text-primary">
          <TerminalSquare className="h-4 w-4" />
          <span>$ {typedLabel}</span>
          <span className="inline-block h-4 w-[2px] bg-primary animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}
