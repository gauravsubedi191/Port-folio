import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SkillService } from '../../../core/services/skill.service';
import { Skill } from '../../../core/models/skill.model';

@Component({
  selector: 'app-skills-management',
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
            <h1>Manage Skills</h1>
            <button class="btn btn-add" (click)="openModal()">
              <i class="fas fa-plus"></i> Add Skill
            </button>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Skills by Category -->
        @for (category of categories; track category) {
          <div class="category-section">
            <h2 class="category-title">{{ category }}</h2>
            <div class="skills-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Proficiency</th>
                    <th>Order</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (skill of getSkillsByCategory(category); track skill.id) {
                    <tr>
                      <td>{{ skill.name }}</td>
                      <td>
                        <div class="proficiency-bar">
                          <div class="proficiency-fill" [style.width.%]="skill.proficiencyLevel"></div>
                          <span>{{ skill.proficiencyLevel }}%</span>
                        </div>
                      </td>
                      <td>{{ skill.displayOrder || '-' }}</td>
                      <td class="actions">
                        <button class="btn-icon edit" (click)="editSkill(skill)" title="Edit">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" (click)="deleteSkill(skill)" title="Delete">
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        @if (skills.length === 0) {
          <div class="empty-state">
            <i class="fas fa-code"></i>
            <p>No skills added yet</p>
            <button class="btn btn-primary" (click)="openModal()">Add Your First Skill</button>
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingSkill ? 'Edit Skill' : 'Add New Skill' }}</h2>
              <button class="btn-close" (click)="closeModal()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form [formGroup]="skillForm" (ngSubmit)="onSubmit()">
              <div class="modal-body">
                <div class="form-group">
                  <label for="name">Skill Name *</label>
                  <input type="text" id="name" formControlName="name" class="form-control"
                    placeholder="e.g., React, Java, Python">
                </div>

                <div class="form-group">
                  <label for="category">Category *</label>
                  <input type="text" id="category" formControlName="category" class="form-control"
                    placeholder="e.g., Frontend, Backend, Database" list="categoryList">
                  <datalist id="categoryList">
                    @for (cat of existingCategories; track cat) {
                      <option [value]="cat">
                    }
                  </datalist>
                </div>

                <div class="form-group">
                  <label for="proficiencyLevel">Proficiency Level: {{ skillForm.get('proficiencyLevel')?.value }}%</label>
                  <input type="range" id="proficiencyLevel" formControlName="proficiencyLevel" 
                    min="0" max="100" class="range-input">
                </div>

                <div class="form-group">
                  <label for="displayOrder">Display Order</label>
                  <input type="number" id="displayOrder" formControlName="displayOrder" class="form-control"
                    placeholder="e.g., 1, 2, 3">
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving || skillForm.invalid">
                  {{ isSaving ? 'Saving...' : (editingSkill ? 'Update' : 'Add') }}
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
              <h3>Delete Skill?</h3>
              <p>Are you sure you want to delete "{{ skillToDelete?.name }}"? This action cannot be undone.</p>
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
    .category-section {
      margin-bottom: 1.5rem;
    }
    .category-title {
      font-size: 1.1rem;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
      padding-left: 0.75rem;
      border-left: 3px solid var(--accent-primary);
    }
    .skills-table {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }
    th {
      background: var(--bg-tertiary);
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      color: var(--text-primary);
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: var(--bg-card-hover);
    }
    .proficiency-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--bg-tertiary);
      border-radius: 6px;
      height: 16px;
      position: relative;
      min-width: 120px;
    }
    .proficiency-fill {
      height: 100%;
      background: var(--accent-gradient);
      border-radius: 6px;
      position: absolute;
      left: 0;
    }
    .proficiency-bar span {
      position: relative;
      z-index: 1;
      font-size: 0.75rem;
      font-weight: 600;
      margin-left: auto;
      padding-right: 0.5rem;
      color: var(--text-primary);
    }
    .actions {
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
    }
    .empty-state i {
      font-size: 3rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }
    .empty-state p {
      color: var(--text-muted);
      margin-bottom: 1rem;
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
    .modal-body {
      padding: 1.25rem;
    }
    .modal-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
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
    .range-input {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      background: var(--bg-tertiary);
      border-radius: 3px;
      outline: none;
    }
    .range-input::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      background: var(--accent-primary);
      border-radius: 50%;
      cursor: pointer;
    }
    .btn {
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.3s;
      font-size: 0.9rem;
    }
    .btn-primary {
      background: var(--accent-gradient);
      color: white;
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
    .btn-danger {
      background: var(--error);
      color: white;
    }
    .confirm-modal {
      text-align: center;
      max-width: 360px;
    }
    .warning-icon {
      font-size: 2.5rem;
      color: var(--warning);
      margin-bottom: 0.75rem;
    }
    .confirm-modal h3 {
      margin: 0 0 0.5rem;
      color: var(--text-primary);
    }
    .confirm-modal p {
      color: var(--text-secondary);
      font-size: 0.9rem;
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
      .back-btn {
        padding: 0.4rem 0.75rem;
        font-size: 0.85rem;
      }
      .btn-add {
        margin-left: auto;
      }
      .skills-table {
        overflow-x: auto;
      }
      table {
        font-size: 0.85rem;
        min-width: 500px;
      }
      th, td {
        padding: 0.6rem 0.5rem;
      }
      .proficiency-bar {
        min-width: 80px;
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .admin-header {
        padding: 0.75rem 0;
      }
      .category-title {
        font-size: 1rem;
      }
    }
  `]
})
export class SkillsManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private skillService = inject(SkillService);

  skills: Skill[] = [];
  categories: string[] = [];
  existingCategories: string[] = [];
  showModal = false;
  showDeleteConfirm = false;
  editingSkill: Skill | null = null;
  skillToDelete: Skill | null = null;
  isSaving = false;

  skillForm: FormGroup;

  constructor() {
    this.skillForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      proficiencyLevel: [75],
      displayOrder: [null]
    });
  }

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.skillService.getAllSkills().subscribe(skills => {
      this.skills = skills;
      this.categories = [...new Set(skills.map(s => s.category))].sort();
      this.existingCategories = this.categories;
    });
  }

  getSkillsByCategory(category: string): Skill[] {
    return this.skills
      .filter(s => s.category === category)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  openModal(skill?: Skill): void {
    this.editingSkill = skill || null;
    if (skill) {
      this.skillForm.patchValue(skill);
    } else {
      this.skillForm.reset({ proficiencyLevel: 75 });
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingSkill = null;
    this.skillForm.reset({ proficiencyLevel: 75 });
  }

  editSkill(skill: Skill): void {
    this.openModal(skill);
  }

  deleteSkill(skill: Skill): void {
    this.skillToDelete = skill;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.skillToDelete?.id) {
      this.skillService.deleteSkill(this.skillToDelete.id).subscribe({
        next: () => {
          this.loadSkills();
          this.showDeleteConfirm = false;
          this.skillToDelete = null;
        },
        error: (err) => {
          alert('Failed to delete skill');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.skillForm.valid) {
      this.isSaving = true;
      const skillData = this.skillForm.value;

      const request = this.editingSkill?.id
        ? this.skillService.updateSkill(this.editingSkill.id, skillData)
        : this.skillService.createSkill(skillData);

      request.subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.loadSkills();
        },
        error: (err) => {
          this.isSaving = false;
          alert('Failed to save skill');
        }
      });
    }
  }
}
