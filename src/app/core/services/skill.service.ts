import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Skill } from '../models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/skills`;

  getAllSkills(): Observable<Skill[]>{
    return this.http.get<Skill[]>(this.apiUrl);
  }

  getSkillsByCategory(category:string): Observable<Skill[]>{
    return this.http.get<Skill[]>(`${this.apiUrl}/category/${category}`);
  }

  getSkillsById(id:number): Observable<Skill>{
    return this.http.get<Skill>(`${environment.apiUrl}/admin/skills/${id}`);
  }

  createSkill(skill:Skill):Observable<Skill>{
    return this.http.post<Skill>(`${environment.apiUrl}/admin/skills`, skill);
  }

  updateSkill(id:number, skill:Skill): Observable<Skill>{
    return this.http.put<Skill>(`${environment.apiUrl}/admin/skills/${id}`,skill);
  }

  deleteSkill(id:number): Observable<void>{
    return this.http.delete<void>(`${environment.apiUrl}/admin/skills/${id}`);
  }
}
