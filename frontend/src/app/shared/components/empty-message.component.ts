import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-empty-message',
  standalone: true,
  template: `
    <div class="py-8 text-center">
      <div class="text-color-secondary">
        <i [class]="'pi ' + icon + ' mb-3 block text-4xl'"></i>
        <p class="mb-2 text-lg font-semibold">{{ title() }}</p>
        <p class="text-sm">{{ message() }}</p>
      </div>
    </div>
  `,
})
export class TableEmptyMessageComponent {
  icon = input.required();
  title = input.required();
  message = input.required();
}
