import { Component, input, output } from '@angular/core';
import { ButtonModule, ButtonSeverity } from 'primeng/button';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="flex justify-content-between align-items-start mb-5">
      <div class="flex-grow-1">
        <h2 class="text-3xl font-bold m-0 text-900">{{ title() }}</h2>
      </div>

      <div class="flex-shrink-0 ml-4">
        <p-button
          [icon]="buttonIcon()"
          [label]="buttonLabel()"
          [severity]="buttonSeverity()"
          [raised]="true"
          size="large"
          styleClass="px-4 py-2"
          (onClick)="buttonClick.emit()"
        >
        </p-button>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  title = input.required<string>();
  buttonLabel = input.required<string>();
  buttonIcon = input<string>('pi pi-plus');
  buttonSeverity = input<ButtonSeverity>('success');
  buttonClick = output<void>();
}
