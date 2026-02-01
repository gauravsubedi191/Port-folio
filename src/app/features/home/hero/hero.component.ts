import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  animations: [fadeIn],
  template: `
    <section class="hero" id="home">
      <div class="container" @fadeIn>
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
                Hi, I'm <span class="highlight">Gaurav Subedi</span>
            </h1>
            <h2 class="hero-subtitle">{{ profile.title }}</h2>
            <p class="hero-bio">{{ profile.bio }}</p>
            <div class="hero-actions">
              <a [href]="profile.resumeUrl" class="btn btn-primary" target="_blank">Download Resume</a>
              <a href="#contact" class="btn btn-secondary">Get In Touch</a>
            </div>
            <div class="social-links">
              @if (profile.githubUrl) {
                <a [href]="profile.githubUrl" target="_blank" class="social-link">
                  <i class="fab fa-github"></i>
                </a>
              }
              @if (profile.linkedinUrl) {
                <a [href]="profile.linkedinUrl" target="_blank" class="social-link">
                  <i class="fab fa-linkedin"></i>
                </a>
              }
            </div>
          </div>
          <div class="hero-image">
            <img [src]="profile.profileImageUrl" [alt]="profile.fullName">
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      background: var(--bg-primary);
      position: relative;
      overflow: hidden;
      padding: 2rem 0;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -30%;
      width: 80%;
      height: 120%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
      animation: slideInLeft 0.8s ease-out;
    }
    .hero-title .highlight {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-subtitle {
      font-size: 1.75rem;
      font-weight: 400;
      margin-bottom: 1.25rem;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-bio {
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 2rem;
      color: var(--text-secondary);
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .btn {
      padding: 0.85rem 1.75rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-block;
      font-size: 0.95rem;
    }
    .btn-primary {
      background: var(--accent-gradient);
      color: white;
    }
    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: var(--shadow-glow);
    }
    .btn-secondary {
      background: transparent;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }
    .btn-secondary:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
    .social-links {
      display: flex;
      gap: 0.75rem;
    }
    .social-link {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: var(--text-secondary);
      transition: all 0.3s ease;
    }
    .social-link:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      transform: translateY(-3px);
    }
    .hero-image {
      display: flex;
      justify-content: center;
    }
    .hero-image img {
      width: 350px;
      height: 350px;
      border-radius: 20px;
      object-fit: cover;
      border: 2px solid var(--border-color);
      box-shadow: var(--shadow-lg);
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    @media (max-width: 992px) {
      .hero-content {
        gap: 2rem;
      }
      .hero-title {
        font-size: 2.75rem;
      }
      .hero-image img {
        width: 280px;
        height: 280px;
      }
    }
    @media (max-width: 768px) {
      .hero {
        min-height: auto;
        padding: 5rem 0 3rem;
      }
      .hero-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }
      .hero-text {
        order: 2;
      }
      .hero-image {
        order: 1;
      }
      .hero-title {
        font-size: 2rem;
      }
      .hero-subtitle {
        font-size: 1.25rem;
      }
      .hero-bio {
        font-size: 0.95rem;
      }
      .hero-actions {
        justify-content: center;
        flex-direction: column;
        align-items: center;
      }
      .btn {
        padding: 0.75rem 1.5rem;
        width: 100%;
        max-width: 260px;
        text-align: center;
      }
      .social-links {
        justify-content: center;
      }
      .hero-image img {
        width: 180px;
        height: 180px;
        border-radius: 16px;
      }
    }
    @media (max-width: 480px) {
      .hero {
        padding: 5rem 0 2rem;
      }
      .hero-title {
        font-size: 1.8rem;
      }
      .hero-subtitle {
        font-size: 1.1rem;
      }
      .hero-bio {
        font-size: 0.9rem;
        line-height: 1.6;
      }
      .hero-image img {
        width: 160px;
        height: 160px;
      }
      .social-link {
        width: 44px;
        height: 44px;
        font-size: 1.25rem;
      }
    }
  `]
})
export class HeroComponent {
  profile = {
    fullName: 'Gaurav Subedi',
    title: 'Full Stack Developer | AI/ML Enthusiast',
    bio: 'Result-driven developer with proven experience in Java (Spring Boot) and Angular (TypeScript) framework web development. Committed to delivering high-quality work while staying ahead of emerging technologies.',
    email: 'gauravsubedi191@gmail.com',
    phone: '+977-9860935437',
    location: 'Panauti, Nepal',
    githubUrl: 'https://github.com/gauravsubedi191',
    linkedinUrl: 'https://www.linkedin.com/in/gaurav-subedi-766885270/',
    resumeUrl: 'assets/resume.pdf',
    profileImageUrl: 'assets/profile.png'
  };
}