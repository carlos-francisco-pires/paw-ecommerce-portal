import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ItemCarrinho {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  configuracaoEscolhida: any[];
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itensSubject = new BehaviorSubject<ItemCarrinho[]>(this.carregarDoStorage());
  itens$ = this.itensSubject.asObservable();

  private carregarDoStorage(): ItemCarrinho[] {
    const guardado = localStorage.getItem('carrinho');
    return guardado ? JSON.parse(guardado) : [];
  }

  private guardarNoStorage(itens: ItemCarrinho[]) {
    localStorage.setItem('carrinho', JSON.stringify(itens));
  }

  limpar() {
    this.itensSubject.next([]);
    this.guardarNoStorage([]);
  }

  remover(produtoId: string) {
    const itensAtuais = this.itensSubject.value;
    const novosItens = itensAtuais.filter((item) => item.produtoId !== produtoId);

    this.itensSubject.next(novosItens);
    this.guardarNoStorage(novosItens);
  }

  atualizarQuantidade(produtoId: string, novaQuantidade: number) {
    const itensAtuais = this.itensSubject.value;
    const novosItens = itensAtuais.map((item) => {
      if (item.produtoId === produtoId) {
        return { ...item, quantidade: novaQuantidade };
      } else {
        return item;
      }
    });

    this.itensSubject.next(novosItens);
    this.guardarNoStorage(novosItens);
  }

  adicionar(novoItem: ItemCarrinho) {
    const itensAtuais = this.itensSubject.value;

    const itemExistente = itensAtuais.find((item) => item.produtoId === novoItem.produtoId);

    let novosItens;

    if (itemExistente) {
      novosItens = itensAtuais.map((item) => {
        if (item.produtoId === novoItem.produtoId) {
          return { ...item, quantidade: item.quantidade + novoItem.quantidade };
        } else {
          return item;
        }
      });
    } else {
      novosItens = [...itensAtuais, novoItem];
    }

    this.itensSubject.next(novosItens);
    this.guardarNoStorage(novosItens);
  }

  getTotal(): number {
    const itensAtuais = this.itensSubject.value;
    let total = 0;

    for (const item of itensAtuais) {
      total += item.preco * item.quantidade;
    }
    return total;
  }
}
