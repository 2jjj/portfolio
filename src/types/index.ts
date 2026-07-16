export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  github: string;
  live: string;
  featured: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  title: string;
  category: string;
  level: number;
  color: string;
}

export interface SiteInfo {
  about_text?: string;
  about_secondary?: string;
  hero_description?: string;
  hero_phrases?: string[];
  stats_years?: string;
  stats_projects?: string;
  stats_dedication?: string;
  skills?: Skill[];
}

export interface AboutData {
  about_text: string;
  about_secondary: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  homepage: string;
  html_url: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  archived: boolean;
  fork: boolean;
  image: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  languages: Language[];
  certifications: Certification[];
}

export interface Experience {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeSkill {
  name: string;
  category: string;
}

export interface ResumeProject {
  name: string;
  description: string;
  tech: string;
  link: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}
