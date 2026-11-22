import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../shop/product';
import { CategoryService } from '../category';

@Component({
  selector: 'app-manage-products',
  standalone: false,
  styleUrl: './manage-products.css',
  templateUrl: './manage-products.html',
})
export class ManageProducts implements OnInit {
  produtos: any[] = [];
  categorias: any[] = [];
  carregando = true;
  erro = '';
  imagemSelecionada: File | null = null;
  imagensAdicionaisSelecionadas: File[] = [];
  opcoesConfiguracao: { nome: string; valores: { nome: string; precoExtra: number }[] }[] = [];
  produtoEmEdicao: any = null;

  produtoForm = new FormGroup({
    ean: new FormControl('', [Validators.required]),
    nome: new FormControl('', [Validators.required]),
    descricao: new FormControl('', [Validators.required]),
    categoria: new FormControl('', [Validators.required]),
    preco: new FormControl('', [Validators.required]),
    stock: new FormControl('', [Validators.required]),
    configuravel: new FormControl(false),
  });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarProdutos();
    this.carregarCategorias();
  }

  carregarProdutos() {
    this.carregando = true;
    this.productService.listar({}).subscribe({
      next: (resposta) => {
        this.produtos = resposta.produtos;
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

  carregarCategorias() {
    this.categoryService.listar().subscribe({
      next: (resposta) => {
        this.categorias = resposta;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
      },
    });
  }

  aoEscolherImagem(evento: Event) {
    const input = evento.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagemSelecionada = input.files[0];
    }
  }

  aoEscolherImagensAdicionais(evento: Event) {
    const input = evento.target as HTMLInputElement;
    if (input.files) {
      this.imagensAdicionaisSelecionadas = Array.from(input.files);
    }
  }

  guardar() {
    if (this.produtoForm.invalid) {
      return;
    }

    if (this.produtoEmEdicao) {
      const dadosEdicao = {
        ...this.produtoForm.value,
        opcoesConfiguracao: this.opcoesConfiguracao,
      };

      this.productService.editar(this.produtoEmEdicao._id, dadosEdicao).subscribe({
        next: () => {
          this.cancelarEdicao();
          this.carregarProdutos();
        },
        error: (err) => {
          this.erro = err.error?.message || 'Erro ao editar produto';
          this.cdr.detectChanges();
        },
      });
    } else {
      const dados = new FormData();
      dados.append('ean', this.produtoForm.value.ean!);
      dados.append('nome', this.produtoForm.value.nome!);
      dados.append('descricao', this.produtoForm.value.descricao!);
      dados.append('categoria', this.produtoForm.value.categoria!);
      dados.append('preco', this.produtoForm.value.preco!);
      dados.append('stock', this.produtoForm.value.stock!);
      dados.append('configuravel', String(this.produtoForm.value.configuravel));

      if (this.produtoForm.value.configuravel) {
        dados.append('opcoesConfiguracao', JSON.stringify(this.opcoesConfiguracao));
      }

      if (this.imagemSelecionada) {
        dados.append('imagemDestaque', this.imagemSelecionada);
      }

      for (const imagem of this.imagensAdicionaisSelecionadas) {
        dados.append('imagensAdicionais', imagem);
      }

      this.productService.criar(dados).subscribe({
        next: () => {
          this.produtoForm.reset({ configuravel: false });
          this.imagemSelecionada = null;
          this.imagensAdicionaisSelecionadas = [];
          this.opcoesConfiguracao = [];
          this.carregarProdutos();
        },
        error: (err) => {
          this.erro = err.error?.message || 'Erro ao criar produto';
          this.cdr.detectChanges();
        },
      });
    }
  }

  editar(produto: any) {
    this.produtoEmEdicao = produto;
    this.opcoesConfiguracao = produto.opcoesConfiguracao || [];

    this.produtoForm.patchValue({
      ean: produto.ean,
      nome: produto.nome,
      descricao: produto.descricao,
      categoria: produto.categoria?._id || produto.categoria,
      preco: produto.preco,
      stock: produto.stock,
      configuravel: produto.configuravel,
    });
  }

  cancelarEdicao() {
    this.produtoEmEdicao = null;
    this.opcoesConfiguracao = [];
    this.produtoForm.reset({ configuravel: false });
  }

  apagar(id: string) {
    const confirmado = confirm('Tens a certeza que queres apagar este produto?');

    if (confirmado) {
      this.productService.apagar(id).subscribe({
        next: () => {
          this.carregarProdutos();
        },
        error: (err) => {
          alert(err.error?.message || 'Erro ao apagar produto');
        },
      });
    }
  }

  adicionarOpcao() {
    this.opcoesConfiguracao.push({ nome: '', valores: [] });
  }

  removerOpcao(index: number) {
    this.opcoesConfiguracao.splice(index, 1);
  }

  adicionarValor(indexOpcao: number) {
    this.opcoesConfiguracao[indexOpcao].valores.push({ nome: '', precoExtra: 0 });
  }

  removerValor(indexOpcao: number, indexValor: number) {
    this.opcoesConfiguracao[indexOpcao].valores.splice(indexValor, 1);
  }
}
