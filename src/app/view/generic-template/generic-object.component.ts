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
  public goToPage(page: ObjectTreeImpl, event) {
    if (page) {
      window.scrollTo(0, 0);
      this.stateService.go(VIEW_PAGE_ROUTE_NAME, {
        siteId: this.siteTree.id,
        pageId: page.id,
        pageName: page.treeNode.name,
        siteTree: this.siteTree,
        pageTree: page,
        siteName: this.siteTree.treeNode.name,
      });
    }
    if (event) {
      event.preventDefault();
      event.stopPropagation();
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
}
