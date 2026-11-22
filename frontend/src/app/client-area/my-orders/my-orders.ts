import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../../shop/order';

@Component({
  selector: 'app-my-orders',
  standalone: false,
  styleUrl: './my-orders.css',
  templateUrl: './my-orders.html',
})
export class MyOrders implements OnInit {
  encomendas: any[] = [];
  carregando = true;

  constructor(
    private order: OrderService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.order.listarMinhas().subscribe({
      next: (resposta) => {
        this.encomendas = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar encomendas', err);
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  podeCancel(encomenda: any): boolean {
    if (encomenda.estado === 'pendente') {
      return true;
    }

    if (encomenda.estado === 'confirmada') {
      const dezMinutosEmMs = 10 * 60 * 1000;
      const tempoPassado = Date.now() - new Date(encomenda.dataConfirmacao).getTime();
      return tempoPassado <= dezMinutosEmMs;
    }

    return false;
  }

  cancelar(id: string) {
    this.order.cancelar(id).subscribe({
      next: () => {
        this.carregar();
      },
      error: (err) => {
        alert(err.error?.message || 'Não foi possível cancelar');
      },
    });
  }
}
