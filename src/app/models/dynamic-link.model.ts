export type DynamicLinkType = 'url' | 'pdf' | 'video';

export interface DynamicLinkTarget {
  url: string;
}

export interface DynamicLink {
  id: string;
  userId: string;
  qrType: DynamicLinkType;
  target: DynamicLinkTarget;
  scanCount: number;
  lastScannedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
