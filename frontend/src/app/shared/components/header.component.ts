import { Component, input, output } from '@angular/core';
import { ButtonModule, ButtonSeverity } from 'primeng/button';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="justify-content-between align-items-start mb-5 flex">
      <div class="flex-grow-1">
        <h2 class="text-900 m-0 text-3xl font-bold">{{ title() }}</h2>
      </div>

      <div class="ml-4 flex-shrink-0">
        <p-button
          size="large"
          styleClass="px-4 py-2"
          [icon]="buttonIcon()"
          [label]="buttonLabel()"
          [raised]="true"
          [severity]="buttonSeverity()"
          (onClick)="buttonClick.emit()"
        />
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
