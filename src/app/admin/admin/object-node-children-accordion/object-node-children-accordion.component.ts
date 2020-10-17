import { ObjectTree } from '../../../objects-client/models/object-tree';
import { Component, OnInit, Input } from '@angular/core';
import {
  EntityName,
  ObjectNodeImpl,
  ObjectSubTypeImpl,
  ObjectTypeImpl,
} from '@jacquesparis/objects-client';
import { AbstractRestEntityListComponent } from 'src/app/objects-client/abstract-rest-entity/abstract-rest-entity-list.component';
import { ObjectsCommonService } from 'src/app/objects-client/services/objects-common.service';
import { EditableFormService } from '@jacquesparis/objects-angular-forms';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-object-node-children-accordion',
  templateUrl: './object-node-children-accordion.component.html',
  styleUrls: ['./object-node-children-accordion.component.scss'],
})
export class ObjectNodeChildrenAccordionComponent
  extends AbstractRestEntityListComponent<ObjectNodeImpl>
  implements OnInit {
  @Input() objectTree: ObjectTree;
  @Input() objectSubType: ObjectSubTypeImpl;
  private _isOpen: { [childId: string]: boolean } = {};
  constructor(
    protected objectsCommonService: ObjectsCommonService,
    protected editableFormService: EditableFormService
  ) {
    super(
      objectsCommonService,
      editableFormService,
      EntityName.objectNode,
      EntityName.objectNode,
      EntityName.objectType
    );
  }

  public isOpen(child: ObjectTree): boolean {
    return !!this._isOpen[child.id];
  }
  public setOpen(child: ObjectTree, value = true) {
    this._isOpen[child.id] = value;
  }

  public ngOnInit() {
    super.ngOnInit();
  }

  get objectNode(): ObjectNodeImpl {
    return this.objectTree.treeNode;
  }

  public getObjectNode(id) {
    return this.objectsCommonService.getObjectNode(id);
  }

  get objectType(): ObjectTypeImpl {
    return this.objectSubType.objectType;
  }

  get children(): ObjectTree[] {
    return this.objectTree.childrenByType[this.objectType.id] || [];
  }

  get newTree(): ObjectTree {
    return new ObjectTree(this.newEntity, [this.newEntity], {
      [this.objectType.id]: this.objectType,
    });
  }

  public checkLoadedChilds(objectTree: ObjectTree, open) {
    this.setOpen(objectTree, open);

    if (!objectTree.childsLoaded) {
      this.objectsCommonService.loadSubTree(objectTree);
    }
  }
}
