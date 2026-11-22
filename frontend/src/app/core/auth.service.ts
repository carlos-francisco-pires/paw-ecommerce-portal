import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedInSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(this.getRole());
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credenciais: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credenciais).pipe(
      tap((resposta) => {
        localStorage.setItem('token', resposta.token);
        localStorage.setItem('role', resposta.user.role);
        this.loggedInSubject.next(true);
        this.roleSubject.next(resposta.user.role);
      }),
    );
  }

  register(dados: {
    nome: string;
    email: string;
    password: string;
    morada: string;
    telefone: string;
    role: string;
  }) {
    return this.http.post<any>(`${this.apiUrl}/register`, dados);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.loggedInSubject.next(false);
    this.roleSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  changePassword(dados: { passwordAtual: string; novaPassword: string }) {
    return this.http.patch<any>(`${this.apiUrl}/change-password`, dados);
  }
}
