import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { keycloak } from '../keycloak';

@Injectable({ providedIn: 'root' })
export class CmsAuthGuard implements CanActivate {
  private readonly router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (keycloak.authenticated === true) {
      return true;
    }
    return this.router.parseUrl('/');
  }
}
