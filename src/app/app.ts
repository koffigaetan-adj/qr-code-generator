import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FR } from './i18n/fr';
import { ThemeToggleComponent } from './components/shared/theme-toggle/theme-toggle.component';
import { IconComponent } from './components/shared/icon/icon.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ThemeToggleComponent, IconComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly fr = FR;
}
