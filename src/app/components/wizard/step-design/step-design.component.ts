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
  readonly logoError = signal<string | null>(null);

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
    const preset = this.presetStore.presets().find((p) => p.id === id);
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
