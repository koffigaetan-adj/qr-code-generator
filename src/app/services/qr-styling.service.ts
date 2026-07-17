import { Injectable } from '@angular/core';
import QRCodeStyling, { Options as QrLibOptions, FileExtension } from 'qr-code-styling';
import { DesignOptions, ExportResolution, getEffectiveDesign } from '../models/design-options.model';

const BASE_SIZE = 320;

/** Wraps the qr-code-styling library and composites the optional frame/CTA banner. */
@Injectable({ providedIn: 'root' })
export class QrStylingService {
  private buildLibOptions(content: string, design: DesignOptions, sizePx: number): Partial<QrLibOptions> {
    const effective = getEffectiveDesign(design);
    return {
      width: sizePx,
      height: sizePx,
      type: 'canvas',
      data: content,
      margin: 8,
      qrOptions: {
        errorCorrectionLevel: effective.errorCorrectionLevel,
      },
      dotsOptions: {
        type: effective.dotStyle,
        color: effective.foregroundGradient.enabled ? undefined : effective.foregroundColor,
        gradient: effective.foregroundGradient.enabled
          ? {
              type: 'linear',
              rotation: (effective.foregroundGradient.rotationDeg * Math.PI) / 180,
              colorStops: [
                { offset: 0, color: effective.foregroundGradient.colorStart },
                { offset: 1, color: effective.foregroundGradient.colorEnd },
              ],
            }
          : undefined,
      },
      cornersSquareOptions: {
        type: effective.cornerStyle,
        color: effective.foregroundColor,
      },
      cornersDotOptions: {
        type: effective.cornerStyle,
        color: effective.foregroundColor,
      },
      backgroundOptions: {
        color: effective.backgroundColor,
      },
      image: effective.logo.dataUrl ?? undefined,
      imageOptions: {
        imageSize: effective.logo.sizeRatio,
        margin: effective.logo.margin,
        hideBackgroundDots: true,
        crossOrigin: 'anonymous',
      },
    };
  }

  private async blobToImageBitmap(blob: Blob): Promise<ImageBitmap> {
    return createImageBitmap(blob);
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ): void {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  private getFrameStyle(ctx: CanvasRenderingContext2D, design: DesignOptions, width: number, height: number): string | CanvasGradient {
    if (design.frame.gradient?.enabled) {
      const g = design.frame.gradient;
      const angle = (g.rotationDeg * Math.PI) / 180;
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.sqrt(width * width + height * height) / 2;
      const x1 = cx - Math.cos(angle) * r;
      const y1 = cy - Math.sin(angle) * r;
      const x2 = cx + Math.cos(angle) * r;
      const y2 = cy + Math.sin(angle) * r;
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, g.colorStart);
      gradient.addColorStop(1, g.colorEnd);
      return gradient;
    }
    return design.frame.color;
  }

  private composeFrame(
    canvas: HTMLCanvasElement,
    qrImage: ImageBitmap,
    design: DesignOptions,
    sizePx: number,
  ): void {
    if (!design.frame.enabled) {
      canvas.width = sizePx;
      canvas.height = sizePx;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(qrImage, 0, 0, sizePx, sizePx);
      return;
    }

    const style = design.frame.style || 'bottom';
    const framePadding = Math.round(sizePx * 0.08);
    const bandHeight = Math.round(sizePx * 0.16);
    
    let width = sizePx;
    let height = sizePx;
    let qrX = 0;
    let qrY = 0;
    let textX = 0;
    let textY = 0;

    switch (style) {
      case 'bottom':
        width = sizePx + framePadding * 2;
        height = sizePx + framePadding * 2 + bandHeight;
        qrX = framePadding;
        qrY = framePadding;
        textX = width / 2;
        textY = height - bandHeight / 2 - framePadding * 0.15;
        break;
      case 'top':
        width = sizePx + framePadding * 2;
        height = sizePx + framePadding * 2 + bandHeight;
        qrX = framePadding;
        qrY = framePadding + bandHeight;
        textX = width / 2;
        textY = bandHeight / 2 + framePadding * 0.85;
        break;
      case 'solid':
        width = sizePx + framePadding * 3;
        height = sizePx + framePadding * 4 + bandHeight;
        qrX = framePadding * 1.5;
        qrY = framePadding * 2.5 + bandHeight;
        textX = width / 2;
        textY = framePadding * 1.5 + bandHeight / 2;
        break;
      case 'outline':
        const borderThickness = Math.round(sizePx * 0.04);
        width = sizePx + framePadding * 2 + borderThickness * 2;
        height = sizePx + framePadding * 2 + bandHeight + borderThickness * 2;
        qrX = framePadding + borderThickness;
        qrY = framePadding + borderThickness;
        textX = width / 2;
        textY = height - bandHeight / 2 - framePadding * 0.15 - borderThickness;
        break;
      case 'app-store':
      case 'play-store':
        width = sizePx + framePadding * 2;
        height = sizePx + framePadding * 2 + bandHeight + framePadding;
        qrX = framePadding;
        qrY = framePadding;
        textX = width / 2;
        textY = height - bandHeight / 2 - framePadding * 0.8;
        break;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const radius = Math.round(sizePx * 0.04);
    ctx.fillStyle = this.getFrameStyle(ctx, design, width, height);
    
    if (style === 'bottom' || style === 'top') {
      this.roundRect(ctx, 0, 0, width, height, radius);
      ctx.fill();

      ctx.fillStyle = design.backgroundColor;
      const innerY = style === 'bottom' ? framePadding * 0.35 : framePadding * 0.35 + bandHeight;
      this.roundRect(
        ctx,
        framePadding * 0.35,
        innerY,
        width - framePadding * 0.7,
        sizePx + framePadding * 1.3,
        radius * 0.6,
      );
      ctx.fill();
    } else if (style === 'solid') {
      this.roundRect(ctx, 0, 0, width, height, radius);
      ctx.fill();

      ctx.fillStyle = design.backgroundColor;
      this.roundRect(
        ctx,
        framePadding,
        framePadding * 2 + bandHeight,
        sizePx + framePadding,
        sizePx + framePadding,
        radius * 0.6,
      );
      ctx.fill();
    } else if (style === 'outline') {
      const borderThickness = Math.round(sizePx * 0.04);
      this.roundRect(ctx, 0, 0, width, height, radius);
      ctx.fill();

      ctx.fillStyle = design.backgroundColor;
      this.roundRect(
        ctx,
        borderThickness,
        borderThickness,
        width - borderThickness * 2,
        height - borderThickness * 2,
        radius * 0.6,
      );
      ctx.fill();
      
      // Fill text area background to match border color for better visibility if needed
      ctx.fillStyle = this.getFrameStyle(ctx, design, width, height);
      this.roundRect(
        ctx,
        borderThickness,
        height - borderThickness - bandHeight - framePadding,
        width - borderThickness * 2,
        bandHeight + framePadding,
        radius * 0.4
      );
      ctx.fill();
    } else if (style === 'app-store' || style === 'play-store') {
      // Background for QR code
      ctx.fillStyle = design.backgroundColor;
      this.roundRect(ctx, 0, 0, width, height, radius);
      ctx.fill();

      // Pill button
      ctx.fillStyle = this.getFrameStyle(ctx, design, width, height);
      this.roundRect(
        ctx,
        framePadding,
        sizePx + framePadding * 1.5,
        sizePx,
        bandHeight,
        bandHeight / 2
      );
      ctx.fill();
    }

    ctx.drawImage(qrImage, qrX, qrY, sizePx, sizePx);

    if (design.frame.ctaText) {
      ctx.fillStyle = design.frame.textColor;
      // Use standard sans-serif, but a bit smaller for app store buttons to fit standard texts
      const fontSizeMultiplier = (style === 'app-store' || style === 'play-store') ? 0.35 : 0.42;
      ctx.font = `600 ${Math.round(bandHeight * fontSizeMultiplier)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(design.frame.ctaText, textX, textY);
    }
  }

  async renderToCanvas(
    canvas: HTMLCanvasElement,
    content: string,
    design: DesignOptions,
    sizePx: number = BASE_SIZE,
  ): Promise<void> {
    if (!content) {
      canvas.width = sizePx;
      canvas.height = sizePx;
      canvas.getContext('2d')?.clearRect(0, 0, sizePx, sizePx);
      return;
    }
    const instance = new QRCodeStyling(this.buildLibOptions(content, design, sizePx));
    const blob = await instance.getRawData('png');
    if (!blob) return;
    const bitmap = await this.blobToImageBitmap(blob as Blob);
    this.composeFrame(canvas, bitmap, design, sizePx);
  }

  async exportPng(content: string, design: DesignOptions, resolution: ExportResolution): Promise<Blob> {
    const canvas = document.createElement('canvas');
    await this.renderToCanvas(canvas, content, design, resolution);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))), 'image/png');
    });
  }

  async exportSvg(content: string, design: DesignOptions): Promise<string> {
    const effective = getEffectiveDesign(design);
    const sizePx = BASE_SIZE;
    if (!design.frame.enabled) {
      const instance = new QRCodeStyling({
        ...this.buildLibOptions(content, design, sizePx),
        type: 'svg',
      });
      const blob = await instance.getRawData('svg' as FileExtension);
      if (!blob) return '';
      return (blob as Blob).text();
    }

    // Since SVG text/gradient compositing can be complex, and we already draw it perfectly on canvas,
    // embedding the high-res PNG into SVG is the most robust way to support complex gradients and layouts
    // while keeping it as a vector wrapper.
    const canvas = document.createElement('canvas');
    await this.renderToCanvas(canvas, content, design, 2048);
    const width = canvas.width;
    const height = canvas.height;
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return reject(new Error('Canvas to blob failed'));
        const dataUrl = await this.blobToDataUrl(blob);
        resolve(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <image href="${dataUrl}" x="0" y="0" width="${width}" height="${height}" />
        </svg>`);
      }, 'image/png');
    });
  }

  blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }
}
