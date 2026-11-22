import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../shared/dashboard';

@Component({
  selector: 'app-dashboard-estafeta',
  standalone: false,
  styleUrl: './dashboard-estafeta.css',
  templateUrl: './dashboard-estafeta.html',
})
export class DashboardEstafeta implements OnInit {
  numEntregas = 0;
  valorAReceber = 0;
  carregando = true;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.dashboardService.verEstafeta().subscribe({
      next: (resposta) => {
        this.numEntregas = resposta.numEntregas;
        this.valorAReceber = resposta.valorAReceber;
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
