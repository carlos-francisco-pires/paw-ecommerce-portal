import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DeliveryService } from '../../shop/delivery';

@Component({
  selector: 'app-my-deliveries',
  standalone: false,
  styleUrl: './my-deliveries.css',
  templateUrl: './my-deliveries.html',
})
export class MyDeliveries implements OnInit {
  disponiveis: any[] = [];
  entregaAtual: any = null;
  carregando = true;

  constructor(
    private delivery: DeliveryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;

    this.delivery.verMinhaAtual().subscribe({
      next: (resposta) => {
        this.entregaAtual = resposta;
        this.carregarDisponiveis();
      },
      error: (err) => {
        console.error('Erro ao carregar entrega atual', err);
        this.carregarDisponiveis();
      },
    });
  }

  carregarDisponiveis() {
    this.delivery.listarDisponiveis().subscribe({
      next: (resposta) => {
        this.disponiveis = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar entregas disponíveis', err);
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  aceitar(id: string) {
    this.delivery.aceitar(id).subscribe({
      next: () => {
        this.carregar();
      },
      error: (err) => {
        alert(err.error?.message || 'Não foi possível aceitar a entrega');
      },
    });
  }

  entregar(id: string) {
    this.delivery.entregar(id).subscribe({
      next: () => {
        this.carregar();
      },
      error: (err) => {
        alert(err.error?.message || 'Não foi possível marcar como entregue');
      },
    });
  }
}
