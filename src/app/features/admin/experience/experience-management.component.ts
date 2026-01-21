import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExperienceService } from '../../../core/services/experience.service';
import { Experience } from '../../../core/models/experience.model';

@Component({
  selector: 'app-experience-management',
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
            <h1>Manage Experience</h1>
            <button class="btn btn-add" (click)="openModal()">
              <i class="fas fa-plus"></i> Add Experience
            </button>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="timeline">
          @for (exp of experiences; track exp.id) {
            <div class="timeline-item">
              <div class="timeline-dot" [class.current]="exp.isCurrent"></div>
              <div class="timeline-card">
                <div class="card-header">
                  <div class="header-info">
                    <h3>{{ exp.position }}</h3>
                    <p class="company">{{ exp.companyName }}</p>
                    <p class="date">
                      {{ formatDate(exp.startDate) }} - 
                      {{ exp.isCurrent ? 'Present' : formatDate(exp.endDate) }}
                    </p>
                    @if (exp.location) {
                      <p class="location">
                        <i class="fas fa-map-marker-alt"></i> {{ exp.location }}
                      </p>
                    }
                  </div>
                  <div class="card-actions">
                    <button class="btn-icon edit" (click)="editExperience(exp)" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" (click)="deleteExperience(exp)" title="Delete">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                @if (exp.description) {
                  <p class="description">{{ exp.description }}</p>
                }
                @if (exp.isCurrent) {
                  <span class="current-badge">Current Position</span>
                }
              </div>
            </div>
          }
        </div>

        @if (experiences.length === 0) {
          <div class="empty-state">
            <i class="fas fa-briefcase"></i>
            <p>No work experience added yet</p>
            <button class="btn btn-primary" (click)="openModal()">Add Your First Experience</button>
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingExperience ? 'Edit Experience' : 'Add Experience' }}</h2>
            <button class="btn-close" (click)="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form [formGroup]="experienceForm" (ngSubmit)="onSubmit()">
            <div class="modal-body">
              <div class="form-group">
                <label for="position">Position/Title *</label>
                <input type="text" id="position" formControlName="position" class="form-control"
                  placeholder="e.g., Senior Software Engineer">
              </div>

              <div class="form-group">
                <label for="companyName">Company Name *</label>
                <input type="text" id="companyName" formControlName="companyName" class="form-control">
              </div>

              <div class="form-group">
                <label for="location">Location</label>
                <input type="text" id="location" formControlName="location" class="form-control"
                  placeholder="e.g., Kathmandu, Nepal">
              </div>

              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" formControlName="description" class="form-control" rows="4"
                  placeholder="Describe your responsibilities and achievements..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="startDate">Start Date *</label>
                  <input type="date" id="startDate" formControlName="startDate" class="form-control">
                </div>
                <div class="form-group">
                  <label for="endDate">End Date</label>
                  <input type="date" id="endDate" formControlName="endDate" class="form-control"
                    [disabled]="experienceForm.get('isCurrent')?.value">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" formControlName="isCurrent">
                    <span>I currently work here</span>
                  </label>
                </div>
                <div class="form-group">
                  <label for="displayOrder">Display Order</label>
                  <input type="number" id="displayOrder" formControlName="displayOrder" class="form-control">
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="isSaving || experienceForm.invalid">
                {{ isSaving ? 'Saving...' : (editingExperience ? 'Update' : 'Add') }}
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
              <h3>Delete Experience?</h3>
              <p>Are you sure you want to delete "{{ experienceToDelete?.position }} at {{ experienceToDelete?.companyName }}"?</p>
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

    /* Timeline */
    .timeline {
      max-width: 700px;
      margin: 0 auto;
      position: relative;
      padding-left: 35px;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 12px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--accent-gradient);
      border-radius: 2px;
    }
    .timeline-item {
      position: relative;
      margin-bottom: 1.25rem;
    }
    .timeline-dot {
      position: absolute;
      left: -29px;
      top: 0;
      width: 12px;
      height: 12px;
      background: var(--accent-primary);
      border-radius: 50%;
      border: 2px solid var(--bg-primary);
      box-shadow: 0 0 0 2px var(--accent-primary);
    }
    .timeline-dot.current {
      background: var(--success);
      box-shadow: 0 0 0 2px var(--success);
    }
    .timeline-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 1.25rem;
      border-left: 3px solid var(--accent-primary);
      transition: all 0.3s;
    }
    .timeline-card:hover {
      background: var(--bg-card-hover);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    .header-info h3 {
      margin: 0 0 0.2rem;
      font-size: 1.1rem;
      color: var(--text-primary);
    }
    .company {
      color: var(--accent-primary);
      font-weight: 600;
      margin: 0 0 0.2rem;
      font-size: 0.95rem;
    }
    .date {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin: 0 0 0.2rem;
    }
    .location {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin: 0;
    }
    .location i {
      color: var(--accent-primary);
      margin-right: 0.25rem;
    }
    .description {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
      font-size: 0.9rem;
    }
    .current-badge {
      display: inline-block;
      margin-top: 0.75rem;
      padding: 0.2rem 0.6rem;
      background: rgba(34, 197, 94, 0.15);
      color: var(--success);
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .card-actions {
      display: flex;
      gap: 0.4rem;
    }
    .btn-icon {
      width: 32px;
      height: 32px;
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
      max-width: 400px;
      margin: 0 auto;
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
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border-color);
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
    .form-control:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
      .form-row { grid-template-columns: 1fr; }
      .timeline { 
        padding-left: 25px;
        max-width: 100%;
      }
      .timeline::before { left: 8px; }
      .timeline-dot { 
        left: -21px; 
        width: 10px;
        height: 10px;
      }
      .timeline-card {
        padding: 1rem;
      }
      .header-info h3 {
        font-size: 1rem;
      }
      .card-actions {
        flex-direction: column;
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .admin-header {
        padding: 0.75rem 0;
      }
    }
  `]
})
export class ExperienceManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private experienceService = inject(ExperienceService);

  experiences: Experience[] = [];
  showModal = false;
  showDeleteConfirm = false;
  editingExperience: Experience | null = null;
  experienceToDelete: Experience | null = null;
  isSaving = false;

  experienceForm: FormGroup;

  constructor() {
    this.experienceForm = this.fb.group({
      position: ['', Validators.required],
      companyName: ['', Validators.required],
      location: [''],
      description: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      isCurrent: [false],
      displayOrder: [null]
    });
  }

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.experienceService.getAllExperiences().subscribe(experiences => {
      this.experiences = experiences.sort((a, b) => {
        if (a.isCurrent && !b.isCurrent) return -1;
        if (!a.isCurrent && b.isCurrent) return 1;
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });
    });
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  openModal(experience?: Experience): void {
    this.editingExperience = experience || null;
    if (experience) {
      this.experienceForm.patchValue(experience);
    } else {
      this.experienceForm.reset({ isCurrent: false });
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingExperience = null;
    this.experienceForm.reset({ isCurrent: false });
  }

  editExperience(experience: Experience): void {
    this.openModal(experience);
  }

  deleteExperience(experience: Experience): void {
    this.experienceToDelete = experience;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.experienceToDelete?.id) {
      this.experienceService.deleteExperience(this.experienceToDelete.id).subscribe({
        next: () => {
          this.loadExperiences();
          this.showDeleteConfirm = false;
          this.experienceToDelete = null;
        },
        error: () => alert('Failed to delete experience')
      });
    }
  }

  onSubmit(): void {
    if (this.experienceForm.valid) {
      this.isSaving = true;
      const formValue = this.experienceForm.value;
      
      if (formValue.isCurrent) {
        formValue.endDate = null;
      }

      const request = this.editingExperience?.id
        ? this.experienceService.updateExperience(this.editingExperience.id, formValue)
        : this.experienceService.createExperience(formValue);

      request.subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.loadExperiences();
        },
        error: () => {
          this.isSaving = false;
          alert('Failed to save experience');
        }
      });
    }
  }
}
