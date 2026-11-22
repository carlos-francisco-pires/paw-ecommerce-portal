import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComparisonService } from '../comparison';

@Component({
  selector: 'app-compare-products',
  standalone: false,
  styleUrl: './compare-products.css',
  templateUrl: './compare-products.html',
})
export class CompareProducts implements OnInit, OnDestroy {
  produtos: any[] = [];
  private subscricao!: Subscription;

  constructor(
    private comparison: ComparisonService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.subscricao = this.comparison.produtos$.subscribe((produtos) => {
      this.produtos = produtos;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscricao.unsubscribe();
  }

  remover(produtoId: string) {
    this.comparison.remover(produtoId);
  }

  limpar() {
    this.comparison.limpar();
  }
}
