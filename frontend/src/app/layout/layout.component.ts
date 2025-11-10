import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationSidebarComponent } from '../shared/components/navigation-sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavigationSidebarComponent],
  template: `
    <app-navigation-sidebar>
      <router-outlet />
    </app-navigation-sidebar>
  `,
})
export class LayoutComponent {}
