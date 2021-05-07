import { getAdminParts } from 'src/app/app.const';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  public adminHref: string;

  constructor() {
    const parts: {
      ownerType: string;
      ownerName: string;
      namespaceType?: string;
      namespaceName?: string;
    } = getAdminParts();
    if (!parts.namespaceName || !parts.namespaceType) {
      this.adminHref = `#/admin/owner/${parts.ownerType}/${parts.ownerName}`;
    } else {
      this.adminHref = `#/admin/owner/${parts.ownerType}/${parts.ownerName}/namespace/${parts.namespaceType}/${parts.namespaceName}`;
    }
  }
}
