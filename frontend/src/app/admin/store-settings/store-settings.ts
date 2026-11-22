import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StoreService } from '../store';

@Component({
  selector: 'app-store-settings',
  standalone: false,
  styleUrl: './store-settings.css',
  templateUrl: './store-settings.html',
})
export class StoreSettings implements OnInit {
  carregando = true;
  sucesso = false;
  erro = '';
  logotipoAtual = '';
  logotipoSelecionado: File | null = null;

  storeForm = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    horarioFuncionamento: new FormControl(''),
  });

  constructor(
    private storeService: StoreService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.storeService.ver().subscribe({
      next: (resposta) => {
        if (resposta) {
          this.storeForm.patchValue({
            nome: resposta.nome,
            horarioFuncionamento: resposta.horarioFuncionamento,
          });
          this.logotipoAtual = resposta.logotipo || '';
        }
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar dados da loja', err);
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  aoEscolherLogotipo(evento: Event) {
    const input = evento.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.logotipoSelecionado = input.files[0];
    }
  }

  guardar() {
    if (this.storeForm.invalid) {
      return;
    }

    const dados = new FormData();
    dados.append('nome', this.storeForm.value.nome!);
    dados.append('horarioFuncionamento', this.storeForm.value.horarioFuncionamento || '');

    if (this.logotipoSelecionado) {
      dados.append('logotipo', this.logotipoSelecionado);
    }

    this.storeService.atualizar(dados).subscribe({
      next: (resposta) => {
        this.sucesso = true;
        this.logotipoAtual = resposta.logotipo || this.logotipoAtual;
        this.logotipoSelecionado = null;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.sucesso = false;
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (err) => {
        this.erro = err.error?.message || 'Erro ao guardar dados da loja';
        this.cdr.detectChanges();
      },
    });
  }
}
