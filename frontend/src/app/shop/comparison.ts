import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComparisonService {
  private produtosSubject = new BehaviorSubject<any[]>([]);
  produtos$ = this.produtosSubject.asObservable();

  adicionar(produto: any): { sucesso: boolean; mensagem: string } {
    const atuais = this.produtosSubject.value;

    if (atuais.some((p) => p._id === produto._id)) {
      return { sucesso: false, mensagem: 'Este produto já está na comparação' };
    }

    if (atuais.length >= 5) {
      return { sucesso: false, mensagem: 'Só podes comparar até 5 produtos' };
    }

    if (atuais.length > 0 && atuais[0].categoria?._id !== produto.categoria?._id) {
      return { sucesso: false, mensagem: 'Só podes comparar produtos da mesma categoria' };
    }

    this.produtosSubject.next([...atuais, produto]);
    return { sucesso: true, mensagem: 'Produto adicionado à comparação' };
  }

  remover(produtoId: string) {
    const novosProdutos = this.produtosSubject.value.filter((p) => p._id !== produtoId);
    this.produtosSubject.next(novosProdutos);
  }

  limpar() {
    this.produtosSubject.next([]);
  }
}
