import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AnimatedBackgroundComponent } from './shared/components/animated-background/animated-background.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, AnimatedBackgroundComponent],
  template: `
    <div class="app">
      @if (!isAdminRoute()) {
        <app-animated-background />
        <app-navbar />
      }
      <main>
        <router-outlet />
      </main>
      @if (!isAdminRoute()) {
        <app-footer />
      }
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    main {
      flex: 1;
    }
  `]
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private router: Router) {}

  isAdminRoute(): boolean {
    return this.router.url.includes('/admin');
  }
}
