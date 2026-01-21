import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Experience } from '../models/experience.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/experience`;

  getAllExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(this.apiUrl);
  }

  getExperienceById(id: number): Observable<Experience> {
    return this.http.get<Experience>(`${environment.apiUrl}/admin/experience/${id}`);
  }

  createExperience(experience: Experience): Observable<Experience> {
    return this.http.post<Experience>(`${environment.apiUrl}/admin/experience`, experience);
  }

  updateExperience(id: number, experience: Experience): Observable<Experience> {
    return this.http.put<Experience>(`${environment.apiUrl}/admin/experience/${id}`, experience);
  }

  deleteExperience(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/experience/${id}`);
  }
}
