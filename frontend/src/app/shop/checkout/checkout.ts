import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../cart';
import { OrderService } from '../order';
import { DeliveryService } from '../delivery';

@Component({
  selector: 'app-checkout',
  standalone: false,
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit, OnDestroy {
  itens: any[] = [];
  metodosEntrega: any[] = [];
  erro = '';
  private subscricao!: Subscription;

  checkoutForm = new FormGroup({
    metodoEntrega: new FormControl('', [Validators.required]),
  });

  constructor(
    private cart: CartService,
    private order: OrderService,
    private delivery: DeliveryService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.subscricao = this.cart.itens$.subscribe((itensAtualizados) => {
      this.itens = itensAtualizados;
      this.cdr.detectChanges();
    });

    this.delivery.listarMetodos().subscribe({
      next: (resposta) => {
        console.log('Métodos de entrega recebidos:', resposta);
        this.metodosEntrega = resposta;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar métodos de entrega', err);
      },
    });
  }

  ngOnDestroy() {
    this.subscricao.unsubscribe();
  }

  getTotalProdutos(): number {
    return this.cart.getTotal();
  }

  getCustoEntrega(): number {
    const idEscolhido = this.checkoutForm.value.metodoEntrega;
    const metodo = this.metodosEntrega.find((m) => m._id === idEscolhido);
    return metodo ? metodo.custo : 0;
  }

  finalizarCompra() {
    if (this.checkoutForm.invalid || this.itens.length === 0) {
      return;
    }

    const dados = {
      itens: this.itens.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        configuracaoEscolhida: item.configuracaoEscolhida,
      })),
      metodoEntrega: this.checkoutForm.value.metodoEntrega,
    };

    this.order.criar(dados).subscribe({
      next: () => {
        this.cart.limpar();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.erro = err.error?.message || 'Erro ao criar a encomenda';
        this.cdr.detectChanges();
      },
    });
  }
}
