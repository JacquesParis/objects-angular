import { StateService } from '@uirouter/angular';
import { ObjectTreeImpl, ObjectNodeImpl } from '@jacquesparis/objects-client';
import { IObjectNode } from '@jacquesparis/objects-model';
export interface IGenericObjectComponent {
  stateService: StateService;
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
  params: any;
  initComponent(): void;
}

export interface WebSiteTemplate extends IObjectNode {
  template: string;
}

export abstract class GenericObjectComponent
  implements IGenericObjectComponent {
  public stateService: StateService;
  public ready = false;
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
  public abstract gotoToPage(page: ObjectTreeImpl, event): void;
}
