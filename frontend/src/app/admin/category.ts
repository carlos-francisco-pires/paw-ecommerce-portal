import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<any>(this.apiUrl);
  }

  verUma(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
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
}
