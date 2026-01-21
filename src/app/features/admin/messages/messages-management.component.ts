import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { ContactMessage } from '../../../core/models/contact.model';

@Component({
  selector: 'app-messages-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="admin-header">
        <div class="container">
          <div class="header-content">
            <a routerLink="/admin/dashboard" class="back-btn">
              <i class="fas fa-arrow-left"></i> Back to Dashboard
            </a>
            <h1>Contact Messages</h1>
            <div class="header-stats">
              <span class="stat unread">{{ unreadCount }} unread</span>
              <span class="stat total">{{ messages.length }} total</span>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Filter Tabs -->
        <div class="filter-tabs">
          <button 
            class="tab" 
            [class.active]="filter === 'all'"
            (click)="filter = 'all'">
            All Messages
          </button>
          <button 
            class="tab" 
            [class.active]="filter === 'unread'"
            (click)="filter = 'unread'">
            Unread ({{ unreadCount }})
          </button>
          <button 
            class="tab" 
            [class.active]="filter === 'read'"
            (click)="filter = 'read'">
            Read
          </button>
        </div>

        <!-- Messages List -->
        <div class="messages-list">
          @for (message of filteredMessages; track message.id) {
            <div 
              class="message-card"
              [class.unread]="!message.isRead">
              <div class="message-header">
                <div class="sender-info">
                  <div class="avatar">{{ message.name.charAt(0).toUpperCase() }}</div>
                  <div class="sender-details">
                    <h3>{{ message.name }}</h3>
                    <p class="email">{{ message.email }}</p>
                  </div>
                </div>
                <div class="message-meta">
                  <span class="date">{{ formatDate(message.createdAt) }}</span>
                  @if (!message.isRead) {
                    <span class="unread-badge">New</span>
                  }
                </div>
              </div>
              
              @if (message.subject) {
                <div class="message-subject">
                  <strong>Subject:</strong> {{ message.subject }}
                </div>
              }
              
              <div class="message-body">
                <p>{{ message.message }}</p>
              </div>

              <div class="message-actions">
                @if (!message.isRead) {
                  <button 
                    class="btn-action" 
                    (click)="markAsRead(message)">
                    <i class="fas fa-check"></i> Mark as Read
                  </button>
                }
                <a 
                  class="btn-action reply" 
                  [href]="'mailto:' + message.email + '?subject=Re: ' + (message.subject || 'Your message')">
                  <i class="fas fa-reply"></i> Reply
                </a>
                <button 
                  class="btn-action delete" 
                  (click)="deleteMessage(message)">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          }
        </div>

        @if (filteredMessages.length === 0) {
          <div class="empty-state">
            <i class="fas fa-inbox"></i>
            @if (filter === 'all') {
              <p>No messages yet</p>
            }
            @if (filter === 'unread') {
              <p>No unread messages</p>
            }
            @if (filter === 'read') {
              <p>No read messages</p>
            }
          </div>
        }
      </div>

      <!-- Delete Confirmation -->
      @if (showDeleteConfirm) {
        <div class="modal-overlay" (click)="showDeleteConfirm = false">
          <div class="modal confirm-modal" (click)="$event.stopPropagation()">
            <div class="modal-body">
              <i class="fas fa-exclamation-triangle warning-icon"></i>
              <h3>Delete Message?</h3>
              <p>Are you sure you want to delete this message from {{ messageToDelete?.name }}?</p>
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
    .header-stats {
      display: flex;
      gap: 0.75rem;
    }
    .stat {
      padding: 0.4rem 0.75rem;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .stat.unread {
      background: var(--error);
      border-color: var(--error);
      color: white;
    }

    /* Filter Tabs */
    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      background: var(--bg-card);
      padding: 0.4rem;
      border-radius: 10px;
      border: 1px solid var(--border-color);
    }
    .tab {
      flex: 1;
      padding: 0.6rem 1rem;
      border: none;
      background: transparent;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s;
      color: var(--text-muted);
    }
    .tab:hover {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
    }
    .tab.active {
      background: var(--accent-gradient);
      color: white;
    }

    /* Messages List */
    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .message-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.25rem;
      border-left: 3px solid var(--border-light);
      transition: all 0.3s;
    }
    .message-card:hover {
      background: var(--bg-card-hover);
    }
    .message-card.unread {
      border-left-color: var(--accent-primary);
      background: linear-gradient(to right, rgba(99, 102, 241, 0.05), var(--bg-card));
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    .sender-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: var(--accent-gradient);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 600;
    }
    .sender-details h3 {
      margin: 0 0 0.15rem;
      font-size: 1rem;
      color: var(--text-primary);
    }
    .email {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .message-meta {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.35rem;
    }
    .date {
      color: var(--text-muted);
      font-size: 0.8rem;
    }
    .unread-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      background: var(--accent-primary);
      color: white;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .message-subject {
      padding: 0.6rem 0.75rem;
      background: var(--bg-tertiary);
      border-radius: 6px;
      margin-bottom: 0.75rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .message-body {
      margin-bottom: 0.75rem;
    }
    .message-body p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
      font-size: 0.9rem;
    }
    .message-actions {
      display: flex;
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color);
    }
    .btn-action {
      padding: 0.4rem 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      transition: all 0.3s;
      text-decoration: none;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
    }
    .btn-action:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
    .btn-action.reply:hover {
      border-color: var(--success);
      color: var(--success);
    }
    .btn-action.delete:hover {
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
      margin: 0;
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
      max-width: 380px;
    }
    .modal-body {
      padding: 1.5rem;
      text-align: center;
    }
    .modal-footer {
      padding: 1rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: center;
      gap: 0.75rem;
    }
    .warning-icon {
      font-size: 2.5rem;
      color: var(--warning);
      margin-bottom: 0.75rem;
    }
    .confirm-modal h3 { margin: 0 0 0.5rem; color: var(--text-primary); }
    .confirm-modal p { color: var(--text-secondary); font-size: 0.9rem; }
    .btn {
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      font-size: 0.9rem;
    }
    .btn-secondary { 
      background: var(--bg-tertiary); 
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }
    .btn-danger { background: var(--error); color: white; }

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
      .header-stats {
        margin-left: auto;
      }
      .filter-tabs {
        flex-wrap: wrap;
      }
      .tab {
        flex: 1 1 calc(33% - 0.5rem);
        padding: 0.5rem;
        font-size: 0.8rem;
      }
      .message-header {
        flex-direction: column;
        gap: 0.5rem;
      }
      .message-meta {
        flex-direction: row;
        align-items: center;
        width: 100%;
        justify-content: space-between;
      }
      .message-actions {
        flex-wrap: wrap;
      }
      .btn-action {
        flex: 1;
        justify-content: center;
        min-width: calc(50% - 0.25rem);
      }
    }

    /* Small Mobile */
    @media (max-width: 480px) {
      .admin-header {
        padding: 0.75rem 0;
      }
      .header-stats {
        gap: 0.5rem;
      }
      .stat {
        padding: 0.3rem 0.5rem;
        font-size: 0.75rem;
      }
      .message-card {
        padding: 1rem;
      }
      .avatar {
        width: 36px;
        height: 36px;
        font-size: 1rem;
      }
      .sender-details h3 {
        font-size: 0.9rem;
      }
    }
  `]
})
export class MessagesManagementComponent implements OnInit {
  private contactService = inject(ContactService);

  messages: ContactMessage[] = [];
  filter: 'all' | 'unread' | 'read' = 'all';
  showDeleteConfirm = false;
  messageToDelete: ContactMessage | null = null;

  get unreadCount(): number {
    return this.messages.filter(m => !m.isRead).length;
  }

  get filteredMessages(): ContactMessage[] {
    switch (this.filter) {
      case 'unread':
        return this.messages.filter(m => !m.isRead);
      case 'read':
        return this.messages.filter(m => m.isRead);
      default:
        return this.messages;
    }
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.contactService.getAllMessages().subscribe(messages => {
      this.messages = messages.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    });
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return d.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  markAsRead(message: ContactMessage): void {
    if (message.id) {
      this.contactService.markAsRead(message.id).subscribe({
        next: () => {
          message.isRead = true;
        },
        error: () => alert('Failed to mark as read')
      });
    }
  }

  deleteMessage(message: ContactMessage): void {
    this.messageToDelete = message;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.messageToDelete?.id) {
      this.contactService.deleteMessage(this.messageToDelete.id).subscribe({
        next: () => {
          this.loadMessages();
          this.showDeleteConfirm = false;
          this.messageToDelete = null;
        },
        error: () => alert('Failed to delete message')
      });
    }
  }
}
