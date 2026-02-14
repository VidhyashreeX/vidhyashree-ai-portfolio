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
} from "../shared/schema";
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
    return await db!.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db!
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db!
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return await db!.select().from(skills).orderBy(desc(skills.proficiency));
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [skill] = await db!
      .insert(skills)
      .values(insertSkill)
      .returning();
    return skill;
  }

  // Education
  async getEducation(): Promise<Education[]> {
    return await db!
      .select()
      .from(education)
      .orderBy(desc(education.startYear));
  }

  async createEducation(insertEdu: InsertEducation): Promise<Education> {
    const [edu] = await db!
      .insert(education)
      .values(insertEdu)
      .returning();
    return edu;
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db!
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }
}

class MemoryStorage implements IStorage {
  private projects: Project[] = [];
  private skills: Skill[] = [];
  private education: Education[] = [];
  private messages: Message[] = [];

  private projectId = 1;
  private skillId = 1;
  private educationId = 1;
  private messageId = 1;

  async getProjects(): Promise<Project[]> {
    return [...this.projects].sort(
      (a, b) =>
        (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.find((project) => project.id === id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const project: Project = {
      id: this.projectId++,
      createdAt: new Date(),
      featured: insertProject.featured ?? false,
      projectUrl: insertProject.projectUrl ?? null,
      repoUrl: insertProject.repoUrl ?? null,
      ...insertProject,
    };
    this.projects.push(project);
    return project;
  }

  async getSkills(): Promise<Skill[]> {
    return [...this.skills].sort((a, b) => b.proficiency - a.proficiency);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const skill: Skill = {
      id: this.skillId++,
      ...insertSkill,
    };
    this.skills.push(skill);
    return skill;
  }

  async getEducation(): Promise<Education[]> {
    return [...this.education].sort(
      (a, b) => Number(b.startYear) - Number(a.startYear),
    );
  }

  async createEducation(insertEdu: InsertEducation): Promise<Education> {
    const edu: Education = {
      id: this.educationId++,
      endYear: insertEdu.endYear ?? null,
      description: insertEdu.description ?? null,
      ...insertEdu,
    };
    this.education.push(edu);
    return edu;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.messageId++,
      createdAt: new Date(),
      ...insertMessage,
    };
    this.messages.push(message);
    return message;
  }
}

export const storage: IStorage = db ? new DatabaseStorage() : new MemoryStorage();
