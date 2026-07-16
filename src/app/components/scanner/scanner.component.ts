import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IconComponent } from '../shared/icon/icon.component';
import jsQR from 'jsqr';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scanner.component.html',
})
export class ScannerComponent {
  readonly decodedResult = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly resultCopied = signal(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // reset
    this.error.set(null);
    this.decodedResult.set(null);

    if (!file) return;

    if (!/^image\/(png|jpeg|jpg)$/.test(file.type)) {
      this.error.set('Format d\'image non supporté. Veuillez utiliser PNG ou JPG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          this.error.set('Erreur lors du traitement de l\'image.');
          return;
        }
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          this.decodedResult.set(code.data);
        } else {
          this.error.set('Aucun QR code trouvé dans cette image. Essayez une image plus nette.');
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  isUrl(text: string): boolean {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  }

  async copyResult(): Promise<void> {
    const res = this.decodedResult();
    if (!res) return;
    try {
      await navigator.clipboard.writeText(res);
      this.resultCopied.set(true);
      setTimeout(() => this.resultCopied.set(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = res;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      this.resultCopied.set(true);
      setTimeout(() => this.resultCopied.set(false), 2000);
    }
  }
}
