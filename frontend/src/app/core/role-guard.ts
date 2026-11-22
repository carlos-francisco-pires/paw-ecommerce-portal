import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rolesPermitidos = route.data['roles'] as string[];
  const roleAtual = authService.getRole();

  if (authService.isLoggedIn() && roleAtual && rolesPermitidos.includes(roleAtual)) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
