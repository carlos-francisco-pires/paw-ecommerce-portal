import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: false,
  styleUrl: './change-password.css',
  templateUrl: './change-password.html',
})
export class ChangePassword {
  erro = '';
  sucesso = false;

  passwordForm = new FormGroup({
    passwordAtual: new FormControl('', [Validators.required]),
    novaPassword: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.passwordForm.invalid) {
      return;
    }

    this.authService
      .changePassword({
        passwordAtual: this.passwordForm.value.passwordAtual!,
        novaPassword: this.passwordForm.value.novaPassword!,
      })
      .subscribe({
        next: () => {
          this.sucesso = true;
          this.erro = '';
          this.passwordForm.reset();
        },
        error: (err) => {
          this.erro = err.error?.message || 'Erro ao alterar password';
          this.sucesso = false;
        },
      });
  }
}
