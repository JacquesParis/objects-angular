import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  OBJECT_NODE_TOKEN,
  OBJECT_TREE_TOKEN,
  ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
  ADMIN_OWNER_NODE_LIST_ROUTE_NAME,
  ADMIN_OWNER_NODE_CREATE_TYPE_ROUTE_NAME,
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
} from '@jacquesparis/objects-model';
import * as _ from 'lodash-es';
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
  public subTypes: IObjectSubType[] = [];
  public hasWebSite: boolean = false;
  public params: { [paramName: string]: any };
  public nodeViewStateName = ADMIN_OWNER_NODE_VIEW_ROUTE_NAME;
  public nodeListStateName = ADMIN_OWNER_NODE_LIST_ROUTE_NAME;
  public nodeCreateTypeStateName = ADMIN_OWNER_NODE_CREATE_TYPE_ROUTE_NAME;
  public parentTree: ObjectTreeImpl;
  public previousTree: ObjectTreeImpl;
  public nextTree: ObjectTreeImpl;
  public creations: string[] = [];
  navBarHeight: string = '0px';
  safeName: SafeHtml;

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
      _.merge({}, this.stateService.params, { treeId: child.treeNode.id })
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
      _.merge({}, this.stateService.params, { typeId: typeId })
    );
  }

  async ngOnInit() {
    if (this.objectTree) {
      this.calculateParentAndBrother();
      this.params = this.stateService.params;
      this.creations =
        this.objectTree.entityCtx &&
        this.objectTree.entityCtx.actions &&
        this.objectTree.entityCtx.actions.creations
          ? Object.keys(this.objectTree.entityCtx.actions.creations)
          : [];

      this.entity = this.objectTree.treeNode;
      await this.objectTree.waitForReady();

      await this.entity.waitForReady();

      this.treeType = this.objectTree.treeNode.objectType;
      this.title =
        this.entity.name + ' (' + this.objectTree.treeNode.objectTypeId + ')';
      let objectChildTypes = [];
      if (
        this.objectTree.entityCtx &&
        this.objectTree.entityCtx.actions &&
        this.objectTree.entityCtx.actions.reads
      ) {
        objectChildTypes = this.objectTree.entityCtx.actions.reads;
      }
      if (this.entity.objectType) {
        this.subTypes = this.entity.objectType.objectSubTypes.filter(
          (subType) => -1 < objectChildTypes.indexOf(subType.subObjectTypeId)
        );
      }

      this.calculateHtml();
      await super.ngOnInit();
      if (this.entity.webSiteObjectTreeUri && this.objectTree.aliasUri) {
        this.hasWebSite = true;
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  public openWebSite() {
    this.stateService.go(VIEW_ROUTE_NAME, {
      siteTree: this.objectTree,
      siteId: this.objectTree.id,
    });
  }
}
