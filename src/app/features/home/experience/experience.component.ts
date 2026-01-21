import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeIn } from '../../../shared/animations/animations';

interface Experience {
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

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  animations: [fadeIn],
  template: `
    <section class="experience" id="experience">
      <div class="container">
        <h2 class="section-title">Work Experience</h2>
        <div class="timeline" @fadeIn>
          @for (exp of experiences; track exp.id) {
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="exp-header">
                  <h3 class="exp-position">{{ exp.position }}</h3>
                  <span class="exp-date">
                    {{ formatDate(exp.startDate) }} - {{ exp.isCurrent ? 'Present' : formatDate(exp.endDate) }}
                  </span>
                </div>
                <h4 class="exp-company">{{ exp.companyName }}</h4>
                @if (exp.location) {
                  <p class="exp-location">
                    <i class="fas fa-map-marker-alt"></i> {{ exp.location }}
                  </p>
                }
                <p class="exp-description">{{ exp.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .experience {
      padding: 5rem 0;
      background: var(--bg-primary);
    }
    .section-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 3rem;
      color: var(--text-primary);
      position: relative;
    }
    .section-title::after {
      content: '';
      display: block;
      width: 60px;
      height: 4px;
      background: var(--accent-gradient);
      margin: 1rem auto 0;
      border-radius: 2px;
    }
    .timeline {
      max-width: 900px;
      margin: 0 auto;
      position: relative;
      padding-left: 50px;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--accent-gradient);
      border-radius: 2px;
    }
    .timeline-item {
      position: relative;
      margin-bottom: 3rem;
    }
    .timeline-dot {
      position: absolute;
      left: -40px;
      top: 0;
      width: 20px;
      height: 20px;
      background: var(--accent-primary);
      border-radius: 50%;
      border: 4px solid var(--bg-primary);
      box-shadow: 0 0 0 3px var(--accent-primary);
    }
    .timeline-content {
      background: var(--bg-card);
      padding: 2rem;
      border-radius: 15px;
      border: 1px solid var(--border-color);
      border-left: 4px solid var(--accent-primary);
      transition: all 0.3s ease;
    }
    .timeline-content:hover {
      transform: translateX(10px);
      box-shadow: var(--shadow-glow);
      border-color: var(--accent-primary);
    }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .exp-position {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .exp-date {
      font-size: 0.9rem;
      color: var(--accent-primary);
      font-weight: 600;
      padding: 0.3rem 1rem;
      background: rgba(99, 102, 241, 0.15);
      border-radius: 20px;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }
    .exp-company {
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }
    .exp-location {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }
    .exp-location i {
      color: var(--accent-primary);
      margin-right: 0.3rem;
    }
    .exp-description {
      color: var(--text-secondary);
      line-height: 1.7;
    }
    @media (max-width: 768px) {
      .experience {
        padding: 3rem 0;
      }
      .section-title {
        font-size: 2rem;
      }
      .timeline {
        padding-left: 30px;
      }
      .timeline::before {
        left: 10px;
      }
      .timeline-dot {
        left: -30px;
        width: 16px;
        height: 16px;
        border-width: 3px;
      }
      .timeline-content {
        padding: 1.5rem;
      }
      .exp-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      .exp-position {
        font-size: 1.25rem;
      }
      .exp-company {
        font-size: 1.1rem;
      }
    }
    @media (max-width: 480px) {
      .experience {
        padding: 2rem 0;
      }
      .section-title {
        font-size: 1.6rem;
        margin-bottom: 2rem;
      }
      .section-title::after {
        width: 40px;
        height: 3px;
      }
      .timeline {
        padding-left: 25px;
      }
      .timeline::before {
        left: 8px;
        width: 2px;
      }
      .timeline-dot {
        left: -25px;
        width: 14px;
        height: 14px;
        border-width: 2px;
      }
      .timeline-item {
        margin-bottom: 2rem;
      }
      .timeline-content {
        padding: 1rem;
        border-left-width: 3px;
      }
      .timeline-content:hover {
        transform: translateX(5px);
      }
      .exp-position {
        font-size: 1.1rem;
      }
      .exp-date {
        font-size: 0.8rem;
        padding: 0.2rem 0.75rem;
      }
      .exp-company {
        font-size: 1rem;
      }
      .exp-location {
        font-size: 0.85rem;
      }
      .exp-description {
        font-size: 0.9rem;
        line-height: 1.6;
      }
    }
  `]
})
export class ExperienceComponent implements OnInit {
  experiences: Experience[] = [
    {
      id: 1,
      companyName: 'Saipal Technologies Pvt. Ltd.',
      position: 'Associate Developer (Full Stack)',
      description: 'Working on government projects for Finance Ministry and Ministry of Health and Population. Developing efficient software solutions by analyzing user requirements and collaborating with cross-functional teams. Mentoring junior developers and promoting best practices. Building and maintaining applications using Java Spring Boot backend and Angular frontend with MySQL database.',
      startDate: '2024-09-01',
      endDate: '2025-09-30',
      isCurrent: false,
      location: 'Kathmandu, Nepal',
      displayOrder: 1
    },
    {
      id: 2,
      companyName: 'Amnil Technologies Ltd.',
      position: 'Node.js Intern',
      description: 'Gained hands-on experience with Node.js and NestJS framework. Developed RESTful APIs and worked with modern JavaScript development practices. Utilized Postman for API testing and documentation. Collaborated remotely with development team to deliver project requirements.',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      isCurrent: false,
      location: 'Lalitpur, Nepal (Remote)',
      displayOrder: 2
    },
    {
      id: 3,
      companyName: 'Agricultural Development Bank Ltd.',
      position: 'Java Developer - Full Stack Intern',
      description: 'Developed and maintained Java applications using Spring Boot framework. Built CRUD operations for banking operations, implemented Spring Security for authentication, and created RESTful APIs. Worked with JSP for frontend views and MySQL for database management.',
      startDate: '2023-03-01',
      endDate: '2023-06-30',
      isCurrent: false,
      location: 'Kathmandu, Nepal',
      displayOrder: 3
    }
  ];

  ngOnInit(): void {
    // Sort experiences by displayOrder
    this.experiences.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}