import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="container">
        <div class="nav-content">
          <a href="#home" class="logo">Gaurav Subedi</a>
          
          <button class="menu-toggle" (click)="toggleMenu()" [class.active]="isMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul class="nav-menu" [class.active]="isMenuOpen">
            <li><a href="#home" (click)="closeMenu()">Home</a></li>
            <li><a href="#about" (click)="closeMenu()">About</a></li>
            <li><a href="#skills" (click)="closeMenu()">Skills</a></li>
            <li><a href="#projects" (click)="closeMenu()">Projects</a></li>
            <li><a href="#experience" (click)="closeMenu()">Experience</a></li>
            <li><a href="#contact" (click)="closeMenu()">Contact</a></li>
            <!-- <li><a routerLink="/admin/login" (click)="closeMenu()">Admin Login</a></li> -->
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: transparent;
      padding: 1.25rem 0;
      transition: all 0.3s ease;
    }
    .navbar.scrolled {
      background: rgba(10, 10, 11, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-color);
      padding: 0.85rem 0;
    }
    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 1.6rem;
      font-weight: 700;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .nav-menu {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .nav-menu a {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      position: relative;
    }
    .nav-menu a:hover {
      color: var(--text-primary);
    }
    .nav-menu a::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--accent-gradient);
      transition: width 0.3s ease;
    }
    .nav-menu a:hover::after {
      width: 100%;
    }
    .menu-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }
    .menu-toggle span {
      width: 24px;
      height: 2px;
      background: var(--text-primary);
      transition: all 0.3s ease;
      border-radius: 2px;
    }
    .menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    .menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    .menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
    @media (max-width: 768px) {
      .navbar {
        padding: 0.85rem 0;
      }
      .logo {
        font-size: 1.4rem;
      }
      .menu-toggle {
        display: flex;
        z-index: 1001;
      }
      .nav-menu {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100vh;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(10, 10, 11, 0.98);
        backdrop-filter: blur(10px);
        padding: 2rem;
        gap: 1.5rem;
        transform: translateX(100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
      }
      .nav-menu.active {
        transform: translateX(0);
        opacity: 1;
        visibility: visible;
      }
      .nav-menu a {
        color: var(--text-primary);
        font-size: 1.2rem;
        padding: 0.5rem 1rem;
      }
    }
    @media (max-width: 480px) {
      .navbar {
        padding: 0.65rem 0;
      }
      .logo {
        font-size: 1.25rem;
      }
      .nav-menu a {
        font-size: 1.1rem;
      }
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  isMenuOpen = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}