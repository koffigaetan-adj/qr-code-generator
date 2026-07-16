import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FR } from '../../i18n/fr';
import { WizardStateService } from '../../services/wizard-state.service';
import { ShareLinkService } from '../../services/share-link.service';
import { StepTypeComponent } from './step-type/step-type.component';
import { StepContentComponent } from './step-content/step-content.component';
import { StepDesignComponent } from './step-design/step-design.component';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  selector: 'app-wizard-shell',
  standalone: true,
  imports: [StepTypeComponent, StepContentComponent, StepDesignComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wizard-shell.component.html',
})
export class WizardShellComponent implements OnInit {
  private readonly shareLink = inject(ShareLinkService);
  readonly wizard = inject(WizardStateService);

  readonly fr = FR;
  readonly steps = [1, 2, 3] as const;

  ngOnInit(): void {
    const shared = this.shareLink.readStateFromUrl();
    if (shared) {
      this.wizard.loadSharedState(shared);
    }
  }
}
