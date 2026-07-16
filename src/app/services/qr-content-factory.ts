import { QrType } from '../models/qr-type.model';
import { QrContent } from '../models/qr-content.model';

/** Returns a blank content object matching the shape expected for a given QR type. */
export function createDefaultContent(type: QrType): QrContent {
  switch (type) {
    case 'url':
      return { url: '' };
    case 'text':
      return { text: '' };
    case 'vcard':
      return { firstName: '', lastName: '', phone: '', email: '', company: '', address: '' };
    case 'wifi':
      return { ssid: '', password: '', encryption: 'WPA', hidden: false };
    case 'social':
      return { links: [{ network: 'instagram', url: '' }] };
    case 'email':
      return { to: '', subject: '', body: '' };
    case 'sms':
      return { phone: '', message: '' };
    case 'pdf':
      return { url: '' };
    case 'video':
      return { url: '' };
    case 'app':
      return { platform: 'auto', iosUrl: '', androidUrl: '' };
  }
}
