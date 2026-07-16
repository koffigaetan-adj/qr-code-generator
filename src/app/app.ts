import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FR } from './i18n/fr';
import { ThemeToggleComponent } from './components/shared/theme-toggle/theme-toggle.component';
import { IconComponent } from './components/shared/icon/icon.component';
import { FirebaseAuthService } from './services/firebase-auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ThemeToggleComponent, IconComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly fr = FR;
  readonly auth = inject(FirebaseAuthService);

  signInWithGoogle(): void {
    void this.auth.signInWithGoogle();
  }

  signOut(): void {
    void this.auth.signOut();
  }
}
