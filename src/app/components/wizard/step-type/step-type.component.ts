import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FR } from '../../../i18n/fr';
import { QR_TYPE_DEFINITIONS } from '../../../models/qr-type.model';
import { WizardStateService } from '../../../services/wizard-state.service';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-step-type',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-type.component.html',
})
export class StepTypeComponent {
  private readonly wizard = inject(WizardStateService);

  readonly fr = FR;
  readonly types = QR_TYPE_DEFINITIONS;
  readonly selectedType = this.wizard.type;

  choose(type: (typeof QR_TYPE_DEFINITIONS)[number]['type']): void {
    this.wizard.selectType(type);
    this.wizard.goNext();
  }
}
