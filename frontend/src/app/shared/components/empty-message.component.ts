import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-empty-message',
  standalone: true,
  template: `
    <div class="text-center py-8">
      <div class="text-color-secondary">
        <i [class]="'pi ' + icon + ' text-4xl mb-3 block'"></i>
        <p class="text-lg mb-2 font-semibold">{{ title() }}</p>
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
