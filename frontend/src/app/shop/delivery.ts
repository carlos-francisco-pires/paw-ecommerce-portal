import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = `${environment.apiUrl}/deliveries`;

  constructor(private http: HttpClient) {}

  listarMetodos() {
    return this.http.get<any>(this.apiUrl);
  }

  listarDisponiveis() {
    return this.http.get<any>(`${this.apiUrl}/disponiveis`);
  }

  aceitar(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/${id}/aceitar`, {});
  }

  entregar(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/${id}/entregar`, {});
  }

  criar(dados: any) {
    return this.http.post<any>(this.apiUrl, dados);
  }

  editar(id: string, dados: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dados);
  }

  apagar(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  verMinhaAtual() {
    return this.http.get<any>(`${this.apiUrl}/minha-atual`);
  }
}
