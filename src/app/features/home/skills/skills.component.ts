import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeIn } from '../../../shared/animations/animations';

interface Skill {
  id?: number;
  name: string;
  category: string;
  proficiencyLevel: number;
  displayOrder?: number;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  animations: [fadeIn],
  template: `
    <section class="skills" id="skills">
      <div class="container">
        <h2 class="section-title">Skills & Technologies</h2>
        
        <!-- Category Filter Tabs -->
        <div class="category-tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeCategory === 'all'"
            (click)="setActiveCategory('all')">
            All
          </button>
          @for (category of categories; track category) {
            <button 
              class="tab-btn"
              [class.active]="activeCategory === category"
              (click)="setActiveCategory(category)">
              {{ category }}
            </button>
          }
        </div>

        <!-- Skills by Category -->
        <div class="skills-container" @fadeIn>
          @if (activeCategory === 'all') {
            @for (category of categories; track category) {
              <div class="category-section">
                <h3 class="category-title">
                  <i [class]="getCategoryIcon(category)"></i>
                  {{ category }}
                </h3>
                <div class="skills-tags">
                  @for (skill of getSkillsByCategory(category); track skill.name) {
                    <span 
                      class="skill-tag"
                      [title]="'Proficiency: ' + skill.proficiencyLevel + '%'">
                      {{ skill.name }}
                    </span>
                  }
                </div>
              </div>
            }
          } @else {
            <div class="category-section single">
              <div class="skills-tags large">
                @for (skill of getSkillsByCategory(activeCategory); track skill.name) {
                  <span 
                    class="skill-tag"
                    [title]="'Proficiency: ' + skill.proficiencyLevel + '%'">
                    {{ skill.name }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .skills {
      padding: 5rem 0;
      background: var(--bg-primary);
    }
    .section-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 2rem;
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

    /* Category Tabs */
    .category-tabs {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 3rem;
    }
    .tab-btn {
      padding: 0.6rem 1.5rem;
      border: 1px solid var(--border-color);
      background: var(--bg-card);
      border-radius: 25px;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .tab-btn:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
    .tab-btn.active {
      background: var(--accent-gradient);
      border-color: transparent;
      color: white;
    }

    /* Skills Container */
    .skills-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    /* Category Section */
    .category-section {
      margin-bottom: 2.5rem;
      padding: 1.5rem 2rem;
      background: var(--bg-card);
      border-radius: 16px;
      border-left: 4px solid var(--accent-primary);
      border: 1px solid var(--border-color);
      border-left: 4px solid var(--accent-primary);
    }
    .category-section.single {
      border-left: none;
      background: transparent;
      padding: 0;
      border: none;
    }
    .category-section:last-child {
      margin-bottom: 0;
    }
    .category-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .category-title i {
      color: var(--accent-primary);
      font-size: 1.1rem;
    }

    /* Skill Tags */
    .skills-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }
    .skills-tags.large {
      justify-content: center;
      gap: 0.75rem;
    }
    .skill-tag {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all 0.2s ease;
      cursor: default;
    }
    .skill-tag:hover {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
      transform: translateY(-2px);
      box-shadow: var(--shadow-glow);
    }
    .skills-tags.large .skill-tag {
      padding: 0.65rem 1.25rem;
      font-size: 1rem;
      border-radius: 10px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .skills {
        padding: 3rem 0;
      }
      .section-title {
        font-size: 2rem;
        margin-bottom: 1.5rem;
      }
      .category-tabs {
        gap: 0.5rem;
        margin-bottom: 2rem;
      }
      .tab-btn {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
      }
      .category-section {
        padding: 1.25rem 1.5rem;
        margin-bottom: 1.5rem;
      }
      .category-title {
        font-size: 1.1rem;
      }
      .skill-tag {
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
      }
    }
    @media (max-width: 480px) {
      .skills {
        padding: 2rem 0;
      }
      .section-title {
        font-size: 1.6rem;
      }
      .section-title::after {
        width: 40px;
        height: 3px;
      }
      .category-tabs {
        gap: 0.4rem;
      }
      .tab-btn {
        padding: 0.4rem 0.75rem;
        font-size: 0.8rem;
        border-radius: 20px;
      }
      .category-section {
        padding: 1rem;
        border-radius: 12px;
        border-left-width: 3px;
      }
      .category-title {
        font-size: 1rem;
        gap: 0.5rem;
      }
      .skills-tags {
        gap: 0.4rem;
      }
      .skill-tag {
        padding: 0.35rem 0.65rem;
        font-size: 0.8rem;
        border-radius: 6px;
      }
    }
  `]
})
export class SkillsComponent implements OnInit {
  skills: Skill[] = [
    // Backend
    { name: 'Java', category: 'Backend', proficiencyLevel: 90, displayOrder: 1 },
    { name: 'Spring Boot', category: 'Backend', proficiencyLevel: 85, displayOrder: 2 },
    { name: 'JPA/Hibernate', category: 'Backend', proficiencyLevel: 80, displayOrder: 3 },
    { name: 'Node.js', category: 'Backend', proficiencyLevel: 70, displayOrder: 4 },
    { name: 'RESTful API', category: 'Backend', proficiencyLevel: 85, displayOrder: 5 },
    
    // Frontend
    { name: 'Angular', category: 'Frontend', proficiencyLevel: 85, displayOrder: 1 },
    { name: 'TypeScript', category: 'Frontend', proficiencyLevel: 80, displayOrder: 2 },
    { name: 'JavaScript', category: 'Frontend', proficiencyLevel: 85, displayOrder: 3 },
    { name: 'HTML/CSS', category: 'Frontend', proficiencyLevel: 90, displayOrder: 4 },
    { name: 'jQuery', category: 'Frontend', proficiencyLevel: 75, displayOrder: 5 },
    { name: 'Bootstrap', category: 'Frontend', proficiencyLevel: 80, displayOrder: 6 },
    { name: 'Responsive Design', category: 'Frontend', proficiencyLevel: 85, displayOrder: 7 },
    
    // Database
    { name: 'MySQL', category: 'Database', proficiencyLevel: 85, displayOrder: 1 },
    { name: 'PostgreSQL', category: 'Database', proficiencyLevel: 70, displayOrder: 2 },
    { name: 'Database Design', category: 'Database', proficiencyLevel: 80, displayOrder: 3 },
    
    // AI/ML
    { name: 'Python', category: 'AI/ML', proficiencyLevel: 75, displayOrder: 1 },
    { name: 'Machine Learning', category: 'AI/ML', proficiencyLevel: 60, displayOrder: 2 },
    { name: 'Data Analysis', category: 'AI/ML', proficiencyLevel: 65, displayOrder: 3 },
    { name: 'Statistical Analysis', category: 'AI/ML', proficiencyLevel: 60, displayOrder: 4 },
    
    // Tools
    { name: 'Git/GitHub', category: 'Tools', proficiencyLevel: 85, displayOrder: 1 },
    { name: 'Postman', category: 'Tools', proficiencyLevel: 80, displayOrder: 2 },
    { name: 'SDLC', category: 'Tools', proficiencyLevel: 80, displayOrder: 3 },
    { name: 'Agile Methodology', category: 'Tools', proficiencyLevel: 75, displayOrder: 4 }
  ];
  
  categories: string[] = [];
  activeCategory: string = 'all';

  ngOnInit(): void {
    this.categories = [...new Set(this.skills.map(s => s.category))].sort();
  }

  setActiveCategory(category: string): void {
    this.activeCategory = category;
  }

  getSkillsByCategory(category: string): Skill[] {
    return this.skills
      .filter(s => s.category === category)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Frontend': 'fas fa-laptop-code',
      'Backend': 'fas fa-server',
      'Database': 'fas fa-database',
      'DevOps': 'fas fa-cloud',
      'Tools': 'fas fa-tools',
      'AI/ML': 'fas fa-brain',
      'Mobile': 'fas fa-mobile-alt',
      'Languages': 'fas fa-code',
      'Frameworks': 'fas fa-layer-group',
      'Cloud': 'fas fa-cloud-upload-alt',
      'Testing': 'fas fa-vial',
      'Other': 'fas fa-puzzle-piece'
    };
    return icons[category] || 'fas fa-code';
  }
}
