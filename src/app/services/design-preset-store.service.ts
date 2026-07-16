import { Injectable, signal } from '@angular/core';
import { DesignOptions, DesignPreset } from '../models/design-options.model';

const STORAGE_KEY = 'qr-generator.design-presets';

export const SYSTEM_PRESETS: DesignPreset[] = [
  {
    id: 'sys-neon-social',
    name: 'Néon Social',
    createdAt: new Date().toISOString(),
    design: {
      dotStyle: 'rounded',
      cornerStyle: 'extra-rounded',
      foregroundColor: '#ec4899',
      backgroundColor: '#ffffff',
      foregroundGradient: {
        enabled: true,
        colorStart: '#ec4899',
        colorEnd: '#8b5cf6',
        rotationDeg: 135,
      },
      errorCorrectionLevel: 'Q',
      logo: { dataUrl: null, sizeRatio: 0.2, margin: 0 },
      frame: {
        enabled: false,
        style: 'bottom',
        color: '#ec4899',
        textColor: '#ffffff',
        ctaText: 'Scan Me',
        gradient: { enabled: false, colorStart: '#000000', colorEnd: '#000000', rotationDeg: 0 }
      }
    }
  },
  {
    id: 'sys-corporate',
    name: 'Corporate Blue',
    createdAt: new Date().toISOString(),
    design: {
      dotStyle: 'square',
      cornerStyle: 'square',
      foregroundColor: '#1e3a8a',
      backgroundColor: '#ffffff',
      foregroundGradient: { enabled: false, colorStart: '#000000', colorEnd: '#000000', rotationDeg: 0 },
      errorCorrectionLevel: 'M',
      logo: { dataUrl: null, sizeRatio: 0.2, margin: 0 },
      frame: {
        enabled: true,
        style: 'outline',
        color: '#1e3a8a',
        textColor: '#1e3a8a',
        ctaText: 'SCAN',
        gradient: { enabled: false, colorStart: '#000000', colorEnd: '#000000', rotationDeg: 0 }
      }
    }
  },
  {
    id: 'sys-modern-dark',
    name: 'Sombre Moderne',
    createdAt: new Date().toISOString(),
    design: {
      dotStyle: 'dots',
      cornerStyle: 'extra-rounded',
      foregroundColor: '#ffffff',
      backgroundColor: '#0f172a',
      foregroundGradient: { enabled: false, colorStart: '#000000', colorEnd: '#000000', rotationDeg: 0 },
      errorCorrectionLevel: 'H',
      logo: { dataUrl: null, sizeRatio: 0.2, margin: 0 },
      frame: {
        enabled: false,
        style: 'bottom',
        color: '#000000',
        textColor: '#ffffff',
        ctaText: '',
        gradient: { enabled: false, colorStart: '#000000', colorEnd: '#000000', rotationDeg: 0 }
      }
    }
  }
];

@Injectable({ providedIn: 'root' })
export class DesignPresetStoreService {
  readonly presets = signal<DesignPreset[]>(this.readPresets());
  readonly systemPresets = signal<DesignPreset[]>(SYSTEM_PRESETS);

  save(name: string, design: DesignOptions): void {
    const preset: DesignPreset = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      design,
    };
    const next = [...this.presets(), preset];
    this.presets.set(next);
    this.persist(next);
  }

  delete(id: string): void {
    const next = this.presets().filter((preset) => preset.id !== id);
    this.presets.set(next);
    this.persist(next);
  }

  private persist(presets: DesignPreset[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  }

  private readPresets(): DesignPreset[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as DesignPreset[]) : [];
    } catch {
      return [];
    }
  }
}
