import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FR } from '../../i18n/fr';
import { IconComponent } from '../shared/icon/icon.component';
import { WizardStateService } from '../../services/wizard-state.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.component.html',
})
export class LandingPageComponent {
  readonly fr = FR;
  readonly wizard = inject(WizardStateService);

  startCreating(): void {
    this.wizard.restart();
  }
}
