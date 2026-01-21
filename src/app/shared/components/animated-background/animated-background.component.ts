import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy, NgZone, Renderer2, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  icon: string;
  rotation: number;
  rotationSpeed: number;
  element?: HTMLElement;
}

@Component({
  selector: 'app-animated-background',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animated-bg">
      <!-- Neural Network Canvas -->
      <canvas #networkCanvas class="network-canvas"></canvas>
      
      <!-- Floating Tech Icons Container -->
      <div #iconsContainer class="floating-icons"></div>
      
      <!-- Gradient Orbs -->
      <div class="gradient-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
      
      <!-- Grid Pattern -->
      <div class="grid-pattern"></div>
    </div>
  `,
  styles: [`
    .animated-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      overflow: hidden;
      background: var(--bg-primary);
    }

    .network-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.4;
    }

    .floating-icons {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .floating-icon {
      position: absolute;
      font-size: 1.5rem;
      color: var(--accent-primary);
      opacity: 0.15;
      filter: drop-shadow(0 0 10px var(--accent-glow));
      will-change: transform;
    }

    .floating-icon i {
      display: block;
    }

    .gradient-orbs {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      animation: float 20s ease-in-out infinite;
    }

    .orb-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
      top: -200px;
      right: -200px;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
      bottom: -150px;
      left: -150px;
      animation-delay: -7s;
    }

    .orb-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: -14s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(30px, -30px) scale(1.05);
      }
      50% {
        transform: translate(-20px, 20px) scale(0.95);
      }
      75% {
        transform: translate(-30px, -20px) scale(1.02);
      }
    }

    .grid-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
    }

    @media (max-width: 768px) {
      .orb-1 {
        width: 400px;
        height: 400px;
      }
      .orb-2 {
        width: 350px;
        height: 350px;
      }
      .orb-3 {
        width: 300px;
        height: 300px;
      }
      .floating-icon {
        font-size: 1.2rem;
      }
    }
  `]
})
export class AnimatedBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('networkCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('iconsContainer', { static: true }) iconsContainerRef!: ElementRef<HTMLDivElement>;
  
  private particles: Particle[] = [];
  private animationId = 0;
  private ctx!: CanvasRenderingContext2D;
  private nodes: { x: number; y: number; vx: number; vy: number }[] = [];
  private resizeListener?: () => void;
  
  private readonly ngZone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  
  // Tech-related icons for floating particles
  private techIcons = [
    'fab fa-java',           // Java
    'fab fa-angular',        // Angular
    'fab fa-python',         // Python (ML/AI)
    'fas fa-brain',          // AI/ML
    'fas fa-robot',          // AI
    'fas fa-network-wired',  // Neural Network
    'fas fa-microchip',      // Deep Learning
    'fas fa-database',       // Data
    'fas fa-code',           // Code
    'fas fa-cogs',           // Engineering
    'fas fa-chart-line',     // Analytics
    'fas fa-cube',           // 3D/Models
    'fab fa-docker',         // Docker
    'fab fa-git-alt',        // Git
    'fas fa-terminal',       // Terminal
    'fas fa-layer-group',    // Layers (Neural Networks)
  ];

  ngAfterViewInit(): void {
    // Only run in browser environment (not during SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    this.initParticles();
    this.initCanvas();
    
    // Run animation outside Angular zone to prevent change detection
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Clean up resize listener
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    
    // Clean up particle elements
    this.particles.forEach(p => {
      if (p.element && p.element.parentNode) {
        p.element.parentNode.removeChild(p.element);
      }
    });
    this.particles = [];
  }

  private initParticles(): void {
    const container = this.iconsContainerRef.nativeElement;
    const particleCount = window.innerWidth < 768 ? 12 : 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle: Particle = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 0.8 + Math.random() * 0.6,
        opacity: 0.1 + Math.random() * 0.15,
        icon: this.techIcons[Math.floor(Math.random() * this.techIcons.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5
      };

      // Create DOM element for particle
      const div = this.renderer.createElement('div');
      this.renderer.addClass(div, 'floating-icon');
      
      const icon = this.renderer.createElement('i');
      particle.icon.split(' ').forEach(cls => this.renderer.addClass(icon, cls));
      
      this.renderer.appendChild(div, icon);
      this.renderer.appendChild(container, div);
      
      particle.element = div;
      this.particles.push(particle);
      
      // Set initial position
      this.updateParticleElement(particle);
    }
  }

  private updateParticleElement(particle: Particle): void {
    if (particle.element) {
      particle.element.style.left = `${particle.x}px`;
      particle.element.style.top = `${particle.y}px`;
      particle.element.style.opacity = `${particle.opacity}`;
      particle.element.style.transform = `rotate(${particle.rotation}deg) scale(${particle.size})`;
    }
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const context = canvas.getContext('2d');
    if (!context) {
      console.warn('Canvas 2D context not available');
      return;
    }
    this.ctx = context;
    
    // Initialize neural network nodes
    const nodeCount = window.innerWidth < 768 ? 30 : 50;
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8
      });
    }

    // Handle resize with proper cleanup
    this.resizeListener = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', this.resizeListener);
  }

  private animate = (): void => {
    this.updateParticles();
    this.drawNetwork();
    this.animationId = requestAnimationFrame(this.animate);
  }

  private updateParticles(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      // Wrap around screen
      if (p.x < -50) p.x = width + 50;
      if (p.x > width + 50) p.x = -50;
      if (p.y < -50) p.y = height + 50;
      if (p.y > height + 50) p.y = -50;

      // Update DOM element directly (outside Angular)
      this.updateParticleElement(p);
    });
  }

  private drawNetwork(): void {
    if (!this.ctx) return;
    
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw nodes
    this.nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      
      // Bounce off edges
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      
      // Keep nodes in bounds
      node.x = Math.max(0, Math.min(canvas.width, node.x));
      node.y = Math.max(0, Math.min(canvas.height, node.y));
      
      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.fill();
    });
    
    // Draw connections
    const connectionDistance = window.innerWidth < 768 ? 100 : 150;
    
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }
}
