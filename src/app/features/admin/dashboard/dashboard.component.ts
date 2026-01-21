import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ContactService } from '../../../core/services/contact.service';
import { ProjectService } from '../../../core/services/project.service';
import { SkillService } from '../../../core/services/skill.service';
import { ExperienceService } from '../../../core/services/experience.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <nav class="admin-nav">
        <div class="container">
          <div class="nav-content">
            <h2 class="admin-title">Admin Dashboard</h2>
            <div class="nav-actions">
              <a routerLink="/" class="btn-view-site">
                <i class="fas fa-external-link-alt"></i> View Site
              </a>
              <button class="btn-logout" (click)="logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="container dashboard-content">
        <div class="stats-grid">
          <div class="stat-card messages">
            <div class="stat-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="stat-info">
              <h3>{{ unreadCount }}</h3>
              <p>Unread Messages</p>
            </div>
          </div>
          <div class="stat-card projects">
            <div class="stat-icon">
              <i class="fas fa-project-diagram"></i>
            </div>
            <div class="stat-info">
              <h3>{{ projectsCount }}</h3>
              <p>Projects</p>
            </div>
          </div>
          <div class="stat-card skills">
            <div class="stat-icon">
              <i class="fas fa-code"></i>
            </div>
            <div class="stat-info">
              <h3>{{ skillsCount }}</h3>
              <p>Skills</p>
            </div>
          </div>
          <div class="stat-card experience">
            <div class="stat-icon">
              <i class="fas fa-briefcase"></i>
            </div>
            <div class="stat-info">
              <h3>{{ experienceCount }}</h3>
              <p>Experiences</p>
            </div>
          </div>
        </div>

        <h3 class="section-title">Quick Actions</h3>
        <div class="actions-grid">
          <a routerLink="/admin/profile" class="action-card">
            <i class="fas fa-user"></i>
            <h3>Edit Profile</h3>
            <p>Update your personal information</p>
          </a>
          <a routerLink="/admin/projects" class="action-card">
            <i class="fas fa-folder"></i>
            <h3>Manage Projects</h3>
            <p>Add, edit, or remove projects</p>
          </a>
          <a routerLink="/admin/skills" class="action-card">
            <i class="fas fa-cogs"></i>
            <h3>Manage Skills</h3>
            <p>Update your skill set</p>
          </a>
          <a routerLink="/admin/experience" class="action-card">
            <i class="fas fa-briefcase"></i>
            <h3>Manage Experience</h3>
            <p>Add work experience</p>
          </a>
          <a routerLink="/admin/messages" class="action-card" [class.has-unread]="unreadCount > 0">
            @if (unreadCount > 0) {
              <span class="badge">{{ unreadCount }}</span>
            }
            <i class="fas fa-comments"></i>
            <h3>View Messages</h3>
            <p>Check contact form submissions</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: var(--bg-primary);
    }
    .admin-nav {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    .admin-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary);
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .nav-actions {
      display: flex;
      gap: 0.75rem;
    }
    .btn-view-site {
      padding: 0.6rem 1.2rem;
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-view-site:hover {
      background: var(--bg-tertiary);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
    .btn-logout {
      padding: 0.6rem 1.2rem;
      background: var(--accent-gradient);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-logout:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .dashboard-content {
      padding: 2rem 0;
    }
    .section-title {
      font-size: 1.25rem;
      color: var(--text-primary);
      margin-bottom: 1.25rem;
      font-weight: 600;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2.5rem;
    }
    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      padding: 1.25rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }
    .stat-card:hover {
      border-color: var(--border-light);
      background: var(--bg-card-hover);
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon i {
      font-size: 1.3rem;
      color: white;
    }
    .stat-card.messages .stat-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }
    .stat-card.projects .stat-icon { background: var(--accent-gradient); }
    .stat-card.skills .stat-icon { background: linear-gradient(135deg, #22c55e, #16a34a); }
    .stat-card.experience .stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .stat-info h3 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      line-height: 1;
    }
    .stat-info p {
      color: var(--text-muted);
      margin: 0.25rem 0 0;
      font-size: 0.85rem;
    }
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
    .action-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      padding: 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.3s ease;
      text-align: center;
      position: relative;
    }
    .action-card:hover {
      border-color: var(--accent-primary);
      background: var(--bg-card-hover);
      transform: translateY(-4px);
      box-shadow: var(--shadow-glow);
    }
    .action-card.has-unread {
      border-color: var(--error);
    }
    .action-card .badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: var(--error);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.75rem;
    }
    .action-card i {
      font-size: 2.5rem;
      color: var(--accent-primary);
      margin-bottom: 0.75rem;
    }
    .action-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }
    .action-card p {
      color: var(--text-muted);
      margin: 0;
      font-size: 0.85rem;
    }

    /* Tablet */
    @media (max-width: 992px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Mobile */
    @media (max-width: 768px) {
      .nav-content {
        flex-wrap: wrap;
      }
      .admin-title {
        font-size: 1.25rem;
      }
      .nav-actions {
        flex: 1;
        justify-content: flex-end;
      }
      .btn-view-site span,
      .btn-logout span {
        display: none;
      }
      .btn-view-site, .btn-logout {
        padding: 0.6rem 0.8rem;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }
      .stat-card {
        padding: 1rem;
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
      }
      .stat-icon {
        width: 44px;
        height: 44px;
      }
      .stat-info h3 {
        font-size: 1.5rem;
      }
      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }
      .action-card {
        padding: 1.25rem 1rem;
      }
      .action-card i {
        font-size: 2rem;
      }
      .action-card h3 {
        font-size: 1rem;
      }
      .action-card p {
        display: none;
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .dashboard-content {
        padding: 1.5rem 0;
      }
      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
      .stat-info p {
        font-size: 0.75rem;
      }
      .actions-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private contactService = inject(ContactService);
  private projectService = inject(ProjectService);
  private skillService = inject(SkillService);
  private experienceService = inject(ExperienceService);
  private router = inject(Router);

  unreadCount = 0;
  projectsCount = 0;
  skillsCount = 0;
  experienceCount = 0;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.contactService.getUnreadCount().subscribe({
      next: data => this.unreadCount = data.count,
      error: () => this.unreadCount = 0
    });

    this.projectService.getAllProjects().subscribe({
      next: projects => this.projectsCount = projects.length,
      error: () => this.projectsCount = 0
    });

    this.skillService.getAllSkills().subscribe({
      next: skills => this.skillsCount = skills.length,
      error: () => this.skillsCount = 0
    });

    this.experienceService.getAllExperiences().subscribe({
      next: experiences => this.experienceCount = experiences.length,
      error: () => this.experienceCount = 0
    });
  }

  logout(): void {
    this.authService.logout();
  }
}