import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="brand-name">Gaurav Subedi</span>
            <p class="copyright">© {{ currentYear }} All rights reserved.</p>
          </div>
          <div class="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
          <div class="footer-social">
            <a href="https://github.com/gauravsubedi191" target="_blank" title="GitHub">
              <i class="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/gaurav-subedi-766885270/" target="_blank" title="LinkedIn">
              <i class="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      padding: 2rem 0;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .brand-name {
      font-size: 1.25rem;
      font-weight: 700;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .copyright {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .footer-links {
      display: flex;
      gap: 2rem;
    }
    .footer-links a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s ease;
      font-size: 0.9rem;
    }
    .footer-links a:hover {
      color: var(--accent-primary);
    }
    .footer-social {
      display: flex;
      gap: 1rem;
    }
    .footer-social a {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      font-size: 1.1rem;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .footer-social a:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      transform: translateY(-2px);
    }
    @media (max-width: 768px) {
      .footer {
        padding: 1.5rem 0;
      }
      .footer-content {
        flex-direction: column;
        text-align: center;
      }
      .footer-brand {
        align-items: center;
      }
      .footer-links {
        gap: 1.5rem;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
    @media (max-width: 480px) {
      .footer {
        padding: 1.25rem 0;
      }
      .copyright {
        font-size: 0.85rem;
      }
      .footer-links {
        gap: 1rem;
      }
      .footer-links a {
        font-size: 0.875rem;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}