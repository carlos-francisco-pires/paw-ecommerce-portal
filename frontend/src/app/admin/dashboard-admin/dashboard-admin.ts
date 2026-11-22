import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../shared/dashboard';

@Component({
  selector: 'app-dashboard-admin',
  standalone: false,
  styleUrl: './dashboard-admin.css',
  templateUrl: './dashboard-admin.html',
})
export class DashboardAdmin implements OnInit {
  numUtilizadores = 0;
  totalEncomendas = 0;
  carregando = true;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.dashboardService.verAdmin().subscribe({
      next: (resposta) => {
        this.numUtilizadores = resposta.numUtilizadores;
        this.totalEncomendas = resposta.totalEncomendas;
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
