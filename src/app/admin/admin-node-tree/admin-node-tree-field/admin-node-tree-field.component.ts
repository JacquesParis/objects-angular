import { StateService } from '@uirouter/angular';
import {
  ADMIN_OWNER_NODE_ROUTE_NAME,
  ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
} from './../../admin.const';
import { EntityName, ObjectTreeImpl } from '@jacquesparis/objects-client';
import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { CommonComponent } from './../../../common-app/common-component/common-component.component';
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  selector: 'app-admin-node-tree-field,[app-admin-node-tree-field]',
  templateUrl: './admin-node-tree-field.component.html',
  styleUrls: ['./admin-node-tree-field.component.scss'],
})
export class AdminNodeTreeFieldComponent
  extends CommonComponent
  implements OnInit {
  @Input() treeChild: ObjectTreeImpl;
  //public nodeState = ADMIN_OWNER_NODE_ROUTE_NAME;
  constructor(
    protected restEntityListService: RestEntityListService,
    public changeDetectorRef: ChangeDetectorRef,
    public stateService: StateService
  ) {
    super();
    /*
    this.registerSubscription(
      this.restEntityListService.subscribe(EntityName.objectTree, () => {
        this.changeDetectorRef.detectChanges();
      })
    );*/
  }
  ngOnInit() {
    this.treeChild.waitForReady();
  }

  isCollapsed(): boolean {
    return !this.restEntityListService.isOpen(
      EntityName.objectTree,
      this.treeChild
    );
  }
  switchCollapsed() {
    this.restEntityListService.switchOpen(
      EntityName.objectTree,
      this.treeChild.id
    );
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

  displayNode() {
    this.stateService.go(ADMIN_OWNER_NODE_VIEW_ROUTE_NAME, {
      treeId: this.treeChild.id,
    });
  }
}
