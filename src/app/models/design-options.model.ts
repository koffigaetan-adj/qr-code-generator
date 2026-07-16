export type DotStyle = 'square' | 'rounded' | 'dots';

export type CornerStyle = 'square' | 'rounded' | 'extra-rounded';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type ExportFormat = 'png' | 'svg' | 'pdf';

export type ExportResolution = 512 | 1024 | 2048;

export interface GradientOptions {
  enabled: boolean;
  colorStart: string;
  colorEnd: string;
  rotationDeg: number;
}

export type FrameStyle = 'bottom' | 'top' | 'solid' | 'outline';

export interface FrameOptions {
  enabled: boolean;
  style: FrameStyle;
  ctaText: string;
  color: string;
  textColor: string;
  gradient: GradientOptions;
}

export interface LogoOptions {
  dataUrl: string | null;
  sizeRatio: number;
  margin: number;
}

export interface DesignOptions {
  foregroundColor: string;
  foregroundGradient: GradientOptions;
  backgroundColor: string;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  errorCorrectionLevel: ErrorCorrectionLevel;
  logo: LogoOptions;
  frame: FrameOptions;
}

export const DEFAULT_DESIGN_OPTIONS: DesignOptions = {
  foregroundColor: '#1e293b',
  foregroundGradient: {
    enabled: false,
    colorStart: '#3b71f3',
    colorEnd: '#1e42c9',
    rotationDeg: 45,
  },
  backgroundColor: '#ffffff',
  dotStyle: 'square',
  cornerStyle: 'square',
  errorCorrectionLevel: 'M',
  logo: {
    dataUrl: null,
    sizeRatio: 0.4,
    margin: 4,
  },
  frame: {
    enabled: false,
    style: 'bottom',
    ctaText: 'Scannez-moi',
    color: '#1e293b',
    textColor: '#ffffff',
    gradient: {
      enabled: false,
      colorStart: '#1e293b',
      colorEnd: '#0f172a',
      rotationDeg: 90,
    },
  },
};

export interface DesignPreset {
  id: string;
  name: string;
  createdAt: string;
  design: DesignOptions;
}

/** Forces ECC to "High" when a logo is embedded, so the QR code stays scannable. */
export function getEffectiveDesign(design: DesignOptions): DesignOptions {
  if (!design.logo.dataUrl) return design;
  return { ...design, errorCorrectionLevel: 'H' };
}
