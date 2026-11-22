import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../user';

@Component({
  selector: 'app-manage-users',
  standalone: false,
  styleUrl: './manage-users.css',
  templateUrl: './manage-users.html',
})
export class ManageUsers implements OnInit {
  utilizadores: any[] = [];
  carregando = true;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.userService.listar().subscribe({
      next: (resposta) => {
        this.utilizadores = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar utilizadores', err);
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  aprovar(id: string) {
    this.userService.aprovar(id).subscribe({
      next: () => {
        this.carregar();
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao aprovar estafeta');
      },
    });
  }
}
