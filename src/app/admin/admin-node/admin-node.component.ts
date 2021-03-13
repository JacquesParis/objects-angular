import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  OBJECT_NODE_TOKEN,
  OBJECT_TREE_TOKEN,
  ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
  ADMIN_OWNER_NODE_LIST_ROUTE_NAME,
  ADMIN_OWNER_NODE_CREATE_TYPE_ROUTE_NAME,
  ADMIN_NAMESPACE_ROUTE_NAME,
  ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME,
  ADMIN_NAMESPACE_NODE_LIST_ROUTE_NAME,
  ADMIN_NAMESPACE_NODE_CREATE_TYPE_ROUTE_NAME,
} from './../admin.const';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';

import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { RestEntityListService } from './../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { VIEW_ROUTE_NAME } from './../../view/view.const';
import { StateService } from '@uirouter/angular';
import { ObjectsCommonService } from './../../objects-client/services/objects-common.service';
import {
  ObjectNodeImpl,
  EntityName,
  ObjectTypeImpl,
  ObjectTreeImpl,
} from '@jacquesparis/objects-client';
import {
  Input,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AbstractRestEntityComponent } from '../../objects-client/abstract-rest-entity/abstract-rest-entity.component';
import {
  IObjectNode,
  IObjectType,
  IObjectSubType,
  IMoveToAction,
} from '@jacquesparis/objects-model';
import { merge, map } from 'lodash-es';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'app-admin-node',
  templateUrl: './admin-node.component.html',
  styleUrls: ['./admin-node.component.scss'],
})
export class AdminNodeComponent
  extends AbstractRestEntityComponent<IObjectNode, ObjectNodeImpl>
  implements OnInit, OnDestroy, OnChanges {
  @Input() hideNode = false;
  @Input() hideChildren = false;
  @ViewChildren(TabsetComponent) tabSet!: QueryList<TabsetComponent>;

  public title: string;

  public entity: ObjectNodeImpl;

  public treeType: IObjectType;
  public hasWebSite: boolean = false;
  public params: { [paramName: string]: any };
  public nodeViewStateName = ADMIN_OWNER_NODE_VIEW_ROUTE_NAME;
  public nodeListStateName = ADMIN_OWNER_NODE_LIST_ROUTE_NAME;
  public nodeCreateTypeStateName = ADMIN_OWNER_NODE_CREATE_TYPE_ROUTE_NAME;
  public parentTree: ObjectTreeImpl;
  public previousTree: ObjectTreeImpl;
  public nextTree: ObjectTreeImpl;
  public creations: { typeId: string; icon?: string }[] = [];
  navBarHeight: string = '0px';
  safeName: SafeHtml;
  moveTo: IMoveToAction[] = [];
  public get isCreationActive(): boolean {
    return this.stateService.current.name.startsWith(
      this.nodeCreateTypeStateName
    );
  }
  public get isCreationOrActionsActive(): boolean {
    return this.isCreationActive;
  }
  constructor(
    @Inject(OBJECT_TREE_TOKEN) public mainTree: ObjectTreeImpl,
    @Inject(OBJECT_NODE_TOKEN) public objectTree: ObjectTreeImpl,
    protected objectsCommonService: ObjectsCommonService,
    protected stateService: StateService,
    protected restEntityListService: RestEntityListService,
    protected changeDetectorRef: ChangeDetectorRef,
    private domSanitizer: DomSanitizer
  ) {
    super(EntityName.objectNode, objectsCommonService, restEntityListService);
    if (this.stateService.current.name.startsWith(ADMIN_NAMESPACE_ROUTE_NAME)) {
      this.nodeViewStateName = ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME;
      this.nodeListStateName = ADMIN_NAMESPACE_NODE_LIST_ROUTE_NAME;
      this.nodeCreateTypeStateName = ADMIN_NAMESPACE_NODE_CREATE_TYPE_ROUTE_NAME;
    }
  }

  async ngOnInit() {
    if (this.objectTree) {
      this.params = this.stateService.params;

      this.entity = this.objectTree.treeNode;
      await this.objectTree.waitForReady();

      await this.entity.waitForReady();

      await super.ngOnInit();
      if (this.entity.webSiteObjectTreeUri && this.objectTree.aliasUri) {
        this.hasWebSite = true;
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  async initEntity() {
    this.calculateParentAndBrother();
    this.creations =
      this.objectTree.entityCtx &&
      this.objectTree.entityCtx.actions &&
      this.objectTree.entityCtx.actions.creations
        ? map(
            Object.keys(this.objectTree.entityCtx.actions.creations),
            (typeId) => ({
              typeId: typeId,
              icon: this.objectTree.entityCtx.actions.creations[typeId].icon,
            })
          )
        : [];

    this.treeType = this.objectTree.treeNode.objectType;
    this.title =
      this.entity.name + ' (' + this.objectTree.treeNode.objectTypeId + ')';

    if (
      this.entity.entityCtx &&
      this.entity.entityCtx.actions &&
      this.entity.entityCtx.actions.moveTo
    ) {
      this.moveTo = this.entity.entityCtx.actions.moveTo;
    }

    this.calculateHtml();
    await super.initEntity();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    super.ngOnChanges(changes);
    this.calculateHtml();
  }

  calculateHtml() {
    if (this.objectTree) {
      this.safeName = this.domSanitizer.bypassSecurityTrustHtml(
        this.objectTree.entityCtx?.preview?.html
          ? this.objectTree.entityCtx.preview.html
          : this.objectTree.treeNode.name
      );
    }
  }

  setNavbarSize(size: { width: number; height: number }) {
    if ('' + size.height + 'px' !== this.navBarHeight) {
      this.navBarHeight = '' + size.height + 'px';
      this.changeDetectorRef.detectChanges();
    }
  }

  calculateParentAndBrother() {
    this.parentTree = this.objectsCommonService.getObjectTreeById(
      this.objectTree.treeNode.parentNodeId
    );
    if (this.parentTree) {
      const index = this.parentTree.children
        .map((child) => child.id)
        .indexOf(this.objectTree.id);
      if (0 < index) {
        this.previousTree = this.parentTree.children[index - 1];
      }
      if (index < this.parentTree.children.length - 1) {
        this.nextTree = this.parentTree.children[index + 1];
      }
    }
  }

  public async displayNode(child: ObjectTreeImpl, event: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    return this.stateService.go(
      this.nodeViewStateName,
      merge({}, this.stateService.params, { treeId: child.treeNode.id })
    );
  }

  public refresh(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.objectsCommonService.getTreeByUri(this.objectTree.uri);

    this.objectsCommonService.getNodeByUri(this.entity.uri);
  }

  public async createNode(typeId: string, event: MouseEvent) {
    if (event) {
      event.preventDefault();
      // event.stopPropagation();
    }

    return this.stateService.go(
      this.nodeCreateTypeStateName,
      merge({}, this.stateService.params, { typeId: typeId })
    );
  }

  public async moveNode(move: IMoveToAction, event: MouseEvent) {
    await this.objectTree.runAction('moveTo', {
      targetId: move.id,
      targetUri: move.uri,
    });
    await this.objectsCommonService.getTreeById(
      this.objectTree.treeNode.parentNodeId
    );
    await this.objectsCommonService.getTreeById(move.id);
    await this.objectsCommonService.getNodeByUri(this.objectTree.treeNode.uri);
  }

  public openWebSite() {
    this.stateService.go(VIEW_ROUTE_NAME, {
      siteTree: this.objectTree,
      siteId: this.objectTree.id,
    });
  }
}
