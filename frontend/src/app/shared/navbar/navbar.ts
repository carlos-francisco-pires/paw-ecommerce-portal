import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../shop/cart';
import { StoreService } from '../../admin/store';

@Component({
  selector: 'app-navbar',
  standalone: false,
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit, OnDestroy {
  totalItensCarrinho = 0;
  estaLogado = false;
  roleAtual: string | null = null;
  logotipoLoja = '';
  nomeLoja = 'Loja PAW';

  private subscricaoCarrinho!: Subscription;
  private subscricaoLogin!: Subscription;
  private subscricaoRole!: Subscription;

  constructor(
    public authService: AuthService,
    private cart: CartService,
    private storeService: StoreService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.subscricaoCarrinho = this.cart.itens$.subscribe((itens) => {
      this.totalItensCarrinho = itens.reduce((soma, item) => soma + item.quantidade, 0);
      this.cdr.detectChanges();
    });

    this.subscricaoLogin = this.authService.loggedIn$.subscribe((estado) => {
      this.estaLogado = estado;
      this.cdr.detectChanges();
    });

    this.subscricaoRole = this.authService.role$.subscribe((role) => {
      this.roleAtual = role;
      this.cdr.detectChanges();
    });

    this.storeService.ver().subscribe({
      next: (resposta) => {
        if (resposta) {
          this.logotipoLoja = resposta.logotipo || '';
          this.nomeLoja = resposta.nome || 'Loja PAW';
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar dados da loja', err),
    });
  }

  ngOnDestroy() {
    this.subscricaoCarrinho.unsubscribe();
    this.subscricaoLogin.unsubscribe();
    this.subscricaoRole.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
