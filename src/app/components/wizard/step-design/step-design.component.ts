import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FR } from '../../../i18n/fr';
import {
  CornerStyle,
  DesignOptions,
  DotStyle,
  ErrorCorrectionLevel,
  ExportFormat,
  ExportResolution,
  FrameStyle,
  getEffectiveDesign,
} from '../../../models/design-options.model';
import { WizardStateService } from '../../../services/wizard-state.service';
import { QrExportService } from '../../../services/qr-export.service';
import { QrStylingService } from '../../../services/qr-styling.service';
import { DesignPresetStoreService } from '../../../services/design-preset-store.service';
import { ShareLinkService } from '../../../services/share-link.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { ColorPickerComponent } from '../../shared/color-picker/color-picker.component';
import { QrPreviewComponent } from '../../shared/qr-preview/qr-preview.component';

const MAX_LOGO_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-step-design',
  standalone: true,
  imports: [FormsModule, IconComponent, ColorPickerComponent, QrPreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-design.component.html',
})
export class StepDesignComponent {
  private readonly wizard = inject(WizardStateService);
  private readonly qrExport = inject(QrExportService);
  private readonly qrStyling = inject(QrStylingService);
  readonly presetStore = inject(DesignPresetStoreService);
  private readonly shareLink = inject(ShareLinkService);

  readonly fr = FR;
  readonly design = this.wizard.design;
  readonly content = this.wizard.encodedContent;
  readonly effectiveDesign = computed(() => getEffectiveDesign(this.design()));
  readonly logoForcesHighEcc = computed(() => !!this.design().logo.dataUrl);

  readonly dotStyles: DotStyle[] = ['square', 'rounded', 'dots'];
  readonly cornerStyles: CornerStyle[] = ['square', 'rounded', 'extra-rounded'];
  readonly frameStyles: FrameStyle[] = ['bottom', 'top', 'solid', 'outline'];
  readonly eccLevels: ErrorCorrectionLevel[] = ['L', 'M', 'Q', 'H'];
  readonly exportFormats: ExportFormat[] = ['png', 'svg', 'pdf'];
  readonly resolutions: ExportResolution[] = [512, 1024, 2048];

  readonly activeTab = signal<'colors' | 'shapes' | 'logo' | 'frame' | 'presets'>('colors');
  readonly tabs: { id: 'colors' | 'shapes' | 'logo' | 'frame' | 'presets'; label: string; icon: string }[] = [
    { id: 'colors', label: 'Couleurs', icon: 'palette' },
    { id: 'shapes', label: 'Formes', icon: 'grid' },
    { id: 'logo', label: 'Logo', icon: 'app' },
    { id: 'frame', label: 'Cadre', icon: 'layers' },
    { id: 'presets', label: 'Préréglages', icon: 'sliders' },
  ];

  readonly exportFormat = signal<ExportFormat>('png');
  readonly exportResolution = signal<ExportResolution>(1024);
  readonly isDownloading = signal(false);
  readonly newPresetName = signal('');
  readonly shareCopied = signal(false);
  readonly imageCopied = signal(false);
  readonly logoError = signal<string | null>(null);

  readonly builtInLogos = [
    { name: 'Wi-Fi', dataUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIwYy4wMSAwIDAgMCAwIDB6TTguNSAxNi41YTUgNSAwIDAgMSA3IDBMMTIgMjBsLTMuNS0zLjV6IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTUgMTMuMWExMCAxMCAwIDAgMSAxNCAwbC0yLjUgMi41YTYuNSA2LjUgMCAwIDAtOSAwbC0yLjUtMi41ek0xLjUgOS42YTE1IDE1IDAgMCAxIDIxIDBMMjAgMTJsLTEuNS0xLjVhMTIgMTIgMCAwIDAtMTMgMGwtMS41IDEuNS0yLjUtMi40eiIvPjwvc3ZnPg==' },
    { name: 'X / Twitter', dataUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMCI+PHBhdGggZD0iTTE4LjI0NCAyLjI1aDMuMzA4bC03LjIyNyA4LjI2IDE4LjUwMiAxMS4yNHgtNy4yOGwtNS43MDEtNy40Ni02LjQ2IDcuNDZINS4xN2w3LjczMS04LjgzNS0xLjIwMS01LjU4M2g3Ljk2MmwtNi4yMiA4LjEzNGguOTRsMTAuMDkyLTEzLjIyNnptLTYuMzQzIDUuNjNINzguNjU0TDExLjgwNCAyaDRuNDJsLTQuMTc1IDUuNjN6Ii8+PC9zdmc+' },
    { name: 'Facebook', dataUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzE4NzdGMCI+PHBhdGggZD0iTTI0IDEyYTEyIDEyIDAgMSAwLTEzLjg3NSAxMS44NTJWMTUuNjhoLTMuMTI1VjEySDEwLjEyNVY5LjE1YTMuODc1IDMuODc1IDAgMCAxIDQuMTQxLTQuMjYgMTguNDQzIDE4LjQ0MyAwIDAgMSAyLjQ4Ni4yMTRWOC4waC0xLjM5OWMtMS4zMDUgMC0xLjcyLjYxMi0xLjcyIDEuNjZWMThoMy4wODVMMTYuMTQyIDE1LjY4aC0yLjY0NHY4LjE3MkEyNCAyNCAwIDAgMCAyNCAxMnoiLz48L3N2Zz4=' },
    { name: 'LinkedIn', dataUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzBBNjZDMCI+PHBhdGggZD0iTTIuOTQgMThIMjdWNi4xMkg2Ljk0VjE4em0tLjQ4LTIzLjg1NGEyLjMxIDIuMzEgMCAxIDAgMi4zMSA0LjYzIDQuNjMgMCAwIDAgMi4zMS00LjYzVjIuMThBMi4zMSAyLjMxIDAgMCAwIDIuOTMgMnoiLz48cGF0aCBkPSJNOSAxOGg1LjEydi02LjQ4YzAtMS43MS4zMy0zLjM4IDIuNDUtMy4zOCAyLjExIDAgMi4xNCAxLjgyIDIuMTQgMy41VjE4aDUuMTJWOi41YzAtMy4wMy0xLjYzLTQuNDItMy43NS00LjQyYy0xLjc1IDAtMi41My45Ni0yLjk2IDEuNjNWNi4xMmg0LjlWMTh6Ii8+PC9zdmc+' }
  ];


  private updateDesign(partial: Partial<DesignOptions>): void {
    this.wizard.setDesign({ ...this.design(), ...partial });
  }

  setForegroundColor(color: string): void {
    this.updateDesign({ foregroundColor: color });
  }

  setBackgroundColor(color: string): void {
    this.updateDesign({ backgroundColor: color });
  }

  setDotStyle(style: DotStyle): void {
    this.updateDesign({ dotStyle: style });
  }

  setCornerStyle(style: CornerStyle): void {
    this.updateDesign({ cornerStyle: style });
  }

  setEccLevel(level: ErrorCorrectionLevel): void {
    this.updateDesign({ errorCorrectionLevel: level });
  }

  toggleGradient(enabled: boolean): void {
    this.updateDesign({ foregroundGradient: { ...this.design().foregroundGradient, enabled } });
  }

  setGradientStart(color: string): void {
    this.updateDesign({ foregroundGradient: { ...this.design().foregroundGradient, colorStart: color } });
  }

  setGradientEnd(color: string): void {
    this.updateDesign({ foregroundGradient: { ...this.design().foregroundGradient, colorEnd: color } });
  }

  setGradientRotation(rotationDeg: number): void {
    this.updateDesign({ foregroundGradient: { ...this.design().foregroundGradient, rotationDeg } });
  }

  toggleFrame(enabled: boolean): void {
    this.updateDesign({ frame: { ...this.design().frame, enabled } });
  }

  setFrameStyle(style: FrameStyle): void {
    this.updateDesign({ frame: { ...this.design().frame, style } });
  }

  setFrameCta(ctaText: string): void {
    this.updateDesign({ frame: { ...this.design().frame, ctaText } });
  }

  setFrameColor(color: string): void {
    this.updateDesign({ frame: { ...this.design().frame, color } });
  }

  setFrameTextColor(color: string): void {
    this.updateDesign({ frame: { ...this.design().frame, textColor: color } });
  }

  toggleFrameGradient(enabled: boolean): void {
    this.updateDesign({ frame: { ...this.design().frame, gradient: { ...this.design().frame.gradient, enabled } } });
  }

  setFrameGradientStart(color: string): void {
    this.updateDesign({ frame: { ...this.design().frame, gradient: { ...this.design().frame.gradient, colorStart: color } } });
  }

  setFrameGradientEnd(color: string): void {
    this.updateDesign({ frame: { ...this.design().frame, gradient: { ...this.design().frame.gradient, colorEnd: color } } });
  }

  setFrameGradientRotation(rotationDeg: number): void {
    this.updateDesign({ frame: { ...this.design().frame, gradient: { ...this.design().frame.gradient, rotationDeg } } });
  }

  setExportResolution(value: string): void {
    this.exportResolution.set(Number(value) as ExportResolution);
  }

  setLogoSize(sizeRatio: number): void {
    this.updateDesign({ logo: { ...this.design().logo, sizeRatio } });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    this.logoError.set(null);

    if (!/^image\/(png|jpeg|svg\+xml)$/.test(file.type)) {
      this.logoError.set(this.fr.errors.invalidImageFile);
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      this.logoError.set(this.fr.errors.fileTooLarge);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.updateDesign({ logo: { ...this.design().logo, dataUrl: reader.result as string } });
    };
    reader.readAsDataURL(file);
  }

  setBuiltInLogo(dataUrl: string): void {
    this.updateDesign({ logo: { ...this.design().logo, dataUrl } });
  }

  removeLogo(): void {
    this.updateDesign({ logo: { ...this.design().logo, dataUrl: null } });
  }

  savePreset(): void {
    const name = this.newPresetName().trim();
    if (!name) return;
    this.presetStore.save(name, this.design());
    this.newPresetName.set('');
  }

  loadPreset(id: string): void {
    const preset = this.presetStore.presets().find((p) => p.id === id) || this.presetStore.systemPresets().find((p) => p.id === id);
    if (preset) this.wizard.setDesign(preset.design);
  }

  deletePreset(id: string): void {
    this.presetStore.delete(id);
  }

  async copyShareLink(): Promise<void> {
    const url = this.shareLink.buildShareUrl(this.wizard.snapshot());
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      this.copyWithFallback(url);
    }
    this.shareCopied.set(true);
    setTimeout(() => this.shareCopied.set(false), 2000);
  }

  private copyWithFallback(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  async copyImageToClipboard(): Promise<void> {
    try {
      const blob = await this.qrStyling.exportPng(
        this.content(),
        this.design(),
        this.exportResolution()
      );
      if (!blob) return;

      const clipboardItem = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([clipboardItem]);
      
      this.imageCopied.set(true);
      setTimeout(() => this.imageCopied.set(false), 2000);
    } catch (e) {
      console.error('Failed to copy image', e);
      // Fallback or show error
      alert('Impossible de copier l\'image dans le presse-papiers.');
    }
  }

  async download(): Promise<void> {
    this.isDownloading.set(true);
    try {
      await this.qrExport.download(
        this.exportFormat(),
        this.content(),
        this.design(),
        this.exportResolution(),
      );
    } finally {
      this.isDownloading.set(false);
    }
  }

  back(): void {
    this.wizard.goToStep(2);
  }

  restart(): void {
    if (confirm(this.fr.wizard.restartConfirm)) {
      this.wizard.restart();
    }
  }
}
