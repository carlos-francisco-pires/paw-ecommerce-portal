import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DeliveryService } from '../../shop/delivery';

@Component({
  selector: 'app-manage-deliveries',
  standalone: false,
  styleUrl: './manage-deliveries.css',
  templateUrl: './manage-deliveries.html',
})
export class ManageDeliveries implements OnInit {
  metodos: any[] = [];
  carregando = true;
  erro = '';
  metodoEmEdicao: any = null;

  metodoForm = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    custo: new FormControl('', [Validators.required]),
  });

  constructor(
    private deliveryService: DeliveryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.deliveryService.listarMetodos().subscribe({
      next: (resposta) => {
        this.metodos = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar métodos de entrega', err);
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  guardar() {
    if (this.metodoForm.invalid) {
      return;
    }

    if (this.metodoEmEdicao) {
      this.deliveryService.editar(this.metodoEmEdicao._id, this.metodoForm.value).subscribe({
        next: () => {
          this.cancelarEdicao();
          this.carregar();
        },
        error: (err) => {
          this.erro = err.error?.message || 'Erro ao editar método de entrega';
          this.cdr.detectChanges();
        },
      });
    } else {
      this.deliveryService.criar(this.metodoForm.value).subscribe({
        next: () => {
          this.metodoForm.reset();
          this.carregar();
        },
        error: (err) => {
          this.erro = err.error?.message || 'Erro ao criar método de entrega';
          this.cdr.detectChanges();
        },
      });
    }
  }

  editar(metodo: any) {
    this.metodoEmEdicao = metodo;
    this.metodoForm.patchValue({ nome: metodo.nome, custo: metodo.custo });
  }

  cancelarEdicao() {
    this.metodoEmEdicao = null;
    this.metodoForm.reset();
  }

  apagar(id: string) {
    const confirmado = confirm('Tens a certeza que queres apagar este método de entrega?');

    if (confirmado) {
      this.deliveryService.apagar(id).subscribe({
        next: () => {
          this.carregar();
        },
        error: (err) => {
          alert(err.error?.message || 'Erro ao apagar método de entrega');
        },
      });
    }
  }
}
