import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type ExperienceItem = {
  company: string;
  role: string;
  points: string[];
};

const experiences: ExperienceItem[] = [
  {
    company: "Adtip (AdxReel)",
    role: "Full Stack Engineer",
    points: [
      "Worked as a Full Stack Engineer contributing to end-to-end product development across frontend and backend systems. Designed and implemented RESTful APIs and built scalable React-based web applications supporting core product workflows. Actively improved UI components, enhanced application reactivity, and resolved critical bugs to ensure a seamless user experience.",
      "Strengthened platform reliability by integrating third-party services and troubleshooting production issues in live environments. Focused on debugging, performance optimization, and improving application stability. Assisted in Docker-based deployments and maintained structured Git workflows across development and production environments.",
      "Additionally gained hands-on exposure to AWS services, understanding cloud deployment practices and infrastructure fundamentals to support scalable application development.",
    ],
  },
  {
    company: "Kshipani Tech Ventures Pvt. Ltd.",
    role: "Machine Learning Engineer",
    points: [
      "Worked as a Machine Learning Engineer focused on building and deploying Generative AI applications using fine-tuned Large Language Models (LLMs) and Small Language Models (SLMs). Developed scalable GenAI solutions using Python and open-source frameworks such as LangChain, LangGraph, Hugging Face, and AutoGen.",
      "Designed and implemented RAG (Retrieval-Augmented Generation) pipelines using Vector Databases to improve contextual accuracy and response quality. Fine-tuned LLMs using techniques such as PEFT, LoRA, and QLoRA for domain-specific use cases, while applying NLP techniques to enhance model performance.",
      "Built robust data preprocessing pipelines for training and fine-tuning workflows. Integrated generative AI models into enterprise applications through backend APIs for production deployment. Rapidly prototyped GenAI applications to demonstrate feasibility and gather stakeholder feedback.",
      "Collaborated with frontend teams to integrate AI capabilities into user-facing applications using Streamlit and React. Maintained version control using Git and created clear technical documentation covering model versions, experiments, and system architecture.",
    ],
  },
  {
    company: "Konigtronics",
    role: "AI & ML Intern",
    points: [
      "Contributed to end-to-end machine learning lifecycles including data preprocessing, model training, evaluation, and deployment support. Worked extensively with Python for data analysis, cleaning, transformation, and exploratory data analysis (EDA) using pandas.",
      "Developed data visualizations using Matplotlib and Seaborn to generate actionable insights for decision-making. Wrote and optimized SQL queries for structured data extraction and analysis from relational databases.",
      "Applied foundational AI/ML concepts including supervised and unsupervised learning, neural networks, and NLP techniques in predictive modeling tasks. Maintained documentation of experiments, datasets, and model performance while staying updated with emerging AI research and evaluating its applicability to ongoing projects.",
    ],
  },
  {
    company: "TechByHeart",
    role: "Cybersecurity Intern",
    points: [
      "Conducted vulnerability assessments and security analysis using Kali Linux and OWASP methodologies. Simulated real-world attack scenarios to identify application security weaknesses and recommended mitigation strategies to enhance system protection and reduce risk exposure.",
    ],
  },
];

export function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = experiences[activeIndex];

  return (
    <section id="experience" className="py-10 md:py-12 px-4 md:px-12 w-full">
      <div className="max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-8">Where I&apos;ve Worked</h2>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12">
          <div className="relative">
            <div className="absolute left-0 top-0 h-full w-px bg-white/20" />
            <div className="space-y-1">
              {experiences.map((experience, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={experience.company}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`group relative w-full text-left pl-5 pr-2 py-2 transition-colors ${
                      isActive ? "text-primary" : "text-foreground/75 hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-company-indicator"
                        className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 bg-primary"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="text-sm md:text-base">{experience.company}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.company}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7"
              >
                <h3 className="text-xl md:text-2xl font-semibold text-primary">{active.role}</h3>
                <p className="mt-1 text-base text-foreground/80">{active.company}</p>
                <div className="mt-4 space-y-4">
                  {active.points.map((point, index) => (
                    <p key={`${active.company}-point-${index}`} className="text-foreground leading-relaxed">
                      {point}
                    </p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
