import { Injectable } from '@angular/core';
import { SharedQrState } from '../models/wizard-state.model';

const QUERY_PARAM = 's';

/** Encodes/decodes the wizard state into a shareable URL query param. No server involved. */
@Injectable({ providedIn: 'root' })
export class ShareLinkService {
  buildShareUrl(state: SharedQrState): string {
    const encoded = this.encodeState(state);
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set(QUERY_PARAM, encoded);
    return url.toString();
  }

  readStateFromUrl(): SharedQrState | null {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get(QUERY_PARAM);
    if (!encoded) return null;
    return this.decodeState(encoded);
  }

  private encodeState(state: SharedQrState): string {
    const json = JSON.stringify(state);
    return btoa(encodeURIComponent(json));
  }

  private decodeState(encoded: string): SharedQrState | null {
    try {
      const json = decodeURIComponent(atob(encoded));
      return JSON.parse(json) as SharedQrState;
    } catch {
      return null;
    }
  }
}
