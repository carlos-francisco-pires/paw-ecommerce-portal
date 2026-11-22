import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  verCliente() {
    return this.http.get<any>(`${this.apiUrl}/cliente`);
  }

  verLoja() {
    return this.http.get<any>(`${this.apiUrl}/loja`);
  }

  verEstafeta() {
    return this.http.get<any>(`${this.apiUrl}/estafeta`);
  }

  verAdmin() {
    return this.http.get<any>(`${this.apiUrl}/admin`);
  }
}
