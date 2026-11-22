import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../admin/user';

@Component({
  selector: 'app-profile',
  standalone: false,
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  utilizador: any = null;
  carregando = true;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.userService.verMeu().subscribe({
      next: (resposta) => {
        this.utilizador = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar perfil', err);
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
