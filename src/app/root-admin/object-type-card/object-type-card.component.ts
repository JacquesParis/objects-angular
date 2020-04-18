import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  ObjectTypeImpl,
  ObjectsTypeService,
} from '@jacquesparis/objects-client';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import { IObjectSubType } from '@jacquesparis/objects-model';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import { EditableFormDirective } from '@jacquesparis/objects-angular-forms';

@Component({
  selector: 'app-object-type-card',
  templateUrl: './object-type-card.component.html',
  styleUrls: ['./object-type-card.component.sass'],
})
export class ObjectTypeCardComponent extends CommonComponentComponent {
  @Input() objectType: ObjectTypeImpl;
  @ViewChild('libEditableForm') libEditableForm: EditableFormDirective;

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super();
  }

  get objectTypes(): ObjectTypeImpl[] {
    return Object.values(this.objectsCommonService.objectTypes);
  }

  switchMode() {
    this.libEditableForm.switchMode();
  }
  saveEditMode() {
    this.libEditableForm.saveEditMode();
    this.objectsCommonService.putObjectType(this.objectType);
  }
}
