import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FR } from '../../i18n/fr';
import { DynamicLink } from '../../models/dynamic-link.model';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { DynamicLinkService } from '../../services/dynamic-link.service';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  readonly auth = inject(FirebaseAuthService);
  private readonly dynamicLinkService = inject(DynamicLinkService);

  readonly fr = FR;
  readonly links = signal<DynamicLink[]>([]);
  readonly isLoading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly targetDrafts = signal<Record<string, string>>({});
  readonly savingIds = signal<Set<string>>(new Set());
  readonly savedIds = signal<Set<string>>(new Set());

  constructor() {
    effect(() => {
      if (this.auth.isSignedIn()) {
        void this.load();
      } else {
        this.links.set([]);
      }
    });
  }

  buildShortUrl(id: string): string {
    return this.dynamicLinkService.buildShortUrl(id);
  }

  draftFor(id: string): string {
    return this.targetDrafts()[id] ?? '';
  }

  updateDraft(id: string, value: string): void {
    this.targetDrafts.update((drafts) => ({ ...drafts, [id]: value }));
  }

  isSaving(id: string): boolean {
    return this.savingIds().has(id);
  }

  isSaved(id: string): boolean {
    return this.savedIds().has(id);
  }

  async load(): Promise<void> {
    this.isLoading.set(true);
    this.loadError.set(null);
    try {
      const links = await this.dynamicLinkService.list();
      this.links.set(links);
      const drafts: Record<string, string> = {};
      for (const link of links) drafts[link.id] = link.target.url;
      this.targetDrafts.set(drafts);
    } catch {
      this.loadError.set(this.fr.dashboard.loadError);
    } finally {
      this.isLoading.set(false);
    }
  }

  async save(id: string): Promise<void> {
    const url = this.draftFor(id).trim();
    if (!url) return;

    this.savingIds.update((ids) => new Set(ids).add(id));
    try {
      await this.dynamicLinkService.updateTarget(id, { url });
      this.links.update((links) => links.map((link) => (link.id === id ? { ...link, target: { url } } : link)));
      this.savedIds.update((ids) => new Set(ids).add(id));
      setTimeout(() => {
        this.savedIds.update((ids) => {
          const next = new Set(ids);
          next.delete(id);
          return next;
        });
      }, 2000);
    } finally {
      this.savingIds.update((ids) => {
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
    }
  }

  async remove(id: string): Promise<void> {
    if (!confirm(this.fr.dashboard.deleteConfirm)) return;
    await this.dynamicLinkService.remove(id);
    this.links.update((links) => links.filter((link) => link.id !== id));
  }

  async signInWithGoogle(): Promise<void> {
    await this.auth.signInWithGoogle();
  }
}
