import { EditableFormService } from '@jacquesparis/objects-angular-forms';
import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { StateService } from '@uirouter/angular';
import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import { AbstractRestEntityListComponent } from './../../../objects-client/abstract-rest-entity/abstract-rest-entity-list.component';
import {
  ObjectTreeImpl,
  ObjectNodeImpl,
  EntityName,
} from '@jacquesparis/objects-client';
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

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
}
