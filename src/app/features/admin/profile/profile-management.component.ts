import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../core/models/profile.model';

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="admin-header">
        <div class="container">
          <div class="header-content">
            <a routerLink="/admin/dashboard" class="back-btn">
              <i class="fas fa-arrow-left"></i> Back to Dashboard
            </a>
            <h1>Edit Profile</h1>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="form-container">
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <div class="form-group">
                <label for="fullName">Full Name *</label>
                <input type="text" id="fullName" formControlName="fullName" class="form-control">
              </div>

              <div class="form-group">
                <label for="title">Title/Role *</label>
                <input type="text" id="title" formControlName="title" class="form-control" 
                  placeholder="e.g., Full Stack Developer">
              </div>

              <div class="form-group full-width">
                <label for="bio">Bio *</label>
                <textarea id="bio" formControlName="bio" class="form-control" rows="4"></textarea>
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" formControlName="email" class="form-control">
              </div>

              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" formControlName="phone" class="form-control">
              </div>

              <div class="form-group">
                <label for="location">Location</label>
                <input type="text" id="location" formControlName="location" class="form-control"
                  placeholder="e.g., Kathmandu, Nepal">
              </div>

              <div class="form-group full-width">
                <label>Profile Image</label>
                <div class="image-upload-container">
                  @if (imagePreview || profileForm.get('profileImageUrl')?.value) {
                    <div class="image-preview">
                      <img [src]="imagePreview || profileForm.get('profileImageUrl')?.value" alt="Profile preview">
                      <button type="button" class="remove-image-btn" (click)="removeImage()">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  }
                  @if (!imagePreview && !profileForm.get('profileImageUrl')?.value) {
                    <div class="upload-area">
                      <input 
                        type="file" 
                        id="profileImage" 
                        accept="image/*"
                        (change)="onFileSelected($event)"
                        #fileInput
                        hidden>
                      <div class="upload-placeholder" (click)="fileInput.click()">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Click to upload image</p>
                        <span>PNG, JPG up to 5MB</span>
                      </div>
                    </div>
                  }
                  @if (!imagePreview && !profileForm.get('profileImageUrl')?.value) {
                    <div class="upload-actions">
                      <span class="divider">or</span>
                      <input 
                        type="url" 
                        formControlName="profileImageUrl" 
                        class="form-control url-input"
                        placeholder="Enter image URL">
                    </div>
                  }
                  @if (isUploading) {
                    <div class="upload-progress">
                      <div class="progress-bar">
                        <div class="progress-fill"></div>
                      </div>
                      <span>Uploading...</span>
                    </div>
                  }
                </div>
              </div>

              <div class="form-group">
                <label for="githubUrl">GitHub URL</label>
                <input type="url" id="githubUrl" formControlName="githubUrl" class="form-control">
              </div>

              <div class="form-group">
                <label for="linkedinUrl">LinkedIn URL</label>
                <input type="url" id="linkedinUrl" formControlName="linkedinUrl" class="form-control">
              </div>

              <div class="form-group full-width">
                <label for="resumeUrl">Resume URL</label>
                <input type="url" id="resumeUrl" formControlName="resumeUrl" class="form-control">
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" routerLink="/admin/dashboard">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="isSaving">
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>

            @if (showSuccess) {
              <div class="alert alert-success">
                Profile updated successfully!
              </div>
            }
            @if (errorMessage) {
              <div class="alert alert-error">
                {{ errorMessage }}
              </div>
            }
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      min-height: 100vh;
      background: var(--bg-primary);
    }
    .admin-header {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 0;
      margin-bottom: 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .back-btn {
      color: var(--text-secondary);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s;
    }
    .back-btn:hover {
      background: var(--bg-tertiary);
      color: var(--accent-primary);
    }
    .header-content h1 {
      margin: 0;
      font-size: 1.5rem;
      color: var(--text-primary);
    }
    .form-container {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto 2rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .form-group.full-width {
      grid-column: 1 / -1;
    }
    label {
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 0.4rem;
      font-size: 0.9rem;
    }
    .form-control {
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--border-color);
      background: var(--bg-tertiary);
      color: var(--text-primary);
      border-radius: 8px;
      font-size: 0.95rem;
      transition: border-color 0.3s;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--accent-primary);
    }
    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }
    .btn {
      padding: 0.6rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
      font-size: 0.9rem;
    }
    .btn-primary {
      background: var(--accent-gradient);
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-secondary {
      background: var(--bg-tertiary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }
    .btn-secondary:hover {
      border-color: var(--border-light);
    }
    .alert {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      text-align: center;
      font-size: 0.9rem;
    }
    .alert-success {
      background: rgba(34, 197, 94, 0.15);
      color: var(--success);
      border: 1px solid var(--success);
    }
    .alert-error {
      background: rgba(239, 68, 68, 0.15);
      color: var(--error);
      border: 1px solid var(--error);
    }

    /* Image Upload */
    .image-upload-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .image-preview {
      position: relative;
      width: 150px;
      height: 150px;
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid var(--border-color);
    }
    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .remove-image-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      transition: all 0.3s;
    }
    .remove-image-btn:hover {
      background: var(--error);
      transform: scale(1.1);
    }
    .upload-area {
      width: 100%;
    }
    .upload-placeholder {
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      background: var(--bg-tertiary);
    }
    .upload-placeholder:hover {
      border-color: var(--accent-primary);
      background: rgba(99, 102, 241, 0.05);
    }
    .upload-placeholder i {
      font-size: 2.5rem;
      color: var(--accent-primary);
      margin-bottom: 0.75rem;
    }
    .upload-placeholder p {
      color: var(--text-primary);
      font-weight: 500;
      margin: 0 0 0.25rem;
    }
    .upload-placeholder span {
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .upload-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .divider {
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .url-input {
      flex: 1;
    }
    .upload-progress {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .progress-bar {
      flex: 1;
      height: 6px;
      background: var(--bg-tertiary);
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      width: 60%;
      background: var(--accent-gradient);
      border-radius: 3px;
      animation: progress 1.5s ease-in-out infinite;
    }
    @keyframes progress {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 100%; }
    }
    .upload-progress span {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }

    /* Tablet */
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .header-content {
        flex-wrap: wrap;
        gap: 0.75rem;
      }
      .header-content h1 {
        order: 3;
        width: 100%;
        font-size: 1.25rem;
      }
      .form-container {
        padding: 1.25rem;
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .admin-header {
        padding: 0.75rem 0;
      }
      .form-container {
        padding: 1rem;
      }
      .form-actions {
        flex-direction: column;
      }
      .btn {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class ProfileManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  profileForm: FormGroup;
  isSaving = false;
  isUploading = false;
  showSuccess = false;
  errorMessage = '';
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      title: ['', Validators.required],
      bio: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      githubUrl: [''],
      linkedinUrl: [''],
      resumeUrl: [''],
      profileImageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load profile';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 5MB';
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select an image file';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Upload the file
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    this.isUploading = true;
    this.profileService.uploadProfileImage(file).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.profileForm.patchValue({ profileImageUrl: response.imageUrl });
        this.imagePreview = response.imageUrl;
        this.selectedFile = null;
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = 'Failed to upload image. Please try again.';
        this.imagePreview = null;
        this.selectedFile = null;
      }
    });
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.profileForm.patchValue({ profileImageUrl: '' });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;
      this.showSuccess = false;
      this.errorMessage = '';

      this.profileService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          this.isSaving = false;
          this.showSuccess = true;
          setTimeout(() => this.showSuccess = false, 3000);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.error?.message || 'Failed to update profile';
        }
      });
    }
  }
}
