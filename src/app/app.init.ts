import { setTheme } from 'ngx-bootstrap/utils';
import { NgModuleRef } from '@angular/core';
import { AppModule } from './app.module';

const BOOTSTRAP_THEME = 'bs4';

export function initApp(ref: NgModuleRef<AppModule>) {
  const ngRef = 'ngRef';
  // Ensure Angular destroys itself on stackblitz hot reloads.
  if (window[ngRef]) {
    window[ngRef].destroy();
  }
  window[ngRef] = ref;

  setTheme(BOOTSTRAP_THEME); // or 'bs4'
}
