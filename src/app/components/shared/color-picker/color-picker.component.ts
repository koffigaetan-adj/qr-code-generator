import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-2">
      <label class="block text-sm font-medium">{{ label() }}</label>
      <div class="flex items-center gap-2">
        <input
          type="color"
          [ngModel]="value()"
          (ngModelChange)="valueChange.emit($event)"
          class="h-9 w-10 cursor-pointer rounded border border-slate-300 dark:border-slate-700 bg-transparent p-0.5"
        />
        <input
          type="text"
          [ngModel]="value()"
          (ngModelChange)="valueChange.emit($event)"
          class="input font-mono text-xs h-9"
        />
      </div>
      <div class="flex gap-1.5 pt-1">
        @for (color of presets; track color) {
          <button
            type="button"
            (click)="valueChange.emit(color)"
            class="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform shadow-sm"
            [style.background-color]="color"
            [class.ring-2]="value() === color"
            [class.ring-brand-500]="value() === color"
            [class.ring-offset-1]="value() === color"
            [class.dark:ring-offset-slate-900]="value() === color"
            [attr.aria-label]="'Couleur ' + color"
          ></button>
        }
      </div>
    </div>
  `,
})
export class ColorPickerComponent {
  readonly label = input<string>('');
  readonly value = input<string>('#000000');
  readonly valueChange = output<string>();
  
  readonly presets = [
    '#000000', // Black
    '#ffffff', // White
    '#3b82f6', // Brand Blue
    '#10b981', // Emerald
    '#f43f5e', // Rose
    '#8b5cf6', // Violet
  ];
}
