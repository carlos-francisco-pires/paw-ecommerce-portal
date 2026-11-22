import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: false,
  styleUrl: './cart-page.css',
  templateUrl: './cart-page.html',
})
export class CartPage implements OnInit, OnDestroy {
  itens: any[] = [];
  private subscricao!: Subscription;

  constructor(
    private cart: CartService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.subscricao = this.cart.itens$.subscribe((itensAtualizados) => {
      this.itens = itensAtualizados;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscricao.unsubscribe();
  }

  getTotal(): number {
    return this.cart.getTotal();
  }

  remover(produtoId: string) {
    this.cart.remover(produtoId);
  }

  aumentar(item: any) {
    this.cart.atualizarQuantidade(item.produtoId, item.quantidade + 1);
  }

  diminuir(item: any) {
    if (item.quantidade > 1) {
      this.cart.atualizarQuantidade(item.produtoId, item.quantidade - 1);
    }
  }
}
