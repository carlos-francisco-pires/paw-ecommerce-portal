import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../shared/dashboard';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: false,
  styleUrl: './dashboard-cliente.css',
  templateUrl: './dashboard-cliente.html',
})
export class DashboardCliente implements OnInit {
  numEncomendas = 0;
  produtosMaisComprados: any[] = [];
  carregando = true;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.dashboardService.verCliente().subscribe({
      next: (resposta) => {
        this.numEncomendas = resposta.numEncomendas;
        this.produtosMaisComprados = resposta.produtosMaisComprados;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard', err);
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
