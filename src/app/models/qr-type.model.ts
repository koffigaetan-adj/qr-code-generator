export type QrType =
  | 'url'
  | 'text'
  | 'vcard'
  | 'wifi'
  | 'social'
  | 'email'
  | 'sms'
  | 'pdf'
  | 'video'
  | 'app';

export type QrTypeIcon =
  | 'link'
  | 'text'
  | 'contact'
  | 'wifi'
  | 'share'
  | 'mail'
  | 'message'
  | 'file'
  | 'video'
  | 'app';

export interface QrTypeDefinition {
  type: QrType;
  icon: QrTypeIcon;
}

export const QR_TYPE_DEFINITIONS: QrTypeDefinition[] = [
  { type: 'url', icon: 'link' },
  { type: 'text', icon: 'text' },
  { type: 'vcard', icon: 'contact' },
  { type: 'wifi', icon: 'wifi' },
  { type: 'social', icon: 'share' },
  { type: 'email', icon: 'mail' },
  { type: 'sms', icon: 'message' },
  { type: 'pdf', icon: 'file' },
  { type: 'video', icon: 'video' },
  { type: 'app', icon: 'app' },
];
