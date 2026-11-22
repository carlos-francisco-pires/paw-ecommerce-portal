import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../category';

@Component({
  selector: 'app-manage-categories',
  standalone: false,
  styleUrl: './manage-categories.css',
  templateUrl: './manage-categories.html',
})
export class ManageCategories implements OnInit {
  categorias: any[] = [];
  carregando = true;
  erro = '';
  categoriaEmEdicao: any = null;

  categoriaForm = new FormGroup({
    nome: new FormControl('', [Validators.required]),
  });

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.categoryService.listar().subscribe({
      next: (resposta) => {
        this.categorias = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  guardar() {
    if (this.categoriaForm.invalid) {
      return;
    }

    if (this.categoriaEmEdicao) {
      this.categoryService.editar(this.categoriaEmEdicao._id, this.categoriaForm.value).subscribe({
        next: () => {
          this.cancelarEdicao();
          this.carregar();
        },
        error: (err) => {
          this.erro = err.error?.message || 'Erro ao editar categoria';
          this.cdr.detectChanges();
        },
      });
    } else {
      this.categoryService.criar(this.categoriaForm.value).subscribe({
        next: () => {
          this.categoriaForm.reset();
          this.carregar();
        },
        error: (err) => {
          this.erro = err.error?.message || 'Erro ao criar categoria';
          this.cdr.detectChanges();
        },
      });
    }
  }

  editar(categoria: any) {
    this.categoriaEmEdicao = categoria;
    this.categoriaForm.patchValue({ nome: categoria.nome });
  }

  cancelarEdicao() {
    this.categoriaEmEdicao = null;
    this.categoriaForm.reset();
  }

  apagar(id: string) {
    const confirmado = confirm('Tens a certeza que queres apagar esta categoria?');

    if (confirmado) {
      this.categoryService.apagar(id).subscribe({
        next: () => {
          this.carregar();
        },
        error: (err) => {
          alert(err.error?.message || 'Erro ao apagar categoria');
        },
      });
    }
  }
}
