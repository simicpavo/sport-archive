import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MediaNewsComponent } from '../../media-news/media-news.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [MediaNewsComponent],
})
export class DashboardComponent {
  protected readonly router = inject(Router);
}
