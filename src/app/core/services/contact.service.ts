import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactMessage } from '../models/contact.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/contact`;

  sendMessage(message: ContactMessage): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(this.apiUrl, message);
  }

  getAllMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${environment.apiUrl}/admin/contact/messages`);
  }

  getUnreadMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${environment.apiUrl}/admin/contact/messages/unread`);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${environment.apiUrl}/admin/contact/messages/unread/count`);
  }

  markAsRead(id: number): Observable<ContactMessage> {
    return this.http.put<ContactMessage>(`${environment.apiUrl}/admin/contact/messages/${id}/read`, {});
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/contact/messages/${id}`);
  }
}
