import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
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

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="projects" id="projects">
      <div class="container">
        <h2 class="section-title">Featured Projects</h2>
        
        <div class="carousel-container">
          <!-- Navigation Arrows -->
          <button 
            class="carousel-btn prev" 
            (click)="prevSlide()"
            aria-label="Previous project">
            <i class="fas fa-chevron-left"></i>
          </button>

          <!-- Carousel Track -->
          <div class="carousel-viewport">
            <div class="carousel-track" [style.transform]="'translateX(' + translateX + 'px)'">
              @for (project of projects; track project.id; let i = $index) {
                <div 
                  class="carousel-slide"
                  [class.active]="i === currentIndex"
                  [class.prev]="i === currentIndex - 1"
                  [class.next]="i === currentIndex + 1"
                  (click)="goToSlide(i)"
                  (keydown.enter)="goToSlide(i)"
                  tabindex="0"
                  role="button"
                  [attr.aria-label]="'View project: ' + project.title">
                  <div class="project-card">
                    <div class="project-image" [style.background-image]="'url(' + project.imageUrl + ')'">
                      <div class="project-overlay">
                        <div class="project-links">
                          @if (project.demoUrl) {
                            <a [href]="project.demoUrl" target="_blank" class="project-link" title="Live Demo" (click)="$event.stopPropagation()">
                              <i class="fas fa-external-link-alt"></i>
                            </a>
                          }
                          @if (project.githubUrl) {
                            <a [href]="project.githubUrl" target="_blank" class="project-link" title="View Code" (click)="$event.stopPropagation()">
                              <i class="fab fa-github"></i>
                            </a>
                          }
                        </div>
                      </div>
                    </div>
                    <div class="project-content">
                      <h3 class="project-title">{{ project.title }}</h3>
                      <p class="project-description">{{ project.description }}</p>
                      <div class="project-tech">
                        @for (tech of project.techStack.slice(0, 4); track tech) {
                          <span class="tech-tag">{{ tech }}</span>
                        }
                        @if (project.techStack.length > 4) {
                          <span class="tech-tag more">+{{ project.techStack.length - 4 }}</span>
                        }
                      </div>
                      <button class="read-more-btn" (click)="openProjectModal(project); $event.stopPropagation()">
                        Read More <i class="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <button 
            class="carousel-btn next" 
            (click)="nextSlide()"
            aria-label="Next project">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- Dots Indicator -->
        <div class="carousel-dots">
          @for (project of projects; track project.id; let i = $index) {
            <button 
              class="dot"
              [class.active]="i === currentIndex"
              (click)="goToSlide(i)"
              [attr.aria-label]="'Go to project ' + (i + 1)">
            </button>
          }
        </div>
      </div>

      <!-- Project Detail Modal -->
      @if (selectedProject) {
        <div 
          class="modal-overlay" 
          (click)="closeProjectModal()"
          (keydown.escape)="closeProjectModal()"
          tabindex="0"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="'Project details: ' + selectedProject.title">
          <div class="modal-content" (click)="$event.stopPropagation()" (keydown)="$event.stopPropagation()" role="document">
            <button class="modal-close" (click)="closeProjectModal()" aria-label="Close modal">
              <i class="fas fa-times"></i>
            </button>
            <div class="modal-image" [style.background-image]="'url(' + selectedProject.imageUrl + ')'"></div>
            <div class="modal-body">
              <h2 class="modal-title">{{ selectedProject.title }}</h2>
              <p class="modal-description">{{ selectedProject.description }}</p>
              <div class="modal-tech">
                <h4>Technologies Used:</h4>
                <div class="tech-list">
                  @for (tech of selectedProject.techStack; track tech) {
                    <span class="tech-tag">{{ tech }}</span>
                  }
                </div>
              </div>
              <div class="modal-links">
                @if (selectedProject.demoUrl) {
                  <a [href]="selectedProject.demoUrl" target="_blank" class="modal-btn primary">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                  </a>
                }
                @if (selectedProject.githubUrl) {
                  <a [href]="selectedProject.githubUrl" target="_blank" class="modal-btn secondary">
                    <i class="fab fa-github"></i> View Code
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .projects {
      padding: 5rem 0;
      background: var(--bg-secondary);
      overflow: hidden;
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

    /* Carousel Container */
    .carousel-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 0;
    }

    /* Carousel Viewport */
    .carousel-viewport {
      overflow: visible;
      width: 100%;
      max-width: 600px;
    }
    .carousel-track {
      display: flex;
      align-items: center;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .carousel-slide {
      flex-shrink: 0;
      width: 600px;
      padding: 0 1rem;
      box-sizing: border-box;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      transform: scale(0.75);
      opacity: 0.4;
      filter: blur(3px);
      cursor: pointer;
    }
    .carousel-slide.active {
      transform: scale(1);
      opacity: 1;
      filter: blur(0);
      z-index: 10;
    }
    .carousel-slide.prev,
    .carousel-slide.next {
      opacity: 0.6;
      filter: blur(2px);
      transform: scale(0.85);
    }

    /* Project Card */
    .project-card {
      background: var(--bg-card);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }
    .carousel-slide.active .project-card {
      box-shadow: 0 25px 80px rgba(0,0,0,0.4);
    }
    .carousel-slide.active .project-card:hover {
      box-shadow: 0 30px 90px rgba(0,0,0,0.5);
      border-color: var(--accent-primary);
    }
    .project-image {
      height: 280px;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      position: relative;
    }
    .project-overlay {
      position: absolute;
      inset: 0;
      background: var(--accent-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .carousel-slide.active .project-card:hover .project-overlay {
      opacity: 1;
    }
    .project-links {
      display: flex;
      gap: 1.5rem;
    }
    .project-link {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-primary);
      font-size: 1.5rem;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .project-link:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }
    .project-content {
      padding: 1.75rem;
    }
    .project-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.6rem;
      color: var(--text-primary);
    }
    .project-description {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1.25rem;
      font-size: 0.95rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .project-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .tech-tag {
      font-size: 0.8rem;
      padding: 0.35rem 0.9rem;
      background: rgba(99, 102, 241, 0.15);
      color: var(--accent-primary);
      border-radius: 20px;
      font-weight: 500;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }
    .tech-tag.more {
      background: rgba(139, 92, 246, 0.15);
      color: var(--accent-secondary);
      border-color: rgba(139, 92, 246, 0.3);
    }

    /* Read More Button */
    .read-more-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      padding: 0.6rem 1.2rem;
      background: transparent;
      border: 1px solid var(--accent-primary);
      color: var(--accent-primary);
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .read-more-btn:hover {
      background: var(--accent-gradient);
      border-color: transparent;
      color: white;
      transform: translateX(5px);
    }
    .read-more-btn i {
      font-size: 0.8rem;
      transition: transform 0.3s ease;
    }
    .read-more-btn:hover i {
      transform: translateX(3px);
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
      backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal-content {
      background: var(--bg-card);
      border-radius: 20px;
      max-width: 700px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      border: 1px solid var(--border-color);
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    .modal-close:hover {
      background: var(--accent-primary);
      transform: rotate(90deg);
    }
    .modal-image {
      height: 250px;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      border-radius: 20px 20px 0 0;
    }
    .modal-body {
      padding: 2rem;
    }
    .modal-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }
    .modal-description {
      color: var(--text-secondary);
      line-height: 1.8;
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }
    .modal-tech h4 {
      color: var(--text-primary);
      font-size: 1rem;
      margin-bottom: 0.75rem;
    }
    .modal-tech .tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .modal-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .modal-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-size: 0.95rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .modal-btn.primary {
      background: var(--accent-gradient);
      color: white;
    }
    .modal-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
    }
    .modal-btn.secondary {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }
    .modal-btn.secondary:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }

    /* Navigation Buttons */
    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 1px solid var(--border-color);
      background: var(--bg-card);
      color: var(--text-secondary);
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 20;
    }
    .carousel-btn.prev {
      left: 20px;
    }
    .carousel-btn.next {
      right: 20px;
    }
    .carousel-btn:hover {
      background: var(--accent-gradient);
      border-color: transparent;
      color: white;
      transform: translateY(-50%) scale(1.1);
    }

    /* Dots Indicator */
    .carousel-dots {
      display: flex;
      justify-content: center;
      gap: 0.6rem;
      margin-top: 2rem;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: none;
      background: var(--border-light);
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }
    .dot:hover {
      background: var(--text-muted);
      transform: scale(1.1);
    }
    .dot.active {
      background: var(--accent-gradient);
      transform: scale(1.3);
      box-shadow: var(--shadow-glow);
    }

    /* Responsive */
    @media (max-width: 992px) {
      .carousel-viewport {
        max-width: 500px;
      }
      .carousel-slide {
        width: 500px;
      }
      .project-image {
        height: 240px;
      }
      .carousel-btn.prev {
        left: 10px;
      }
      .carousel-btn.next {
        right: 10px;
      }
    }
    @media (max-width: 768px) {
      .projects {
        padding: 3rem 0;
      }
      .section-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }
      .carousel-container {
        padding: 1rem 0;
      }
      .carousel-viewport {
        max-width: 85vw;
      }
      .carousel-slide {
        width: 85vw;
        padding: 0 0.5rem;
      }
      .carousel-slide.prev,
      .carousel-slide.next {
        transform: scale(0.8);
        opacity: 0.5;
      }
      .carousel-btn {
        width: 40px;
        height: 40px;
        font-size: 1rem;
      }
      .carousel-btn.prev {
        left: 5px;
      }
      .carousel-btn.next {
        right: 5px;
      }
      .project-image {
        height: 200px;
      }
      .project-content {
        padding: 1.25rem;
      }
      .project-title {
        font-size: 1.25rem;
      }
      .project-description {
        font-size: 0.9rem;
        -webkit-line-clamp: 2;
      }
      .carousel-dots {
        margin-top: 1.5rem;
      }
    }
    @media (max-width: 480px) {
      .projects {
        padding: 2rem 0;
      }
      .section-title {
        font-size: 1.6rem;
      }
      .section-title::after {
        width: 40px;
        height: 3px;
      }
      .carousel-viewport {
        max-width: 90vw;
      }
      .carousel-slide {
        width: 90vw;
      }
      .carousel-slide.prev,
      .carousel-slide.next {
        transform: scale(0.75);
        opacity: 0.4;
        filter: blur(3px);
      }
      .carousel-btn {
        width: 36px;
        height: 36px;
        font-size: 0.9rem;
      }
      .project-card {
        border-radius: 15px;
      }
      .project-image {
        height: 180px;
      }
      .project-content {
        padding: 1rem;
      }
      .project-title {
        font-size: 1.1rem;
      }
      .project-description {
        font-size: 0.85rem;
        margin-bottom: 1rem;
      }
      .tech-tag {
        font-size: 0.7rem;
        padding: 0.25rem 0.6rem;
      }
      .project-link {
        width: 44px;
        height: 44px;
        font-size: 1rem;
      }
      .dot {
        width: 8px;
        height: 8px;
      }
    }
  `]
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [
    {
      id: 1,
      title: 'PEMIS - Public Enterprise Management System',
      description: 'Government project for Finance Ministry enabling efficient public enterprise tracking and management. Collaborated with a team of 3 developers to build robust features including data visualization, reporting modules, and real-time budget monitoring.',
      techStack: ['Java', 'Spring Boot', 'Angular', 'MySQL', 'REST API', 'TypeScript'],
      imageUrl: '/Emblem_of_Nepal.png',
      isFeatured: true,
      displayOrder: 1
    },
    {
      id: 2,
      title: 'MoHP-NHFRS',
      description: 'Worked on Public Dashboard for Ministry of Health and Population.',
      techStack: ['Java', 'Spring Boot', 'Angular', 'MySQL', 'JPA', 'Bootstrap'],
      imageUrl: '/nepal-govt.png',
      isFeatured: true,
      displayOrder: 2
    },
    {
      id: 3,
      title: 'Banking CRUD Application',
      description: 'Internal banking application Prototype for Agricultural Development Bank. Implemented secure authentication using Spring Security, designed RESTful APIs for data operations, and built responsive JSP pages for user interactions.',
      techStack: ['Java', 'Spring Boot', 'JSP', 'MySQL', 'Spring Security', 'REST API'],
      imageUrl: '/crud.png',
      isFeatured: true,
      displayOrder: 3
    },
    {
      id: 4,
      title: 'Portfolio Website',
      description: 'Modern, responsive portfolio website using Java Spring Boot backend with JWT authentication and Angular frontend. Features admin panel for content management, contact form, project showcase with filtering, and smooth animations.',
      techStack: ['Java 21', 'Spring Boot', 'Angular 18', 'MySQL', 'Docker', 'JWT', 'Nginx'],
      imageUrl: '/portfolio.png',
      demoUrl: 'https://gauravsubedi.com',
      githubUrl: 'https://github.com/gauravsubedi191/portfolio',
      isFeatured: true,
      displayOrder: 4
    },
    {
      id: 5,
      title: 'Java API Development',
      description: 'RESTful API services built during internship at Agriculture Development Bank. Developed scalable REST APIs using Java Spring Boot framework with authentication, data validation, and error handling.',
      techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'REST API', 'Postman'],
      imageUrl: '/java.png',
      isFeatured: false,
      displayOrder: 5
    }
  ];
  
  currentIndex = 0;
  slideWidth = 600;
  selectedProject: Project | null = null;
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;

  get translateX(): number {
    // Center the active slide
    const viewportCenter = this.getViewportWidth() / 2;
    const slideCenter = this.slideWidth / 2;
    const offset = viewportCenter - slideCenter;
    return offset - (this.currentIndex * this.slideWidth);
  }

  ngOnInit(): void {
    this.updateSlideWidth();
    this.startAutoPlay();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }

  private onResize(): void {
    this.updateSlideWidth();
  }

  private updateSlideWidth(): void {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    if (width <= 480) {
      this.slideWidth = width * 0.9;
    } else if (width <= 768) {
      this.slideWidth = width * 0.85;
    } else if (width <= 992) {
      this.slideWidth = 500;
    } else {
      this.slideWidth = 600;
    }
  }

  private getViewportWidth(): number {
    if (typeof window === 'undefined') return 600;
    
    const width = window.innerWidth;
    if (width <= 480) {
      return width * 0.9;
    } else if (width <= 768) {
      return width * 0.85;
    } else if (width <= 992) {
      return 500;
    }
    return 600;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
    this.resetAutoPlay();
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
    this.resetAutoPlay();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoPlay();
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.projects.length;
    }, 5000);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  openProjectModal(project: Project): void {
    this.selectedProject = project;
    this.stopAutoPlay();
    document.body.style.overflow = 'hidden';
  }

  closeProjectModal(): void {
    this.selectedProject = null;
    this.startAutoPlay();
    document.body.style.overflow = '';
  }
}