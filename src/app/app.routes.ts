import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing/landing.component';
import { WizardShellComponent } from './components/wizard/wizard-shell.component';
import { BatchGeneratorComponent } from './components/batch/batch-generator.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'create', component: WizardShellComponent },
  { path: 'lot', component: BatchGeneratorComponent },
  { path: 'mes-qr-codes', component: DashboardComponent },
  { path: '**', redirectTo: '' },
];
