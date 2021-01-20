import { getOwnerName } from 'src/app/app.const';
import {
  ADMIN_OWNER_WELCOME_ROUTE_NAME,
  ADMIN_NAMESPACE_WELCOME_ROUTE_NAME,
} from './../../admin/admin.const';
import { VIEW_PAGE_ROUTE_NAME } from './../view.const';
import { StateService } from '@uirouter/angular';
import { ObjectTreeImpl, ObjectNodeImpl } from '@jacquesparis/objects-client';
import { IObjectNode } from '@jacquesparis/objects-model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
export interface IGenericObjectComponent {
  sanitization: DomSanitizer;
  stateService: StateService;
  changeDetectorRef: ChangeDetectorRef;
  ready: boolean;
  siteTree: ObjectTreeImpl;
  siteNode: ObjectNodeImpl;
  siteTemplateTree: ObjectTreeImpl;
  siteTemplateNode: ObjectNodeImpl;
  pageTree: ObjectTreeImpl;
  pageNode: ObjectNodeImpl;
  templateTree: ObjectTreeImpl;
  dataTree: ObjectTreeImpl;
  templateNode: ObjectNodeImpl;
  dataNode: ObjectNodeImpl;
  ctrl: {
    init(component: IGenericObjectComponent): Promise<void>;
  };
  params: any;
  initComponent(): void;
}

export interface WebSiteTemplate extends IObjectNode {
  template: string;
}

export class GenericObjectComponent implements IGenericObjectComponent {
  public document: Document = document;
  public window: Window = window;
  constructor() {}
  public sanitization: DomSanitizer;
  public stateService: StateService;
  public changeDetectorRef: ChangeDetectorRef;
  private _ready = false;
  public get ready() {
    return this._ready;
  }
  public set ready(value) {
    this._ready = value;
    this.changeDetectorRef.detectChanges();
  }
  public templateReady = false;
  public templateTree: ObjectTreeImpl;
  public siteTree: ObjectTreeImpl;
  public get siteNode(): ObjectNodeImpl {
    return this.siteTree.treeNode;
  }
  public siteTemplateTree: ObjectTreeImpl;
  public get siteTemplateNode(): ObjectNodeImpl {
    return this.siteTemplateTree.treeNode;
  }
  public pageTree: ObjectTreeImpl;
  public get pageNode(): ObjectNodeImpl {
    return this.pageTree.treeNode;
  }
  public dataTree: ObjectTreeImpl;
  public get templateNode(): ObjectNodeImpl {
    return this.templateTree.treeNode;
  }
  public get dataNode(): ObjectNodeImpl {
    return this.dataTree.treeNode;
  }
  public params: any;
  public initComponent(): void {
    this.templateReady = true;
  }
  public refresh() {
    this.changeDetectorRef.detectChanges();
  }
  public ctrl = {
    ctrl: this,
    init: async (component: IGenericObjectComponent): Promise<void> => {},
  };
  public getPageHref(page: ObjectTreeImpl): string {
    if (page) {
      return this.stateService.href(VIEW_PAGE_ROUTE_NAME, {
        siteId: this.siteTree.id,
        pageId: page.id,
        pageName: page.treeNode.name,
        siteTree: this.siteTree,
        pageTree: page,
        siteName: this.siteTree.treeNode.name,
      });
    }
  }

  public getAdminHref(adminObject: ObjectTreeImpl): string {
    if (adminObject) {
      if (this.siteTree.namespaceName) {
        return this.stateService.href(ADMIN_NAMESPACE_WELCOME_ROUTE_NAME, {
          ownerType: this.siteTree.ownerType,
          ownerName: this.siteTree.ownerName,
          namespaceType: this.siteTree.namespaceType,
          namespaceName: this.siteTree.namespaceName,
        });
      } else if (this.siteTree.ownerName) {
        return this.stateService.href(ADMIN_OWNER_WELCOME_ROUTE_NAME, {
          ownerType: this.siteTree.ownerType,
          ownerName: this.siteTree.ownerName,
        });
      }
      return this.stateService.href(ADMIN_OWNER_WELCOME_ROUTE_NAME, {
        ownerType: 'Tenant',
        ownerName: getOwnerName(),
      });
    }
  }
  public getImgSrc(controlValue: {
    base64?: string;
    type?: string;
    uri?: string;
  }): SafeResourceUrl {
    return controlValue?.base64 && controlValue?.type
      ? this.sanitization.bypassSecurityTrustResourceUrl(
          'data:' + controlValue?.type + ';base64,' + controlValue?.base64
        )
      : controlValue?.uri;
  }

  public getImgBackground(controlValue: {
    base64?: string;
    type?: string;
    uri?: string;
  }): SafeResourceUrl {
    return controlValue?.base64 && controlValue?.type
      ? this.sanitization.bypassSecurityTrustStyle(
          "url('" +
            'data:' +
            controlValue.type +
            ';base64,' +
            controlValue.base64 +
            "')"
        )
      : this.sanitization.bypassSecurityTrustStyle(
          "url('" + controlValue?.uri + "')"
        );
  }

  getColSizes(
    minWidth: 1 | 2 | 3 | 4 | 6 | 8 | 9 | 12,
    maxWith: 1 | 2 | 3 | 4 | 6 | 8 | 9 | 12,
    breakSize: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    keepProportion = false
  ) {
    const sizes = {
      xs: 576,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1400,
    };
    const breakingSize =
      'none' === breakSize
        ? sizes.xs
        : Math.min(
            ...Object.values(sizes).filter((size) => size > sizes[breakSize])
          );
    let returnedSizes = {};
    for (const size in sizes) {
      if (sizes[size] < breakingSize) {
        returnedSizes[size] = 12;
      } else {
        returnedSizes[size] = Math.round(
          minWidth +
            ((maxWith - minWidth) * (sizes[size] - breakingSize)) /
              (sizes.xl - breakingSize)
        );
        if (keepProportion) {
          returnedSizes[size] =
            Math.round(returnedSizes[size] / maxWith) * maxWith;
        }
      }
    }
    return returnedSizes;
  }

  getColClass(
    minWidth: 1 | 2 | 3 | 4 | 6 | 8 | 9 | 12,
    maxWith: 1 | 2 | 3 | 4 | 6 | 8 | 9 | 12,
    breakSize: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    keepProportion = false
  ) {
    const colSizes = this.getColSizes(
      minWidth,
      maxWith,
      breakSize,
      keepProportion
    );
    const returnedClasses = [];
    for (const size in colSizes) {
      returnedClasses.push('col-' + size + '-' + colSizes[size]);
    }
    return returnedClasses.join(' ').replace('col-xs', 'col');
  }

  getColFloatClass(
    minWidth: 1 | 2 | 3 | 4 | 6 | 8 | 9 | 12,
    maxWith: 1 | 2 | 3 | 4 | 6 | 8 | 9 | 12,
    breakSize: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    side: string = 'left',
    keepProportion = false
  ) {
    const colSizes = this.getColSizes(
      minWidth,
      maxWith,
      breakSize,
      keepProportion
    );
    const returnedClasses = [];
    for (const size in colSizes) {
      const sizeClass = 'xs' === size ? '' : '-' + size;
      returnedClasses.push(
        'col' +
          sizeClass +
          '-' +
          colSizes[size] +
          (colSizes[size] !== 12 ? ' float' + sizeClass + '-' + side : '')
      );
    }
    return returnedClasses.join(' ');
  }
}
