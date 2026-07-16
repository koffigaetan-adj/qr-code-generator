import { Injectable, computed, inject, signal } from '@angular/core';
import { QrType } from '../models/qr-type.model';
import { QrContent } from '../models/qr-content.model';
import { DEFAULT_DESIGN_OPTIONS, DesignOptions } from '../models/design-options.model';
import { SharedQrState, WizardStep } from '../models/wizard-state.model';
import { createDefaultContent } from './qr-content-factory';
import { QrContentEncoderService } from './qr-content-encoder.service';

const DEFAULT_TYPE: QrType = 'url';

@Injectable({ providedIn: 'root' })
export class WizardStateService {
  private readonly encoder = inject(QrContentEncoderService);

  readonly step = signal<WizardStep>(1);
  readonly type = signal<QrType>(DEFAULT_TYPE);
  readonly content = signal<QrContent>(createDefaultContent(DEFAULT_TYPE));
  readonly design = signal<DesignOptions>(DEFAULT_DESIGN_OPTIONS);

  readonly encodedContent = computed(() => this.encoder.encode(this.type(), this.content()));

  selectType(type: QrType): void {
    this.type.set(type);
    this.content.set(createDefaultContent(type));
  }

  setContent(content: QrContent): void {
    this.content.set(content);
  }

  setDesign(design: DesignOptions): void {
    this.design.set(design);
  }

  goNext(): void {
    this.step.update((current) => (current < 3 ? ((current + 1) as WizardStep) : current));
  }

  goBack(): void {
    this.step.update((current) => (current > 1 ? ((current - 1) as WizardStep) : current));
  }

  goToStep(step: WizardStep): void {
    this.step.set(step);
  }

  restart(): void {
    this.step.set(1);
    this.type.set(DEFAULT_TYPE);
    this.content.set(createDefaultContent(DEFAULT_TYPE));
    this.design.set(DEFAULT_DESIGN_OPTIONS);
  }

  loadSharedState(state: SharedQrState): void {
    this.type.set(state.type);
    this.content.set(state.content);
    this.design.set(state.design);
    this.step.set(3);
  }

  snapshot(): SharedQrState {
    return { type: this.type(), content: this.content(), design: this.design() };
  }
}
