import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
  ADMIN_NAMESPACE_ROUTE_NAME,
  ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME,
} from './../../admin.const';
import { StateService } from '@uirouter/angular';
import {
  ADMIN_OWNER_NODE_ROUTE_NAME,
  OBJECT_NODE_TOKEN,
  OBJECT_TREE_TOKEN,
} from '../../admin.const';
import { EditableFormService } from '@jacquesparis/objects-angular-forms';
import { RestEntityListService } from '../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { ObjectsCommonService } from '../../../objects-client/services/objects-common.service';
import { AbstractRestEntityListComponent } from '../../../objects-client/abstract-rest-entity/abstract-rest-entity-list.component';
import {
  ObjectTreeImpl,
  ObjectNodeImpl,
  EntityName,
} from '@jacquesparis/objects-client';
import {
  Component,
  OnInit,
  Input,
  Inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-admin-node-list',
  templateUrl: './admin-node-list.component.html',
  styleUrls: ['./admin-node-list.component.scss'],
})
export class AdminNodeListComponent
  extends AbstractRestEntityListComponent<ObjectNodeImpl>
  implements OnInit {
  @ViewChild('deleteModalTemplate')
  private deleteModalTemplate: TemplateRef<any>;
  deleteModalref: BsModalRef;
  deletedChild: ObjectTreeImpl;
  nodeViewStateName: string = ADMIN_OWNER_NODE_VIEW_ROUTE_NAME;

  constructor(
    @Inject(OBJECT_TREE_TOKEN) public mainTree: ObjectTreeImpl,
    @Inject(OBJECT_NODE_TOKEN) public objectTree: ObjectTreeImpl,
    protected objectsCommonService: ObjectsCommonService,
    protected editableFormService: EditableFormService,
    protected restEntityListService: RestEntityListService,
    protected stateService: StateService,
    private modalService: BsModalService
  ) {
    super(
      objectsCommonService,
      editableFormService,
      restEntityListService,
      EntityName.objectNode,
      EntityName.objectNode,
      EntityName.objectType
    );
    if (this.stateService.current.name.startsWith(ADMIN_NAMESPACE_ROUTE_NAME)) {
      this.nodeViewStateName = ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME;
    }
  }
  openModal(template: TemplateRef<any>) {
    this.deleteModalref = this.modalService.show(template);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public async displayNode(child: ObjectTreeImpl, event: MouseEvent) {
    if (event) {
      event.preventDefault();
      // event.stopPropagation();
    }

    this.stateService.go(
      this.nodeViewStateName,
      _.merge({}, this.stateService.params, { treeId: child.treeNode.id })
    );
  }

  public async deleteNode(child: ObjectTreeImpl, event: MouseEvent) {
    if (event) {
      event.preventDefault();
      // event.stopPropagation();
    }
    this.deletedChild = child;
    this.openModal(this.deleteModalTemplate);
  }

  public async confirmDelete() {
    this.deleteModalref.hide();
    try {
      await this.deletedChild.treeNode.delete();
    } catch (error) {}
  }

  public onChildDrop(event: {
    container: CdkDropList;
    currentIndex: number;
    distance: { x: number; y: number };
    isPointerOverContainer: boolean;
    item: CdkDrag;
    previousContainer: CdkDropList;
    previousIndex: number;
  }) {
    let items: ObjectTreeImpl[] = this.objectTree.children.splice(
      event.previousIndex,
      1
    );
    this.objectTree.children.splice(
      event.currentIndex - (event.previousIndex < event.currentIndex ? 0 : 0),
      0,
      items[0]
    );

    this.objectTree.runAction(
      'sort',
      this.objectTree.children.map((child) => child.treeNode.id)
    );
    console.log(event);
  }
}
