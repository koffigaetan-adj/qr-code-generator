import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, viewChild, signal, computed } from '@angular/core';
import { DesignOptions } from '../../../models/design-options.model';
import { QrStylingService } from '../../../services/qr-styling.service';

@Component({
  selector: 'app-qr-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      #container
      class="flex items-center justify-center rounded-xl bg-[repeating-conic-gradient(#e2e8f0_0_25%,transparent_0_50%)] bg-[length:16px_16px] p-4 dark:bg-[repeating-conic-gradient(#1e293b_0_25%,transparent_0_50%)] transition-transform duration-200 ease-out perspective-1000"
      (mousemove)="onMouseMove($event)"
      (mouseleave)="onMouseLeave()"
      [style.transform]="transformStyle()"
    >
      <canvas #canvas class="max-w-full rounded-lg shadow-xl dark:shadow-black/50 transition-transform duration-200" [style.transform]="canvasTransformStyle()"></canvas>
    </div>
  `,
})
export class QrPreviewComponent {
  private readonly qrStyling = inject(QrStylingService);

  readonly content = input.required<string>();
  readonly design = input.required<DesignOptions>();
  readonly size = input<number>(280);

  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly containerRef = viewChild<ElementRef<HTMLDivElement>>('container');

  private readonly rotateX = signal(0);
  private readonly rotateY = signal(0);

  readonly transformStyle = computed(() => `perspective(1000px) rotateX(${this.rotateX()}deg) rotateY(${this.rotateY()}deg) scale3d(1.02, 1.02, 1.02)`);
  readonly canvasTransformStyle = computed(() => `translateZ(20px)`);

  constructor() {
    effect(() => {
      const canvasElement = this.canvasRef()?.nativeElement;
      if (!canvasElement) return;
      void this.qrStyling.renderToCanvas(canvasElement, this.content(), this.design(), this.size());
    });
  }

  onMouseMove(event: MouseEvent) {
    const container = this.containerRef()?.nativeElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-10 to 10 degrees)
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    
    this.rotateX.set(rotateXValue);
    this.rotateY.set(rotateYValue);
  }

  onMouseLeave() {
    this.rotateX.set(0);
    this.rotateY.set(0);
  }
}
