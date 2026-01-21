export interface Experience {
    id?: number;
    companyName: string;
    position: string;
    description?: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    location?: string;
    displayOrder?: number;
  }