import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import { AbstractRestEntityListComponent } from './../../../objects-client/abstract-rest-entity/abstract-rest-entity-list.component';
import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { Component, OnInit, Input } from '@angular/core';
import {
  EntityName,
  ObjectNodeImpl,
  ObjectSubTypeImpl,
  ObjectTreeImpl,
  ObjectTypeImpl,
} from '@jacquesparis/objects-client';
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
  @Input() objectTree: ObjectTreeImpl;
  @Input() objectSubType: ObjectSubTypeImpl;
  constructor(
    protected objectsCommonService: ObjectsCommonService,
    protected editableFormService: EditableFormService,
    protected restEntityListService: RestEntityListService
  ) {
    super(
      objectsCommonService,
      editableFormService,
      restEntityListService,
      EntityName.objectNode,
      EntityName.objectNode,
      EntityName.objectType
    );
  }

  public ngOnInit() {
    super.ngOnInit();
  }

  get objectNode(): ObjectNodeImpl {
    return this.objectTree.treeNode;
  }

  public getObjectNode(id) {
    return this.objectsCommonService.getObjectNodeById(id);
  }

  get objectType(): ObjectTypeImpl {
    return this.objectsCommonService.getObjectTypeById(
      this.objectSubType.subObjectTypeId
    );
  }

  get children(): ObjectTreeImpl[] {
    return this.objectTree.childrenByType(this.objectType.id);
  }

  get newTree(): ObjectTreeImpl {
    return this.objectsCommonService.newEntity<ObjectTreeImpl>(
      EntityName.objectTree,
      { parentEntity: this.objectTree, entityType: this.objectType }
    );
  }
}
