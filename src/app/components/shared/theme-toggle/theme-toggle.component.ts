import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FR } from '../../../i18n/fr';
import { ThemeService } from '../../../services/theme.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="theme.toggle()"
      class="btn-ghost"
      [attr.aria-label]="fr.theme.toggle"
      [attr.title]="theme.theme() === 'dark' ? fr.theme.light : fr.theme.dark"
    >
      <app-icon [name]="theme.theme() === 'dark' ? 'sun' : 'moon'" [size]="18" />
    </button>
  `,
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);
  readonly fr = FR;
}
