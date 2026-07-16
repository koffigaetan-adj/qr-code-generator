import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FR } from '../../i18n/fr';
import { DEFAULT_DESIGN_OPTIONS } from '../../models/design-options.model';
import { QrStylingService } from '../../services/qr-styling.service';
import { QrPreviewComponent } from '../shared/qr-preview/qr-preview.component';
import { IconComponent } from '../shared/icon/icon.component';

function parseCsvUrls(text: string): string[] {
  const rows = text
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);
  if (rows.length === 0) return [];

  const splitRow = (row: string) => row.split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''));

  const firstCols = splitRow(rows[0]);
  const headerIndex = firstCols.findIndex((cell) => cell.toLowerCase() === 'url');
  const urlColumn = headerIndex >= 0 ? headerIndex : 0;
  const startRow = headerIndex >= 0 ? 1 : 0;

  const urls: string[] = [];
  for (let i = startRow; i < rows.length; i++) {
    const value = splitRow(rows[i])[urlColumn];
    if (value) urls.push(value);
  }
  return urls;
}

@Component({
  selector: 'app-batch-generator',
  standalone: true,
  imports: [QrPreviewComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './batch-generator.component.html',
})
export class BatchGeneratorComponent {
  private readonly qrStyling = inject(QrStylingService);

  readonly fr = FR;
  readonly design = DEFAULT_DESIGN_OPTIONS;
  readonly entries = signal<string[]>([]);
  readonly error = signal<string | null>(null);
  readonly isExporting = signal(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    this.error.set(null);

    if (!file || !/\.csv$/i.test(file.name)) {
      this.error.set(this.fr.batch.errors.invalidFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const urls = parseCsvUrls(String(reader.result ?? ''));
      if (urls.length === 0) {
        this.error.set(this.fr.batch.errors.empty);
        this.entries.set([]);
        return;
      }
      this.entries.set(urls);
    };
    reader.readAsText(file);
  }

  async downloadAll(): Promise<void> {
    if (this.entries().length === 0) return;
    this.isExporting.set(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const urls = this.entries();
      for (let i = 0; i < urls.length; i++) {
        const blob = await this.qrStyling.exportPng(urls[i], this.design, 1024);
        zip.file(`qr-${String(i + 1).padStart(2, '0')}.png`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'qr-codes.zip';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      this.isExporting.set(false);
    }
  }
}
