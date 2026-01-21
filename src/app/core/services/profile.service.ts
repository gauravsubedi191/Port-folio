import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private http = inject(HttpClient);
  private apiUrl=`${environment.apiUrl}/profile`;

  getProfile(): Observable<Profile>{
    return this.http.get<Profile>(this.apiUrl);
  }

  updateProfile(profile:Profile): Observable<Profile>{
    return this.http.put<Profile>(`${environment.apiUrl}/admin/profile`, profile);
  }

  uploadProfileImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${environment.apiUrl}/admin/profile/upload-image`, formData);
  }
}
