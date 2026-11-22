import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product';
import { CartService } from '../cart';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  styleUrl: './product-detail.css',
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  produto: any = null;
  carregando = true;
  adicionado = false;

  imagemAtual = '';

  configuracaoEscolhida: { [nomeOpcao: string]: string } = {};
  precoFinal = 0;

  constructor(
    private route: ActivatedRoute,
    private product: ProductService,
    private cart: CartService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.product.verUm(id).subscribe({
        next: (resposta) => {
          this.produto = resposta;

          this.imagemAtual = resposta.imagemDestaque;

          this.precoFinal = resposta.preco;

          this.carregando = false;

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Erro ao carregar produto', err);

          this.carregando = false;

          this.cdr.detectChanges();
        },
      });
    } else {
      this.carregando = false;
    }
  }

  selecionarImagem(imagem: string) {
    this.imagemAtual = imagem;
  }

  aoEscolherOpcao(nomeOpcao: string, valorEscolhido: string) {
    this.configuracaoEscolhida[nomeOpcao] = valorEscolhido;

    this.recalcularPreco();
  }

  recalcularPreco() {
    let preco = this.produto.preco;

    for (const opcao of this.produto.opcoesConfiguracao) {
      const valorEscolhido = this.configuracaoEscolhida[opcao.nome];

      if (valorEscolhido) {
        const valor = opcao.valores.find((v: any) => v.nome === valorEscolhido);

        if (valor) {
          preco += valor.precoExtra;
        }
      }
    }

    this.precoFinal = preco;

    this.cdr.detectChanges();
  }

  adicionarAoCarrinho() {
    const configuracaoParaEnviar = Object.keys(this.configuracaoEscolhida).map((nomeOpcao) => ({
      nome: nomeOpcao,
      valorEscolhido: this.configuracaoEscolhida[nomeOpcao],
    }));

    this.cart.adicionar({
      produtoId: this.produto._id,

      nome: this.produto.nome,

      preco: this.precoFinal,

      quantidade: 1,

      configuracaoEscolhida: configuracaoParaEnviar,
    });

    this.adicionado = true;

    setTimeout(() => {
      this.adicionado = false;

      this.cdr.detectChanges();
    }, 2000);
  }
}
