import { Injectable } from '@angular/core';
import { DesignOptions, ExportFormat, ExportResolution } from '../models/design-options.model';
import { QrStylingService } from './qr-styling.service';

/** Triggers a browser download for the requested export format. No server involved. */
@Injectable({ providedIn: 'root' })
export class QrExportService {
  constructor(private readonly qrStyling: QrStylingService) {}

  async download(
    format: ExportFormat,
    content: string,
    design: DesignOptions,
    resolution: ExportResolution,
    filenameBase = 'qr-code',
  ): Promise<void> {
    if (format === 'png') {
      const blob = await this.qrStyling.exportPng(content, design, resolution);
      this.saveBlob(blob, `${filenameBase}.png`);
      return;
    }

    if (format === 'svg') {
      const svgText = await this.qrStyling.exportSvg(content, design);
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      this.saveBlob(blob, `${filenameBase}.svg`);
      return;
    }

    const pdfBlob = await this.buildPdf(content, design, resolution);
    this.saveBlob(pdfBlob, `${filenameBase}.pdf`);
  }

  private async buildPdf(content: string, design: DesignOptions, resolution: ExportResolution): Promise<Blob> {
    const pngBlob = await this.qrStyling.exportPng(content, design, resolution);
    const dataUrl = await this.qrStyling.blobToDataUrl(pngBlob);
    const bitmap = await createImageBitmap(pngBlob);

    const { jsPDF } = await import('jspdf');
    const marginPt = 24;
    const maxSidePt = 500;
    const scale = Math.min(maxSidePt / bitmap.width, maxSidePt / bitmap.height);
    const imgWidthPt = bitmap.width * scale;
    const imgHeightPt = bitmap.height * scale;
    const pageWidth = imgWidthPt + marginPt * 2;
    const pageHeight = imgHeightPt + marginPt * 2;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [pageWidth, pageHeight] });
    doc.addImage(dataUrl, 'PNG', marginPt, marginPt, imgWidthPt, imgHeightPt);
    return doc.output('blob');
  }

  private saveBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
