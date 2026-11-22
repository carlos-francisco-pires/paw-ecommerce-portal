import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../../shop/order';

@Component({
  selector: 'app-manage-orders',
  standalone: false,
  styleUrl: './manage-orders.css',
  templateUrl: './manage-orders.html',
})
export class ManageOrders implements OnInit {
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
    this.order.listarTodas().subscribe({
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

  confirmar(id: string) {
    this.order.confirmar(id).subscribe({
      next: () => {
        this.carregar();
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao confirmar encomenda');
      },
    });
  }
}
