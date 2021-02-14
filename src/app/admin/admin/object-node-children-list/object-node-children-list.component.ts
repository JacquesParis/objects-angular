import { EditableFormService } from '@jacquesparis/objects-angular-forms';
import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import { AbstractRestEntityListComponent } from './../../../objects-client/abstract-rest-entity/abstract-rest-entity-list.component';
import {
  ObjectTreeImpl,
  ObjectNodeImpl,
  EntityName,
} from '@jacquesparis/objects-client';
import { Component, OnInit, Input } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-object-node-children-list',
  templateUrl: './object-node-children-list.component.html',
  styleUrls: ['./object-node-children-list.component.scss'],
})
export class ObjectNodeChildrenListComponent
  extends AbstractRestEntityListComponent<ObjectNodeImpl>
  implements OnInit {
  @Input() objectTree: ObjectTreeImpl;
  @Input() tabSet: TabsetComponent;

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

  ngOnInit() {
    super.ngOnInit();
  }

  public async setOpen(child: any, value = true) {
    //  $('#myTab a[href="#profile"]').tab('show') // Select tab by name
    super.setOpen(child, value);
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
  }
}
