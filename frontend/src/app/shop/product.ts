import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  listar(filtros: {
    search?: string;
    categoria?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    let params = new HttpParams();

    if (filtros.search) params = params.set('search', filtros.search);
    if (filtros.categoria) params = params.set('categoria', filtros.categoria);
    if (filtros.sort) params = params.set('sort', filtros.sort);
    if (filtros.page) params = params.set('page', filtros.page);
    if (filtros.limit) params = params.set('limit', filtros.limit);

    return this.http.get<any>(this.apiUrl, { params });
  }

  verUm(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  criar(dados: FormData) {
    return this.http.post<any>(this.apiUrl, dados);
  }

  editar(id: string, dados: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dados);
  }

  apagar(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
