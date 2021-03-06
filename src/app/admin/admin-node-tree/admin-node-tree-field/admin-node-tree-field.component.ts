import { DomSanitizer } from '@angular/platform-browser';
import { SideMenuService } from './../../../common-app/side-menu/side-menu.service';
import { StateService } from '@uirouter/angular';
import {
  ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME,
  ADMIN_NAMESPACE_ROUTE_NAME,
  ADMIN_OWNER_NODE_ROUTE_NAME,
  ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
} from './../../admin.const';
import { EntityName, ObjectTreeImpl } from '@jacquesparis/objects-client';
import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { CommonComponent } from './../../../common-app/common-component/common-component.component';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
  OnChanges,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-admin-node-tree-field,[app-admin-node-tree-field]',
  templateUrl: './admin-node-tree-field.component.html',
  styleUrls: ['./admin-node-tree-field.component.scss'],
})
export class AdminNodeTreeFieldComponent
  extends CommonComponent
  implements OnInit, OnChanges {
  @Input() treeChild: ObjectTreeImpl;
  @Input() entityListType: string = EntityName.objectTree;
  @Input() defaultAction: (
    tree: ObjectTreeImpl
  ) => void = this.displayNodeInMainContent.bind(this);
  @Input() postDisplay: TemplateRef<any>;
  safeName: any;
  nodeViewStateName: string = ADMIN_OWNER_NODE_VIEW_ROUTE_NAME;
  //public nodeState = ADMIN_OWNER_NODE_ROUTE_NAME;
  constructor(
    protected restEntityListService: RestEntityListService,
    public changeDetectorRef: ChangeDetectorRef,
    public stateService: StateService,
    protected sideMenuService: SideMenuService,
    protected domSanitizer: DomSanitizer
  ) {
    super();

    if (this.stateService.current.name.startsWith(ADMIN_NAMESPACE_ROUTE_NAME)) {
      this.nodeViewStateName = ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME;
    }
  }
  async ngOnInit(): Promise<void> {
    if (undefined === this.defaultAction) {
      this.defaultAction = this.displayNodeInMainContent.bind(this);
    }
    this.calculateHtml();
    await this.treeChild.waitForReady();
    this.calculateHtml();
  }

  calculateHtml() {
    if (this.treeChild) {
      this.safeName = this.domSanitizer.bypassSecurityTrustHtml(
        this.treeChild.entityCtx?.preview?.html
          ? this.treeChild.entityCtx.preview.html
          : this.treeChild.treeNode.name
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.calculateHtml();
  }

  isCollapsed(): boolean {
    return !this.restEntityListService.isOpen(
      this.entityListType,
      this.treeChild
    );
  }
  switchCollapsed() {
    if (this.isFinalChild()) {
      this.displayNode();
    } else {
      this.restEntityListService.switchOpen(
        this.entityListType,
        this.treeChild.id
      );
    }
  }

  mayDisplay(): boolean {
    return (
      !this.isCollapsed() &&
      this.treeChild.isReady &&
      0 < this.treeChild.children.length
    );
  }

  mayOpen(): boolean {
    return this.treeChild.isReady && 0 < this.treeChild.children.length;
  }

  isFinalChild(): boolean {
    return this.treeChild.isReady && 0 === this.treeChild.children.length;
  }

  isLoading(): boolean {
    return !this.treeChild.isReady;
  }

  displayNode(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.restEntityListService.setOpen(this.entityListType, this.treeChild.id);
    this.defaultAction(this.treeChild);
  }
  displayNodeInMainContent(tree: ObjectTreeImpl) {
    this.sideMenuService.showMainContent();
    this.stateService.go(this.nodeViewStateName, {
      treeId: tree.id,
    });
  }
}
