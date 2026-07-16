export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

export type AppPlatform = 'auto' | 'ios' | 'android';

export type SocialNetwork = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'x' | 'youtube';

export interface SocialLink {
  network: SocialNetwork;
  url: string;
}

export interface UrlContent {
  url: string;
}

export interface TextContent {
  text: string;
}

export interface VCardContent {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  address: string;
}

export interface WifiContent {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface SocialContent {
  links: SocialLink[];
}

export interface EmailContent {
  to: string;
  subject: string;
  body: string;
}

export interface SmsContent {
  phone: string;
  message: string;
}

export interface PdfContent {
  url: string;
}

export interface VideoContent {
  url: string;
}

export interface AppContent {
  platform: AppPlatform;
  iosUrl: string;
  androidUrl: string;
}

export type QrContent =
  | UrlContent
  | TextContent
  | VCardContent
  | WifiContent
  | SocialContent
  | EmailContent
  | SmsContent
  | PdfContent
  | VideoContent
  | AppContent;
