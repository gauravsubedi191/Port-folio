import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  animations: [fadeIn],
  template: `
    <section class="about" id="about">
      <div class="container" @fadeIn>
        <h2 class="section-title">About Me</h2>
        <div class="about-content">
          <div class="about-text">
            <p class="about-bio">{{ profile.bio }}</p>
            <div class="about-details">
              <div class="detail-item">
                <i class="fas fa-envelope"></i>
                <span>{{ profile.email }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-phone"></i>
                <span>{{ profile.phone }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ profile.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about {
      padding: 5rem 0;
      background: var(--bg-secondary);
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
    .about-text {
      max-width: 800px;
      margin: 0 auto;
    }
    .about-bio {
      font-size: 1.15rem;
      line-height: 1.8;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }
    .about-details {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      justify-content: center;
    }
    .detail-item {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.05rem;
      color: var(--text-secondary);
      padding: 1rem 1.25rem;
      background: var(--bg-card);
      border-radius: 10px;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
      max-width: 100%;
    }
    .detail-item:hover {
      border-color: var(--accent-primary);
      transform: translateX(5px);
    }
    .detail-item i {
      font-size: 1.4rem;
      color: var(--accent-primary);
      flex-shrink: 0;
    }
    .detail-item span {
      word-break: break-word;
      overflow-wrap: break-word;
    }
    @media (max-width: 768px) {
      .about {
        padding: 3rem 0;
      }
      .section-title {
        font-size: 2rem;
      }
      .about-bio {
        font-size: 1.05rem;
        line-height: 1.7;
      }
      .about-details {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
    }
    @media (max-width: 480px) {
      .about {
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
      .about-bio {
        font-size: 0.95rem;
        line-height: 1.6;
      }
      .detail-item {
        font-size: 0.95rem;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
      }
      .detail-item i {
        font-size: 1.25rem;
      }
    }
  `]
})
export class AboutComponent {
  profile = {
    fullName: 'Gaurav Subedi',
    title: 'Full Stack Developer | AI/ML Enthusiast',
    bio: 'Result-driven developer with proven experience in Java (Spring Boot) and Angular (TypeScript) framework web development. Demonstrated ability to collaborate effectively across cross-functional teams, ensuring project alignment and maintaining clear stakeholder communication. Currently expanding technical capabilities in Python to explore AI and Machine Learning solutions. Committed to delivering high-quality work while staying ahead of emerging technologies.',
    email: 'gauravsubedi191@gmail.com',
    phone: '+977-9860935437',
    location: 'Panauti, Nepal',
    githubUrl: 'https://github.com/gauravsubedi191',
    linkedinUrl: 'https://www.linkedin.com/in/gaurav-subedi-766885270/'
  };
}