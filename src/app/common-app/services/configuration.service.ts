import { Injectable } from '@angular/core';
import { getServer, getSiteId } from 'src/app/app.const';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  getRootObjectTypeName(): string {
    return 'Root';
  }
  getServer(): string {
    return getServer();
  }

  getHostName(): string {
    const server = this.getServer();
    return new URL(server).origin;
  }

  getSiteId(): string {
    return getSiteId();
  }

  constructor() {}
}
