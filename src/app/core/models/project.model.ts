export interface Project {
    id?: number;
    title: string;
    description: string;
    detailedDescription?: string;
    techStack: string[];
    imageUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    startDate?: string;
    endDate?: string;
    isFeatured?: boolean;
    displayOrder?: number;
  }