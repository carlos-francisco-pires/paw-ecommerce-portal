import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../shared/dashboard';

@Component({
  selector: 'app-dashboard-loja',
  standalone: false,
  styleUrl: './dashboard-loja.css',
  templateUrl: './dashboard-loja.html',
})
export class DashboardLoja implements OnInit {
  numEncomendas = 0;
  produtosMaisVendidos: any[] = [];
  carregando = true;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.dashboardService.verLoja().subscribe({
      next: (resposta) => {
        this.numEncomendas = resposta.numEncomendas;
        this.produtosMaisVendidos = resposta.produtosMaisVendidos;
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
