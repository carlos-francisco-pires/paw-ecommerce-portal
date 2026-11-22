import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ProductService } from '../product';
import { CategoryService } from '../../admin/category';
import { ComparisonService } from '../comparison';

@Component({
  selector: 'app-home',
  standalone: false,
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  produtos: any[] = [];
  categorias: any[] = [];
  carregando = true;

  search = '';
  categoriaSelecionada = '';
  sort = '';

  paginaAtual = 1;
  totalPaginas = 1;
  limite = 6;

  constructor(
    public authService: AuthService,
    private product: ProductService,
    private categoryService: CategoryService,
    public comparison: ComparisonService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarCategorias();
    this.carregarProdutos();
  }

  carregarCategorias() {
    this.categoryService.listar().subscribe({
      next: (resposta) => {
        this.categorias = resposta;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar categorias', err),
    });
  }

  carregarProdutos() {
    this.carregando = true;

    this.product
      .listar({
        search: this.search || undefined,
        categoria: this.categoriaSelecionada || undefined,
        sort: this.sort || undefined,
        page: this.paginaAtual,
        limit: this.limite,
      })
      .subscribe({
        next: (resposta) => {
          this.produtos = resposta.produtos;
          this.totalPaginas = resposta.totalPaginas;
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao carregar produtos', err);
          this.carregando = false;
          this.cdr.detectChanges();
        },
      });
  }

  aoMudarFiltros() {
    this.paginaAtual = 1;
    this.carregarProdutos();
  }

  irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      this.carregarProdutos();
    }
  }

  aoComparar(produto: any, evento: Event) {
    evento.stopPropagation();

    const resultado = this.comparison.adicionar(produto);
    alert(resultado.mensagem);
  }
}
