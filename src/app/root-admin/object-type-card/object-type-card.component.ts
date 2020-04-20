import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  ObjectTypeImpl,
  ObjectsTypeService,
} from '@jacquesparis/objects-client';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import { EditableFormDirective } from '@jacquesparis/objects-angular-forms';
import { IJsonSchema } from '@jacquesparis/objects-angular-forms/lib/editable-abstract/i-json-schema';

const OBJECT_TYPE_SCHEMA = {
  properties: {
    name: {
      type: 'string',
      description: 'Object type name',
    },
    type: {
      type: 'string',
      description: 'Stockage type',
    },
    definitionString: {
      type: 'string',
      description: 'Object type json schema description',
      widget: 'textarea',
    },
  },
};

@Component({
  selector: 'app-object-type-card',
  templateUrl: './object-type-card.component.html',
  styleUrls: ['./object-type-card.component.sass'],
})
export class ObjectTypeCardComponent extends CommonComponentComponent
  implements OnInit {
  @Input() objectType: ObjectTypeImpl;
  @ViewChild('libEditableForm') libEditableForm: EditableFormDirective;

  public objectTypeSchema: IJsonSchema = OBJECT_TYPE_SCHEMA;
  public editionProperties: Partial<ObjectTypeImpl>;

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
    this.editionProperties = this.objectType.editionProperties;
  }

  public onChange(editionProperties: Partial<ObjectTypeImpl>) {
    this.objectType.editionProperties = editionProperties;
    this.editionProperties = this.objectType.editionProperties;
  }

  get objectTypes(): ObjectTypeImpl[] {
    return this.objectsCommonService.objectTypesArray;
  }

  switchMode() {
    this.libEditableForm.switchMode();
  }
  saveEditMode() {
    this.libEditableForm.saveEditMode();
    this.objectType.save();
  }
}
