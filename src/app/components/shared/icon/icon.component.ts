import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'link'
  | 'text'
  | 'contact'
  | 'wifi'
  | 'share'
  | 'mail'
  | 'message'
  | 'file'
  | 'video'
  | 'app'
  | 'sun'
  | 'moon'
  | 'upload'
  | 'trash'
  | 'plus'
  | 'download'
  | 'copy'
  | 'check'
  | 'chevron-left'
  | 'chevron-right'
  | 'palette'
  | 'layers'
  | 'sliders'
  | 'grid';

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (name()) {
        @case ('link') {
          <circle cx="7" cy="12" r="3.2" />
          <circle cx="17" cy="12" r="3.2" />
          <line x1="10" y1="12" x2="14" y2="12" />
        }
        @case ('text') {
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="14" y2="18" />
        }
        @case ('contact') {
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="2.2" />
          <line x1="6.5" y1="16.5" x2="11.5" y2="16.5" />
          <line x1="14" y1="9" x2="18" y2="9" />
          <line x1="14" y1="13" x2="18" y2="13" />
        }
        @case ('wifi') {
          <line x1="6" y1="16" x2="6" y2="18" />
          <line x1="10" y1="13" x2="10" y2="18" />
          <line x1="14" y1="10" x2="14" y2="18" />
          <line x1="18" y1="7" x2="18" y2="18" />
        }
        @case ('share') {
          <circle cx="6" cy="12" r="2.4" />
          <circle cx="18" cy="6" r="2.4" />
          <circle cx="18" cy="18" r="2.4" />
          <line x1="8.1" y1="10.8" x2="15.9" y2="7.2" />
          <line x1="8.1" y1="13.2" x2="15.9" y2="16.8" />
        }
        @case ('mail') {
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <polyline points="3,6 12,13 21,6" />
        }
        @case ('message') {
          <path d="M4 5h16v10H9l-4 4V5z" />
        }
        @case ('file') {
          <path d="M6 3h8l4 4v14H6z" />
          <polyline points="14,3 14,7 18,7" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="16.5" x2="15" y2="16.5" />
        }
        @case ('video') {
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
        }
        @case ('app') {
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <line x1="11" y1="19" x2="13" y2="19" />
        }
        @case ('sun') {
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="4.5" />
          <line x1="12" y1="19.5" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4.5" y2="12" />
          <line x1="19.5" y1="12" x2="22" y2="12" />
          <line x1="4.9" y1="4.9" x2="6.6" y2="6.6" />
          <line x1="17.4" y1="17.4" x2="19.1" y2="19.1" />
          <line x1="4.9" y1="19.1" x2="6.6" y2="17.4" />
          <line x1="17.4" y1="6.6" x2="19.1" y2="4.9" />
        }
        @case ('moon') {
          <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />
        }
        @case ('upload') {
          <path d="M12 16V4" />
          <polyline points="7,9 12,4 17,9" />
          <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
        }
        @case ('trash') {
          <line x1="4" y1="7" x2="20" y2="7" />
          <path d="M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
          <path d="M9 7V4h6v3" />
        }
        @case ('plus') {
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        }
        @case ('download') {
          <path d="M12 4v12" />
          <polyline points="7,11 12,16 17,11" />
          <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
        }
        @case ('copy') {
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" />
        }
        @case ('check') {
          <polyline points="4,12 10,18 20,6" />
        }
        @case ('chevron-left') {
          <polyline points="15,5 8,12 15,19" />
        }
        @case ('chevron-right') {
          <polyline points="9,5 16,12 9,19" />
        }
        @case ('palette') {
          <path d="M12 3a9 8 0 100 18c1.2 0 2-1 2-2 0-.6-.3-1-.6-1.4-.3-.4-.6-.8-.6-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 004-4c0-4.4-4-7.5-9-7.5z" />
          <circle cx="7.5" cy="12" r="1" fill="currentColor" />
          <circle cx="9.5" cy="8" r="1" fill="currentColor" />
          <circle cx="14.5" cy="7.5" r="1" fill="currentColor" />
        }
        @case ('layers') {
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 12 12 17 22 12" />
          <polyline points="2 17 12 22 22 17" />
        }
        @case ('sliders') {
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        }
        @case ('grid') {
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        }
      }
    </svg>
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<number>(20);
}
