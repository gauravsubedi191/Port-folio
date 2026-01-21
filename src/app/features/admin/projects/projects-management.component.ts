import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-projects-management',
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
            <h1>Manage Projects</h1>
            <button class="btn btn-add" (click)="openModal()">
              <i class="fas fa-plus"></i> Add Project
            </button>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="projects-grid">
          @for (project of projects; track project.id) {
            <div class="project-card">
              <div class="project-image" [style.background-image]="'url(' + (project.imageUrl || 'https://via.placeholder.com/400x200') + ')'">
                @if (project.isFeatured) {
                  <span class="featured-badge">
                    <i class="fas fa-star"></i> Featured
                  </span>
                }
              </div>
              <div class="project-content">
                <h3>{{ project.title }}</h3>
                <p>{{ project.description | slice:0:100 }}{{ project.description.length > 100 ? '...' : '' }}</p>
                <div class="tech-tags">
                  @for (tech of (project.techStack || []).slice(0, 3); track tech) {
                    <span class="tech-tag">{{ tech }}</span>
                  }
                  @if ((project.techStack || []).length > 3) {
                    <span class="tech-tag more">+{{ (project.techStack || []).length - 3 }}</span>
                  }
                </div>
                <div class="project-actions">
                  <button class="btn-icon edit" (click)="editProject(project)" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" (click)="deleteProject(project)" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        @if (projects.length === 0) {
          <div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <p>No projects added yet</p>
            <button class="btn btn-primary" (click)="openModal()">Add Your First Project</button>
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal large" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingProject ? 'Edit Project' : 'Add New Project' }}</h2>
              <button class="btn-close" (click)="closeModal()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
              <div class="modal-body">
                <div class="form-row">
                  <div class="form-group">
                    <label for="title">Title *</label>
                    <input type="text" id="title" formControlName="title" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="displayOrder">Display Order</label>
                    <input type="number" id="displayOrder" formControlName="displayOrder" class="form-control">
                  </div>
                </div>

                <div class="form-group">
                  <label for="description">Short Description *</label>
                  <textarea id="description" formControlName="description" class="form-control" rows="2"></textarea>
                </div>

                <div class="form-group">
                  <label for="detailedDescription">Detailed Description</label>
                  <textarea id="detailedDescription" formControlName="detailedDescription" class="form-control" rows="4"></textarea>
                </div>

                <div class="form-group">
                  <label for="techStack">Tech Stack (comma separated) *</label>
                  <input type="text" id="techStack" formControlName="techStackInput" class="form-control"
                    placeholder="React, Node.js, MongoDB">
                </div>

                <div class="form-row">
                  <div class="form-group full-width">
                    <label>Project Image</label>
                    <div class="image-upload-container">
                      <div class="image-preview-row">
                        @if (imagePreview || projectForm.get('imageUrl')?.value) {
                          <div class="project-image-preview">
                            <img [src]="imagePreview || projectForm.get('imageUrl')?.value" alt="Project preview">
                            <button type="button" class="remove-image-btn" (click)="removeProjectImage()">
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                        }
                        @if (!imagePreview && !projectForm.get('imageUrl')?.value) {
                          <div class="upload-area">
                            <input 
                              type="file" 
                              id="projectImage" 
                              accept="image/*"
                              (change)="onProjectImageSelected($event)"
                              #projectFileInput
                              hidden>
                            <div class="upload-placeholder" (click)="projectFileInput.click()">
                              <i class="fas fa-image"></i>
                              <p>Upload Image</p>
                            </div>
                          </div>
                        }
                      </div>
                      @if (!imagePreview && !projectForm.get('imageUrl')?.value) {
                        <div class="url-input-row">
                          <span class="divider">or</span>
                          <input type="url" formControlName="imageUrl" class="form-control" placeholder="Paste image URL">
                        </div>
                      }
                      @if (isUploadingImage) {
                        <div class="upload-progress">
                          <div class="progress-bar"><div class="progress-fill"></div></div>
                          <span>Uploading...</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="demoUrl">Demo URL</label>
                    <input type="url" id="demoUrl" formControlName="demoUrl" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="githubUrl">GitHub URL</label>
                    <input type="url" id="githubUrl" formControlName="githubUrl" class="form-control">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                      <input type="checkbox" formControlName="isFeatured">
                      <span>Featured Project</span>
                    </label>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="startDate">Start Date</label>
                    <input type="date" id="startDate" formControlName="startDate" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="endDate">End Date</label>
                    <input type="date" id="endDate" formControlName="endDate" class="form-control">
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving || projectForm.invalid">
                  {{ isSaving ? 'Saving...' : (editingProject ? 'Update' : 'Add') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Delete Confirmation -->
      @if (showDeleteConfirm) {
        <div class="modal-overlay" (click)="showDeleteConfirm = false">
          <div class="modal confirm-modal" (click)="$event.stopPropagation()">
            <div class="modal-body">
              <i class="fas fa-exclamation-triangle warning-icon"></i>
              <h3>Delete Project?</h3>
              <p>Are you sure you want to delete "{{ projectToDelete?.title }}"?</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="showDeleteConfirm = false">Cancel</button>
              <button class="btn btn-danger" (click)="confirmDelete()">Delete</button>
            </div>
          </div>
        </div>
      }
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
    .header-content h1 {
      margin: 0;
      flex: 1;
      font-size: 1.5rem;
      color: var(--text-primary);
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
    .btn-add {
      background: var(--accent-gradient);
      color: white;
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      transition: all 0.3s;
    }
    .btn-add:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
    }
    .project-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s;
    }
    .project-card:hover {
      border-color: var(--border-light);
      background: var(--bg-card-hover);
    }
    .project-image {
      height: 150px;
      background-size: cover;
      background-position: center;
      position: relative;
      background-color: var(--bg-tertiary);
    }
    .featured-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: var(--accent-gradient);
      color: white;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .project-content {
      padding: 1.25rem;
    }
    .project-content h3 {
      margin: 0 0 0.4rem;
      font-size: 1.1rem;
      color: var(--text-primary);
    }
    .project-content p {
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 0.75rem;
    }
    .tech-tag {
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
      background: rgba(99, 102, 241, 0.15);
      color: var(--accent-primary);
      border-radius: 4px;
    }
    .tech-tag.more {
      background: var(--bg-tertiary);
      color: var(--text-muted);
    }
    .project-actions {
      display: flex;
      gap: 0.4rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color);
    }
    .btn-icon {
      width: 34px;
      height: 34px;
      border: 1px solid var(--border-color);
      background: var(--bg-tertiary);
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      color: var(--text-secondary);
    }
    .btn-icon.edit:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
    .btn-icon.delete:hover {
      border-color: var(--error);
      color: var(--error);
    }
    .empty-state {
      text-align: center;
      padding: 3rem 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
    }
    .empty-state i {
      font-size: 3rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      width: 100%;
      max-width: 450px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal.large {
      max-width: 600px;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      background: var(--bg-secondary);
      z-index: 1;
    }
    .modal-header h2 { 
      margin: 0;
      font-size: 1.15rem;
      color: var(--text-primary);
    }
    .btn-close {
      background: none;
      border: none;
      font-size: 1.1rem;
      cursor: pointer;
      color: var(--text-muted);
    }
    .modal-body { padding: 1.25rem; }
    .modal-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      position: sticky;
      bottom: 0;
      background: var(--bg-secondary);
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .form-group { margin-bottom: 1rem; }
    label {
      display: block;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 0.4rem;
      font-size: 0.9rem;
    }
    .form-control {
      width: 100%;
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--border-color);
      background: var(--bg-tertiary);
      color: var(--text-primary);
      border-radius: 8px;
      font-size: 0.95rem;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--accent-primary);
    }
    .checkbox-group {
      display: flex;
      align-items: flex-end;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: normal;
      color: var(--text-secondary);
    }
    .checkbox-label input {
      width: 16px;
      height: 16px;
      accent-color: var(--accent-primary);
    }
    .btn {
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      font-size: 0.9rem;
    }
    .btn-primary {
      background: var(--accent-gradient);
      color: white;
    }
    .btn-primary:disabled { opacity: 0.5; }
    .btn-secondary { 
      background: var(--bg-tertiary); 
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }
    .btn-danger { background: var(--error); color: white; }
    .confirm-modal { 
      text-align: center; 
      max-width: 360px; 
    }
    .confirm-modal h3 { color: var(--text-primary); }
    .confirm-modal p { color: var(--text-secondary); font-size: 0.9rem; }
    .warning-icon { font-size: 2.5rem; color: var(--warning); margin-bottom: 0.75rem; }

    /* Image Upload */
    .image-upload-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .image-preview-row {
      display: flex;
      gap: 1rem;
    }
    .project-image-preview {
      position: relative;
      width: 200px;
      height: 120px;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid var(--border-color);
    }
    .project-image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .remove-image-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      transition: all 0.3s;
    }
    .remove-image-btn:hover {
      background: var(--error);
      transform: scale(1.1);
    }
    .upload-area {
      flex: 1;
    }
    .upload-placeholder {
      border: 2px dashed var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      background: var(--bg-tertiary);
      height: 100%;
      min-height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .upload-placeholder:hover {
      border-color: var(--accent-primary);
      background: rgba(99, 102, 241, 0.05);
    }
    .upload-placeholder i {
      font-size: 1.5rem;
      color: var(--accent-primary);
      margin-bottom: 0.5rem;
    }
    .upload-placeholder p {
      color: var(--text-secondary);
      font-weight: 500;
      margin: 0;
      font-size: 0.85rem;
    }
    .url-input-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .url-input-row .divider {
      color: var(--text-muted);
      font-size: 0.8rem;
    }
    .url-input-row .form-control {
      flex: 1;
    }
    .upload-progress {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .progress-bar {
      flex: 1;
      height: 4px;
      background: var(--bg-tertiary);
      border-radius: 2px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      width: 60%;
      background: var(--accent-gradient);
      animation: progress 1.5s ease-in-out infinite;
    }
    @keyframes progress {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 100%; }
    }
    .upload-progress span {
      color: var(--text-secondary);
      font-size: 0.8rem;
    }
    .form-group.full-width {
      grid-column: 1 / -1;
    }

    /* Tablet */
    @media (max-width: 768px) {
      .header-content {
        flex-wrap: wrap;
        gap: 0.75rem;
      }
      .header-content h1 {
        order: 3;
        width: 100%;
        font-size: 1.25rem;
      }
      .btn-add {
        margin-left: auto;
      }
      .projects-grid { 
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      .project-image {
        height: 120px;
      }
      .project-content {
        padding: 1rem;
      }
      .project-content h3 {
        font-size: 1rem;
      }
      .form-row { grid-template-columns: 1fr; }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectsManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);

  projects: Project[] = [];
  showModal = false;
  showDeleteConfirm = false;
  editingProject: Project | null = null;
  projectToDelete: Project | null = null;
  isSaving = false;
  isUploadingImage = false;
  imagePreview: string | null = null;

  projectForm: FormGroup;

  constructor() {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      detailedDescription: [''],
      techStackInput: ['', Validators.required],
      imageUrl: [''],
      demoUrl: [''],
      githubUrl: [''],
      startDate: [''],
      endDate: [''],
      isFeatured: [false],
      displayOrder: [null]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    });
  }

  openModal(project?: Project): void {
    this.editingProject = project || null;
    this.imagePreview = null;
    if (project) {
      this.projectForm.patchValue({
        ...project,
        techStackInput: project.techStack?.join(', ') || ''
      });
    } else {
      this.projectForm.reset({ isFeatured: false });
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingProject = null;
    this.imagePreview = null;
    this.projectForm.reset({ isFeatured: false });
  }

  onProjectImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Upload the file
      this.uploadProjectImage(file);
    }
  }

  uploadProjectImage(file: File): void {
    this.isUploadingImage = true;
    this.projectService.uploadProjectImage(file).subscribe({
      next: (response) => {
        this.isUploadingImage = false;
        this.projectForm.patchValue({ imageUrl: response.imageUrl });
        this.imagePreview = response.imageUrl;
      },
      error: () => {
        this.isUploadingImage = false;
        alert('Failed to upload image. Please try again.');
        this.imagePreview = null;
      }
    });
  }

  removeProjectImage(): void {
    this.imagePreview = null;
    this.projectForm.patchValue({ imageUrl: '' });
  }

  editProject(project: Project): void {
    this.openModal(project);
  }

  deleteProject(project: Project): void {
    this.projectToDelete = project;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.projectToDelete?.id) {
      this.projectService.deleteProject(this.projectToDelete.id).subscribe({
        next: () => {
          this.loadProjects();
          this.showDeleteConfirm = false;
          this.projectToDelete = null;
        },
        error: () => alert('Failed to delete project')
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isSaving = true;
      const formValue = this.projectForm.value;
      
      const projectData: Project = {
        ...formValue,
        techStack: formValue.techStackInput.split(',').map((t: string) => t.trim()).filter((t: string) => t)
      };
      delete (projectData as any).techStackInput;

      const request = this.editingProject?.id
        ? this.projectService.updateProject(this.editingProject.id, projectData)
        : this.projectService.createProject(projectData);

      request.subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.loadProjects();
        },
        error: () => {
          this.isSaving = false;
          alert('Failed to save project');
        }
      });
    }
  }
}
