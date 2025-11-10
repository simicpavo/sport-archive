import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-navigation-sidebar',
  standalone: true,
  imports: [CommonModule, DrawerModule, ButtonModule],
  template: `<div class="cms-sidebar">
    <p-drawer
      position="left"
      [modal]="true"
      [style]="{ width: '300px' }"
      [(visible)]="sidebarVisible"
    >
      <ng-template pTemplate="header">
        <span class="text-xl font-semibold">Manage</span>
      </ng-template>
      <ng-template pTemplate="content">
        <div class="flex items-center">
          <ul class="m-0 list-none p-0">
            <li class="mb-3">
              <a
                class="align-items-center border-round text-700 hover:surface-100 flex cursor-pointer p-3"
                role="button"
                tabindex="0"
                (click)="navigateAndClose('')"
                (keyup.enter)="navigateAndClose('')"
                (keyup.space)="navigateAndClose('')"
              >
                <i class="pi pi-home mr-2"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li class="mb-3">
              <a
                class="align-items-center border-round text-700 hover:surface-100 flex cursor-pointer p-3"
                role="button"
                tabindex="0"
                (click)="navigateAndClose('/cms/records')"
                (keyup.enter)="navigateAndClose('/cms/records')"
                (keyup.space)="navigateAndClose('/cms/records')"
              >
                <i class="pi pi-book mr-2"></i>
                <span>Records</span>
              </a>
            </li>
            <li class="mb-3">
              <a
                class="align-items-center border-round text-700 hover:surface-100 flex cursor-pointer p-3"
                role="button"
                tabindex="0"
                (click)="navigateAndClose('/cms/clubs')"
                (keyup.enter)="navigateAndClose('/cms/clubs')"
                (keyup.space)="navigateAndClose('/cms/clubs')"
              >
                <i class="pi pi-building mr-2"></i>
                <span>Clubs</span>
              </a>
            </li>
            <li class="mb-3">
              <a
                class="align-items-center border-round text-700 hover:surface-100 flex cursor-pointer p-3"
                role="button"
                tabindex="0"
                (click)="navigateAndClose('/cms/sports')"
                (keyup.enter)="navigateAndClose('/cms/sports')"
                (keyup.space)="navigateAndClose('/cms/sports')"
              >
                <i class="pi pi-trophy mr-2"></i>
                <span>Sports</span>
              </a>
            </li>
            <li class="mb-3">
              <a
                class="align-items-center border-round text-700 hover:surface-100 flex cursor-pointer p-3"
                role="button"
                tabindex="0"
                (click)="navigateAndClose('/cms/national-teams')"
                (keyup.enter)="navigateAndClose('/cms/national-teams')"
                (keyup.space)="navigateAndClose('/cms/national-teams')"
              >
                <i class="pi pi-flag mr-2"></i>
                <span>National Teams</span>
              </a>
            </li>
            <li class="mb-3">
              <a
                class="align-items-center border-round text-700 hover:surface-100 flex cursor-pointer p-3"
                role="button"
                tabindex="0"
                (click)="navigateAndClose('/cms/competitions')"
                (keyup.enter)="navigateAndClose('/cms/competitions')"
                (keyup.space)="navigateAndClose('/cms/competitions')"
              >
                <i class="pi pi-calendar mr-2"></i>
                <span>Competitions</span>
              </a>
            </li>
            <li class="mb-3">
              <a
                class="align-items-center border-round text-700 hover:surface-100 flex cursor-pointer p-3"
                role="button"
                tabindex="0"
                (click)="navigateAndClose('/cms/content-types')"
                (keyup.enter)="navigateAndClose('/cms/content-types')"
                (keyup.space)="navigateAndClose('/cms/content-types')"
              >
                <i class="pi pi-pen-to-square mr-2"></i>
                <span>Content Types</span>
              </a>
            </li>
            <li class="mb-3">
              <a
                class="align-items-center border-round text-700 hover:surface-100 flex cursor-pointer p-3"
                role="button"
                tabindex="0"
                (click)="navigateAndClose('/cms/media-sources')"
                (keyup.enter)="navigateAndClose('/cms/media-sources')"
                (keyup.space)="navigateAndClose('/cms/media-sources')"
              >
                <i class="pi pi-link mr-2"></i>
                <span>Media Sources</span>
              </a>
            </li>
            <li class="mb-3">
              <a
                class="align-items-center border-round text-700 hover:surface-100 flex cursor-pointer p-3"
                role="button"
                tabindex="0"
                (click)="navigateAndClose('/cms/persons')"
                (keyup.enter)="navigateAndClose('/cms/persons')"
                (keyup.space)="navigateAndClose('/cms/persons')"
              >
                <i class="pi pi-user mr-2"></i>
                <span>Persons</span>
              </a>
            </li>
          </ul>
        </div>
      </ng-template>
    </p-drawer>

    <div
      class="align-items-center surface-0 border-bottom-1 surface-border sticky top-0 z-5 flex gap-3 p-4"
    >
      <p-button
        icon="pi pi-bars"
        severity="secondary"
        [rounded]="true"
        [text]="true"
        (onClick)="sidebarVisible.set(true)"
      />
    </div>

    <div class="p-4">
      <ng-content />
    </div>
  </div>`,
})
export class NavigationSidebarComponent {
  sidebarVisible = signal(false);
  router = inject(Router);

  navigateAndClose(path: string | string[]) {
    this.sidebarVisible.set(false);
    this.router.navigate(Array.isArray(path) ? path : [path]);
  }
}
