import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  registerForm = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    morada: new FormControl('', [Validators.required]),
    telefone: new FormControl('', [Validators.required]),
    role: new FormControl('cliente', [Validators.required]),
  });

  erro = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const dados = {
      nome: this.registerForm.value.nome!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      morada: this.registerForm.value.morada!,
      telefone: this.registerForm.value.telefone!,
      role: this.registerForm.value.role!,
    };

    this.authService.register(dados).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.erro = err.error?.message || 'Erro ao fazer registro';
      },
    });
  }
}
