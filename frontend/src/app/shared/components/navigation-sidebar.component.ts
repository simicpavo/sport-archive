import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { keycloak as keycloakInstance } from '../../keycloak';

@Component({
  selector: 'app-navigation-sidebar',
  standalone: true,
  imports: [CommonModule, DrawerModule, ButtonModule],
  templateUrl: './navigation-sidebar.component.html',
})
export class NavigationSidebarComponent {
  sidebarVisible = signal(false);
  router = inject(Router);
  keycloak = keycloakInstance;

  navigateAndClose(path: string | string[]) {
    this.sidebarVisible.set(false);
    this.router.navigate(Array.isArray(path) ? path : [path]);
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }
}
