import { Injectable, signal } from '@angular/core';
import { DesignOptions, DesignPreset } from '../models/design-options.model';

const STORAGE_KEY = 'qr-generator.design-presets';

@Injectable({ providedIn: 'root' })
export class DesignPresetStoreService {
  readonly presets = signal<DesignPreset[]>(this.readPresets());

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
