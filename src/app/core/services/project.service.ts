import { inject, Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/featured`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${environment.apiUrl}/admin/projects`, project);
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${environment.apiUrl}/admin/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/projects/${id}`);
  }

  uploadProjectImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${environment.apiUrl}/admin/projects/upload-image`, formData);
  }
}
