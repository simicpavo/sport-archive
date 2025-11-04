import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
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
        <ul class="m-0 list-none p-0">
          <li class="mb-3">
            <a
              class="align-items-center border-round text-700 hover:surface-100 flex cursor-pointer p-3"
              role="button"
              tabindex="0"
              (click)="router.navigate(['/cms/records'])"
              (keyup.enter)="router.navigate(['/cms/records'])"
              (keyup.space)="router.navigate(['/cms/records'])"
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
              (click)="router.navigate(['/cms/clubs'])"
              (keyup.enter)="router.navigate(['/cms/clubs'])"
              (keyup.space)="router.navigate(['/cms/clubs'])"
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
              (click)="router.navigate(['/cms/sports'])"
              (keyup.enter)="router.navigate(['/cms/sports'])"
              (keyup.space)="router.navigate(['/cms/sports'])"
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
              (click)="router.navigate(['/cms/national-teams'])"
              (keyup.enter)="router.navigate(['/cms/national-teams'])"
              (keyup.space)="router.navigate(['/cms/national-teams'])"
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
              (click)="router.navigate(['/cms/competitions'])"
              (keyup.enter)="router.navigate(['/cms/competitions'])"
              (keyup.space)="router.navigate(['/cms/competitions'])"
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
              (click)="router.navigate(['/cms/content-types'])"
              (keyup.enter)="router.navigate(['/cms/content-types'])"
              (keyup.space)="router.navigate(['/cms/content-types'])"
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
              (click)="router.navigate(['/cms/media-sources'])"
              (keyup.enter)="router.navigate(['/cms/media-sources'])"
              (keyup.space)="router.navigate(['/cms/media-sources'])"
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
              (click)="router.navigate(['/cms/persons'])"
              (keyup.enter)="router.navigate(['/cms/persons'])"
              (keyup.space)="router.navigate(['/cms/persons'])"
            >
              <i class="pi pi-user mr-2"></i>
              <span>Persons</span>
            </a>
          </li>
          <li class="mb-3">
            <a
              class="align-items-center border-round text-700 hover:surface-100 flex cursor-pointer p-3"
              role="button"
              tabindex="0"
              (click)="router.navigate(['/cms/dashboard'])"
              (keyup.enter)="router.navigate(['/cms/dashboard'])"
              (keyup.space)="router.navigate(['/cms/dashboard'])"
            >
              <i class="pi pi-home mr-2"></i>
              <span>Dashboard</span>
            </a>
          </li>
        </ul>
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
      <div class="align-items-center flex gap-3">
        <h1 class="text-900 m-0 text-4xl font-bold">{{ pageTitle() }}</h1>
      </div>
    </div>

    <div class="p-4">
      <ng-content />
    </div>
  </div>`,
})
export class NavigationSidebarComponent {
  sidebarVisible = signal(false);
  pageTitle = input<string>();
  router = inject(Router);
}
