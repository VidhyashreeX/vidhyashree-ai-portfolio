import { db } from "./db";
import {
  projects,
  skills,
  messages,
  education,
  type Project,
  type InsertProject,
  type Skill,
  type InsertSkill,
  type Message,
  type InsertMessage,
  type Education,
  type InsertEducation
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Skills
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;

  // Education
  getEducation(): Promise<Education[]>;
  createEducation(edu: InsertEducation): Promise<Education>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(desc(skills.proficiency));
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [skill] = await db.insert(skills).values(insertSkill).returning();
    return skill;
  }

  // Education
  async getEducation(): Promise<Education[]> {
    return await db.select().from(education).orderBy(desc(education.startYear));
  }

  async createEducation(insertEdu: InsertEducation): Promise<Education> {
    const [edu] = await db.insert(education).values(insertEdu).returning();
    return edu;
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
