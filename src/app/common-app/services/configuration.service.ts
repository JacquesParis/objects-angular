import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  getRootObjectTypeName(): string {
    return 'root';
  }
  getServer(): string {
    return (
      'http://' +
      location.hostname +
      ('localhost' === location.hostname ? ':3000' : '') +
      '/api'
    );
  }

  constructor() {}
}
