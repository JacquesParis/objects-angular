import { DomSanitizer } from '@angular/platform-browser';
import { SideMenuService } from './../../../common-app/side-menu/side-menu.service';
import { StateService } from '@uirouter/angular';
import {
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
  safeName: any;
  //public nodeState = ADMIN_OWNER_NODE_ROUTE_NAME;
  constructor(
    protected restEntityListService: RestEntityListService,
    public changeDetectorRef: ChangeDetectorRef,
    public stateService: StateService,
    protected sideMenuService: SideMenuService,
    protected domSanitizer: DomSanitizer
  ) {
    super();
    /*
    this.registerSubscription(
      this.restEntityListService.subscribe(EntityName.objectTree, () => {
        this.changeDetectorRef.detectChanges();
      })
    );*/
  }
  async ngOnInit(): Promise<void> {
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
      EntityName.objectTree,
      this.treeChild
    );
  }
  switchCollapsed() {
    if (this.isFinalChild()) {
      this.displayNode();
    } else {
      this.restEntityListService.switchOpen(
        EntityName.objectTree,
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
      // event.stopPropagation();
    }
    this.sideMenuService.showMainContent();
    this.stateService.go(ADMIN_OWNER_NODE_VIEW_ROUTE_NAME, {
      treeId: this.treeChild.id,
    });
  }
}
