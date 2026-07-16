import { Injectable } from '@angular/core';
import { QrType } from '../models/qr-type.model';
import {
  AppContent,
  EmailContent,
  PdfContent,
  QrContent,
  SmsContent,
  SocialContent,
  TextContent,
  UrlContent,
  VCardContent,
  VideoContent,
  WifiContent,
} from '../models/qr-content.model';
import { FR } from '../i18n/fr';

/** Encodes structured QR content into the raw string embedded in the QR code. */
@Injectable({ providedIn: 'root' })
export class QrContentEncoderService {
  encode(type: QrType, content: QrContent): string {
    switch (type) {
      case 'url':
        return this.encodeUrl(content as UrlContent);
      case 'text':
        return (content as TextContent).text ?? '';
      case 'vcard':
        return this.encodeVCard(content as VCardContent);
      case 'wifi':
        return this.encodeWifi(content as WifiContent);
      case 'social':
        return this.encodeSocial(content as SocialContent);
      case 'email':
        return this.encodeEmail(content as EmailContent);
      case 'sms':
        return this.encodeSms(content as SmsContent);
      case 'pdf':
        return this.encodeUrl(content as PdfContent);
      case 'video':
        return this.encodeUrl(content as VideoContent);
      case 'app':
        return this.encodeApp(content as AppContent);
    }
  }

  private encodeUrl(content: { url: string }): string {
    const url = (content.url ?? '').trim();
    if (!url) return '';
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `https://${url}`;
  }

  private escapeVCard(value: string): string {
    return (value ?? '').replace(/([,;\\])/g, '\\$1');
  }

  private encodeVCard(content: VCardContent): string {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${this.escapeVCard(content.lastName)};${this.escapeVCard(content.firstName)}`,
      `FN:${this.escapeVCard(`${content.firstName} ${content.lastName}`.trim())}`,
    ];
    if (content.company) lines.push(`ORG:${this.escapeVCard(content.company)}`);
    if (content.phone) lines.push(`TEL;TYPE=CELL:${this.escapeVCard(content.phone)}`);
    if (content.email) lines.push(`EMAIL:${this.escapeVCard(content.email)}`);
    if (content.address) lines.push(`ADR:;;${this.escapeVCard(content.address)};;;;`);
    lines.push('END:VCARD');
    return lines.join('\n');
  }

  private escapeWifi(value: string): string {
    return (value ?? '').replace(/([\\;,:"])/g, '\\$1');
  }

  private encodeWifi(content: WifiContent): string {
    const type = content.encryption === 'nopass' ? 'nopass' : content.encryption;
    const password = content.encryption === 'nopass' ? '' : `P:${this.escapeWifi(content.password)};`;
    return `WIFI:T:${type};S:${this.escapeWifi(content.ssid)};${password}H:${content.hidden ? 'true' : 'false'};;`;
  }

  private encodeSocial(content: SocialContent): string {
    const labels = FR.content.social.networks;
    return (content.links ?? [])
      .filter((link) => link.url?.trim())
      .map((link) => `${labels[link.network]}: ${this.encodeUrl({ url: link.url })}`)
      .join('\n');
  }

  private encodeEmail(content: EmailContent): string {
    const params = new URLSearchParams();
    if (content.subject) params.set('subject', content.subject);
    if (content.body) params.set('body', content.body);
    const query = params.toString();
    return `mailto:${content.to ?? ''}${query ? `?${query}` : ''}`;
  }

  private encodeSms(content: SmsContent): string {
    const query = content.message ? `?body=${encodeURIComponent(content.message)}` : '';
    return `sms:${content.phone ?? ''}${query}`;
  }

  private encodeApp(content: AppContent): string {
    if (content.platform === 'ios') return this.encodeUrl({ url: content.iosUrl });
    if (content.platform === 'android') return this.encodeUrl({ url: content.androidUrl });
    return this.buildAutoDetectDataUri(content.iosUrl, content.androidUrl);
  }

  /**
   * Builds a self-contained data: URI page that redirects to the iOS or Android
   * store link based on the scanning device's user agent. Avoids requiring a backend.
   */
  private buildAutoDetectDataUri(iosUrl: string, androidUrl: string): string {
    const ios = this.encodeUrl({ url: iosUrl }) || androidUrl;
    const android = this.encodeUrl({ url: androidUrl }) || iosUrl;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Redirection</title></head><body><script>
      var ua = navigator.userAgent || '';
      var ios = ${JSON.stringify(ios)};
      var android = ${JSON.stringify(android)};
      var target = /iPhone|iPad|iPod/i.test(ua) ? ios : (/Android/i.test(ua) ? android : (ios || android));
      if (target) { location.replace(target); }
    </script></body></html>`;
    return `data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`;
  }
}
