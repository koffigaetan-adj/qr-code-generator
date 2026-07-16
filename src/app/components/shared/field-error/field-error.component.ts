import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message()) {
      <p class="mt-1 text-xs text-red-600 dark:text-red-400">{{ message() }}</p>
    }
  `,
})
export class FieldErrorComponent {
  readonly control = input<AbstractControl | null>(null);
  readonly messages = input<Record<string, string>>({});

  readonly message = computed(() => {
    const control = this.control();
    if (!control || !control.invalid || (!control.touched && !control.dirty)) return null;
    const errors = control.errors ?? {};
    const key = Object.keys(errors)[0];
    return key ? (this.messages()[key] ?? null) : null;
  });
}
