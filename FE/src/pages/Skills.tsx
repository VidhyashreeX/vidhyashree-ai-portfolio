import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type StackLogo = {
  name: string;
  src: string;
};

const stackLogos: StackLogo[] = [
  { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "Java", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "C", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
  { name: "R", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" },
  { name: "Scikit-learn", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" },
  { name: "TensorFlow", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  { name: "Keras", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg" },
  { name: "Pandas", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
  { name: "NumPy", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
  { name: "Matplotlib", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg" },
  { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Flask", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
  { name: "Bootstrap", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
  { name: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "MongoDB", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Google Cloud Platform", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
  { name: "Docker", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Git", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "Postman", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-20 px-4 md:px-10 lg:px-14"
      style={{
        background:
          "linear-gradient(135deg, rgba(8,23,48,0.68) 0%, rgba(16,42,76,0.54) 38%, rgba(8,28,38,0.62) 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mb-8 md:mb-10"
      >
        <h2 className="font-mono text-base md:text-lg tracking-[0.14em] text-primary">
          $ Developer arsenal
        </h2>
      </motion.div>

      <div className="group grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 lg:gap-7">
        {stackLogos.map((logo, index) => (
          <div
            key={logo.name}
            className={`flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 will-change-transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            } group-hover:opacity-70 hover:!opacity-100 hover:scale-[1.2] hover:border-primary/60 hover:bg-white/[0.08]`}
            style={{
              height: "clamp(100px, 12vw, 120px)",
              transitionDelay: `${index * 70}ms`,
            }}
          >
            <img
              src={logo.src}
              alt={logo.name}
              loading="lazy"
              className="h-[60px] w-[60px] md:h-[72px] md:w-[72px] object-contain transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
