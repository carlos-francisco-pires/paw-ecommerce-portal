import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  criar(dados: any) {
    return this.http.post<any>(this.apiUrl, dados);
  }

  listarMinhas() {
    return this.http.get<any>(`${this.apiUrl}/minhas`);
  }

  verUma(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  cancelar(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  listarTodas() {
    return this.http.get<any>(this.apiUrl);
  }

  confirmar(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/${id}/confirmar`, {});
  }
}
