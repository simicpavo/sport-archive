import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [DrawerModule, ButtonModule],
})
export class DashboardComponent {
  protected readonly router = inject(Router);
  sidebarVisible = signal(false);
}
