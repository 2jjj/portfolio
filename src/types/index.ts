export interface ProjectMetric {
  label: string;
  value: string;
}

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
  slug?: string;
  summary?: string;
  problem?: string;
  architecture?: string;
  decisions?: string;
  results?: string;
  role?: string;
  timeline?: string;
  metrics?: ProjectMetric[];
  gallery?: string[];
  video?: string;
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
  github_url?: string;
  linkedin_url?: string;
  public_email?: string;
  site_url?: string;
  location?: string;
  availability?: string;
  resume_path?: string;
  resume_data?: ResumeData;
  resume_data_en?: ResumeData;
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
  targetRole?: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  site?: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  languages: Language[];
  certifications: Certification[];
  updatedAt?: string;
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

export type JobStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

export interface CareerLinks {
  github: string;
  linkedin: string;
  email: string;
  site: string;
  resume: string;
  location: string;
  availability: string;
}

export interface JobProjectMatch {
  title: string;
  slug: string;
  tags: string[];
  github: string;
  live: string;
  featured: number;
  matchedTags: string[];
}

export interface JobResult {
  id: string;
  source: string;
  title: string;
  company: string;
  url: string;
  applyUrl: string;
  location: string;
  remote: boolean;
  salary: string;
  tags: string[];
  description: string;
  publishedAt: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  topProjects: JobProjectMatch[];
}

export interface JobSourceStatus {
  source: string;
  ok: boolean;
  count: number;
  error?: string;
}

export interface JobSearchResponse {
  jobs: JobResult[];
  total: number;
  sources: JobSourceStatus[];
  profile: CareerLinks;
  searchedAt: string;
}

export interface SavedJob {
  id: number;
  source: string;
  external_id: string;
  title: string;
  company: string;
  url: string;
  apply_url: string;
  location: string;
  remote: boolean;
  salary: string;
  tags: string[];
  description: string;
  status: JobStatus;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  top_projects: JobProjectMatch[];
  notes: string;
  next_action_at: string | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationKit {
  links: { label: string; url: string; icon: "linkedin" | "github" | "mail" | "globe" | "file" | "search" }[];
  pitch: string;
  coverLetter: string;
  checklist: string[];
}
