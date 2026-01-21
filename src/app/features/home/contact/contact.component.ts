import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { fadeIn } from '../../../shared/animations/animations';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [fadeIn],
  template: `
    <section class="contact" id="contact">
      <div class="container">
        <h2 class="section-title">Get In Touch</h2>
        <div class="contact-wrapper" @fadeIn>
          <div class="contact-info">
            <div class="info-item">
              <i class="fas fa-envelope"></i>
              <div>
                <h4>Email</h4>
                <a href="mailto:gauravsubedi191&#64;gmail.com">gauravsubedi191&#64;gmail.com</a>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-phone"></i>
              <div>
                <h4>Phone</h4>
                <span>+977-9860935437</span>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <h4>Location</h4>
                <span>Panauti, Nepal</span>
              </div>
            </div>
            <div class="social-links">
              <a href="https://github.com/gauravsubedi191" target="_blank" class="social-btn">
                <i class="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/gaurav-subedi-766885270/" target="_blank" class="social-btn">
                <i class="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" formControlName="name" class="form-control"
                [class.error]="isFieldInvalid('name')">
              @if (isFieldInvalid('name')) {
                <span class="error-msg">Name is required</span>
              }
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" formControlName="email" class="form-control"
                [class.error]="isFieldInvalid('email')">
              @if (isFieldInvalid('email')) {
                <span class="error-msg">Valid email is required</span>
              }
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <input type="text" id="subject" formControlName="subject" class="form-control">
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" formControlName="message" rows="5" class="form-control"
                [class.error]="isFieldInvalid('message')"></textarea>
              @if (isFieldInvalid('message')) {
                <span class="error-msg">Message is required</span>
              }
            </div>

            <button type="submit" class="btn-submit" [disabled]="isSubmitting">
              @if (!isSubmitting) {
                <span>Send Message</span>
              } @else {
                <span>Sending...</span>
              }
            </button>

            @if (showSuccess) {
              <div class="alert alert-success">
                Thank you for your message! I'll get back to you soon.
              </div>
            }
            @if (showError) {
              <div class="alert alert-error">
                Please fill in all required fields correctly.
              </div>
            }
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact {
      padding: 5rem 0;
      background: var(--bg-secondary);
      position: relative;
    }
    .contact::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -30%;
      width: 80%;
      height: 120%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
      pointer-events: none;
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
    .contact-wrapper {
      max-width: 900px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 2rem;
    }
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.25rem;
      background: var(--bg-card);
      border-radius: 12px;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }
    .info-item:hover {
      border-color: var(--accent-primary);
      transform: translateX(5px);
    }
    .info-item i {
      font-size: 1.5rem;
      color: var(--accent-primary);
      margin-top: 0.25rem;
    }
    .info-item h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .info-item span, .info-item a {
      color: var(--text-primary);
      font-weight: 500;
      text-decoration: none;
    }
    .info-item a:hover {
      color: var(--accent-primary);
    }
    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .social-btn {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: var(--text-secondary);
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .social-btn:hover {
      background: var(--accent-gradient);
      border-color: transparent;
      color: white;
      transform: translateY(-3px);
    }
    .contact-form {
      background: var(--bg-card);
      padding: 2.5rem;
      border-radius: 20px;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-lg);
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.95rem;
    }
    .form-control {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      font-size: 1rem;
      background: var(--bg-tertiary);
      color: var(--text-primary);
      transition: all 0.3s ease;
      box-sizing: border-box;
    }
    .form-control::placeholder {
      color: var(--text-muted);
    }
    .form-control:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: var(--shadow-glow);
    }
    .form-control.error {
      border-color: var(--error);
    }
    .error-msg {
      display: block;
      color: var(--error);
      font-size: 0.85rem;
      margin-top: 0.3rem;
    }
    .btn-submit {
      width: 100%;
      padding: 1rem;
      background: var(--accent-gradient);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-submit:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: var(--shadow-glow);
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .alert {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 10px;
      text-align: center;
      font-weight: 600;
    }
    .alert-success {
      background: rgba(34, 197, 94, 0.15);
      color: var(--success);
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .alert-error {
      background: rgba(239, 68, 68, 0.15);
      color: var(--error);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    @media (max-width: 768px) {
      .contact {
        padding: 3rem 0;
      }
      .contact-wrapper {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .contact-info {
        order: 2;
      }
      .section-title {
        font-size: 2rem;
      }
      .contact-form {
        padding: 1.75rem;
        border-radius: 15px;
      }
      .form-group {
        margin-bottom: 1.25rem;
      }
      .form-control {
        padding: 0.75rem;
        font-size: 16px; /* Prevents iOS zoom on input focus */
      }
      .social-links {
        justify-content: center;
      }
    }
    @media (max-width: 480px) {
      .contact {
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
      .contact-form {
        padding: 1.25rem;
        border-radius: 12px;
      }
      .info-item {
        padding: 1rem;
      }
      .info-item i {
        font-size: 1.25rem;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      label {
        font-size: 0.9rem;
      }
      .form-control {
        padding: 0.65rem;
        border-radius: 8px;
        box-sizing: border-box;
      }
      textarea.form-control {
        min-height: 100px;
      }
      .btn-submit {
        padding: 0.875rem;
        font-size: 1rem;
      }
      .alert {
        padding: 0.75rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  contactForm: FormGroup;
  isSubmitting = false;
  showSuccess = false;
  showError = false;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.showSuccess = false;
      this.showError = false;

      // Simulate form submission (since no backend)
      setTimeout(() => {
        this.isSubmitting = false;
        this.showSuccess = true;
        this.contactForm.reset();
        setTimeout(() => this.showSuccess = false, 5000);
      }, 1000);
    } else {
      this.showError = true;
      setTimeout(() => this.showError = false, 3000);
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
}