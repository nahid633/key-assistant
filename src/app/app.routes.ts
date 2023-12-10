import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'key-replacement', pathMatch: "full"},
  {path: 'key-replacement', loadComponent: () => import('./pages/key-replacement/key-replacement.component').then(mod => mod.KeyReplacementComponent)},
  {path: 'batch-key-duplication', loadComponent: () => import('./pages/batch-key-duplication/batch-key-duplication.component').then(mod => mod.BatchKeyDuplicationComponent)}
];
