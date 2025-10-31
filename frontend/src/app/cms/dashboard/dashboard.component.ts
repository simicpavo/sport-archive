import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MediaNewsComponent } from '../../media-news/media-news.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [DrawerModule, ButtonModule, MediaNewsComponent],
})
export class DashboardComponent {
  protected readonly router = inject(Router);
  sidebarVisible = signal(false);
}
