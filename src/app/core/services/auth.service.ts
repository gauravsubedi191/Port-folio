import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/contact.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http= inject(HttpClient);
  private router= inject(Router);
  private tokenKey='auth_token';
  private userKey='user_data';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(credentials : LoginRequest):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((response:any) => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify({
          username:response.username,
          email:response.email
        }));
        this.isAuthenticatedSubject.next(true);
      }));
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated():boolean{
    return this.hasToken();
  }

  private hasToken(): boolean{
    return !!localStorage.getItem(this.tokenKey);
  }
}
