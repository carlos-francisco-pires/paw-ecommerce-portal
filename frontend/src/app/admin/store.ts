import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private apiUrl = `${environment.apiUrl}/store`;

  constructor(private http: HttpClient) {}

  ver() {
    return this.http.get<any>(this.apiUrl);
  }

  atualizar(dados: FormData) {
    return this.http.put<any>(this.apiUrl, dados);
  }
}
