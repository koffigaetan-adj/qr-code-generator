import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, viewChild } from '@angular/core';
import { DesignOptions } from '../../../models/design-options.model';
import { QrStylingService } from '../../../services/qr-styling.service';

@Component({
  selector: 'app-qr-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-center rounded-xl bg-[repeating-conic-gradient(#e2e8f0_0_25%,transparent_0_50%)] bg-[length:16px_16px] p-4 dark:bg-[repeating-conic-gradient(#1e293b_0_25%,transparent_0_50%)]">
      <canvas #canvas class="max-w-full rounded-lg shadow"></canvas>
    </div>
  `,
})
export class QrPreviewComponent {
  private readonly qrStyling = inject(QrStylingService);

  readonly content = input.required<string>();
  readonly design = input.required<DesignOptions>();
  readonly size = input<number>(280);

  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    effect(() => {
      const canvasElement = this.canvasRef()?.nativeElement;
      if (!canvasElement) return;
      void this.qrStyling.renderToCanvas(canvasElement, this.content(), this.design(), this.size());
    });
  }
}
