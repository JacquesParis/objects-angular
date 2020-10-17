import { ObjectTree } from './../../../objects-client/models/object-tree';
import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import {
  ObjectNodeImpl,
  EntityName,
  ObjectTypeImpl,
} from '@jacquesparis/objects-client';
import { Component, Input } from '@angular/core';
import { AbstractRestEntityComponent } from '../../../objects-client/abstract-rest-entity/abstract-rest-entity.component';
import { IObjectNode } from '@jacquesparis/objects-model';

@Component({
  selector: 'app-object-node-card',
  templateUrl: './object-node-card.component.html',
  styleUrls: ['./object-node-card.component.scss'],
})
export class ObjectNodeCardComponent extends AbstractRestEntityComponent<
  IObjectNode,
  ObjectNodeImpl
> {
  @Input() objectTree: ObjectTree;
  @Input() hideNode = false;
  @Input() hideChildren = false;

  get title() {
    return this.entity.name + ' (' + this.treeType.name + ')';
  }

  get entity(): ObjectNodeImpl {
    return this.objectTree.treeNode;
  }

  get treeType() {
    return this.objectTree.treeType;
  }

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super(EntityName.objectNode, objectsCommonService);
  }

  get subTypes() {
    return this.objectTree.treeType.objectSubTypes;
  }
}
