import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser to check for browser environment

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password });
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) { 
      return localStorage.getItem('token');
    }
    return null;
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) { 
      localStorage.setItem('token', token);
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
