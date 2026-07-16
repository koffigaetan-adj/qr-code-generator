import { QrType } from './qr-type.model';
import { QrContent } from './qr-content.model';
import { DesignOptions } from './design-options.model';

export type WizardStep = 1 | 2 | 3;

export interface SharedQrState {
  type: QrType;
  content: QrContent;
  design: DesignOptions;
}
