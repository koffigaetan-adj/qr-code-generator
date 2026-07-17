import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedQrState } from '../models/wizard-state.model';

const QUERY_PARAM = 's';

/** Encodes/decodes the wizard state into a shareable URL query param. No server involved. */
@Injectable({ providedIn: 'root' })
export class ShareLinkService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  buildShareUrl(state: SharedQrState): string {
    const encoded = this.encodeState(state);
    const urlTree = this.router.createUrlTree([], { queryParams: { [QUERY_PARAM]: encoded } });
    const relativeUrl = this.router.serializeUrl(urlTree);
    const externalUrl = this.location.prepareExternalUrl(relativeUrl);
    return window.location.origin + externalUrl;
  }

  readStateFromUrl(): SharedQrState | null {
    const href = window.location.href;
    const url = new URL(href);
    
    // Extract query parameter either from regular search or hash (if hash routing)
    let encoded = url.searchParams.get(QUERY_PARAM);
    if (!encoded && url.hash.includes('?')) {
      const hashQuery = url.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      encoded = hashParams.get(QUERY_PARAM);
    }
    
    if (!encoded) return null;
    return this.decodeState(encoded);
  }

  private encodeState(state: SharedQrState): string {
    const clone = JSON.parse(JSON.stringify(state));
    if (clone.design?.logo?.dataUrl && clone.design.logo.dataUrl.startsWith('data:image')) {
      clone.design.logo.dataUrl = null;
    }
    const json = JSON.stringify(clone);
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
