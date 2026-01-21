import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { AboutComponent } from './about/about.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { ExperienceComponent } from './experience/experience.component';
import { ContactComponent } from './contact/contact.component';
import { AnimatedBackgroundComponent } from "../../shared/components/animated-background/animated-background.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, AboutComponent, SkillsComponent, ProjectsComponent, ExperienceComponent, ContactComponent, AnimatedBackgroundComponent],
  template: `
    <app-animated-background />
    <app-hero />
    <app-about />
    <app-skills />
    <app-projects />
    <app-experience />
    <app-contact />
  `
})
export class HomeComponent {}
