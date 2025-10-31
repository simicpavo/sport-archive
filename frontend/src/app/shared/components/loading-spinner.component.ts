import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `<div class="justify-content-center mb-4 flex">
    <p-progressSpinner strokeWidth="4" [style]="{ width: '50px', height: '50px' }" />
  </div>`,
})
export class LoadingSpinnerComponent {}
