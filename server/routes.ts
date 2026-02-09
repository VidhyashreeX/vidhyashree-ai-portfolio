import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === Projects ===
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  // === Skills ===
  app.get(api.skills.list.path, async (req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  // === Education ===
  app.get(api.education.list.path, async (req, res) => {
    const edu = await storage.getEducation();
    res.json(edu);
  });

  // === Contact Messages ===
  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === SEED DATA ===
  // In a real app, this might be a separate script, but for this demo 
  // we'll check and seed on startup if empty.
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingProjects = await storage.getProjects();
  if (existingProjects.length === 0) {
    console.log("Seeding database with initial portfolio data...");
    
    // Seed Skills
    const skillsList = [
      { name: "TensorFlow", category: "ML/AI", proficiency: 95 },
      { name: "PyTorch", category: "ML/AI", proficiency: 90 },
      { name: "Computer Vision", category: "ML/AI", proficiency: 85 },
      { name: "NLP / LLMs", category: "ML/AI", proficiency: 88 },
      { name: "Python", category: "Languages", proficiency: 98 },
      { name: "React / Three.js", category: "Frontend", proficiency: 75 },
      { name: "Docker / Kubernetes", category: "DevOps", proficiency: 80 },
    ];
    
    for (const skill of skillsList) {
      await storage.createSkill(skill);
    }

    // Seed Projects
    const projectsList = [
      {
        title: "Neural Style Transfer Engine",
        description: "A deep learning application that applies artistic styles to images using Convolutional Neural Networks (CNNs). Implements real-time style transfer on video feeds.",
        technologies: ["Python", "PyTorch", "OpenCV", "React"],
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
        projectUrl: "#",
        repoUrl: "https://github.com",
        featured: true
      },
      {
        title: "Autonomous Drone Navigation",
        description: "Reinforcement learning agent trained to navigate complex 3D environments. Utilizes PPO algorithms and Unity ML-Agents for simulation.",
        technologies: ["Reinforcement Learning", "Unity", "C#", "TensorFlow"],
        imageUrl: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=1000&auto=format&fit=crop",
        projectUrl: "#",
        repoUrl: "https://github.com",
        featured: true
      },
      {
        title: "LLM Medical Assistant",
        description: "Fine-tuned LLaMA model for medical query answering, integrated with a RAG pipeline to reference verified medical journals.",
        technologies: ["LLMs", "LangChain", "Vector DB", "FastAPI"],
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1000&auto=format&fit=crop",
        projectUrl: "#",
        repoUrl: "https://github.com",
        featured: true
      }
    ];

    for (const project of projectsList) {
      await storage.createProject(project);
    }

    // Seed Education
    const eduList = [
      {
        institution: "Stanford University",
        degree: "PhD",
        field: "Artificial Intelligence",
        startYear: "2018",
        endYear: "2023",
        description: "Dissertation on 'Latent Space Optimization for Generative Models'."
      },
      {
        institution: "MIT",
        degree: "Master of Science",
        field: "Computer Science",
        startYear: "2016",
        endYear: "2018",
        description: "Focus on Computer Vision and Robotic Perception."
      }
    ];

    for (const edu of eduList) {
      await storage.createEducation(edu);
    }
    
    console.log("Database seeded successfully.");
  }
}
