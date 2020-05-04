import { AbstractRestEntityComponent } from '../abstract-rest-entity/abstract-rest-entity.component';
import { IObjectSubType } from '@jacquesparis/objects-model';
import { ObjectSubTypeImpl, EntityName } from '@jacquesparis/objects-client';
import { ObjectsCommonService } from '../services/objects-common.service';
import { OnInit } from '@angular/core';
import * as _ from 'lodash-es';

export abstract class AbtractObjectSubTypeComponent
  extends AbstractRestEntityComponent<IObjectSubType, ObjectSubTypeImpl>
  implements OnInit {
  entity: ObjectSubTypeImpl;

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super(EntityName.objectSubType, objectsCommonService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.schema = _.cloneDeep(this.schema);
    this.schema.properties.subObjectTypeId.oneOf = [];
    this.objectsCommonService.objectTypesArray.forEach(
      (availableObjectType) => {
        this.schema.properties.subObjectTypeId.oneOf.push({
          enum: [availableObjectType.id],
          title:
            availableObjectType.name + ' - ' + availableObjectType.contentType,
        });
      }
    );
    const objectType = this.objectsCommonService.getObjectType(
      this.entity.objectTypeId
    );
    if (1 < objectType.objectSubTypes.length) {
      const brothers = objectType.objectSubTypes.filter(
        (oneBrother) => oneBrother.id !== this.entity.id
      );

      this.schema.properties.exclusions.items = {
        type: 'string',
        title: 'exclusion',
        enum: [],
        enumNames: [],
      };
      this.schema.properties.mandatories.items = {
        type: 'string',
        title: 'exclusion',
        enum: [],
        enumNames: [],
      };
      brothers.forEach((brother) => {
        this.schema.properties.exclusions.items.enum.push(brother.id);
        this.schema.properties.mandatories.items.enum.push(brother.id);
        this.schema.properties.exclusions.items.enumNames.push(brother.name);
        this.schema.properties.mandatories.items.enumNames.push(brother.name);
      });
    } else {
      delete this.schema.properties.exclusions;
      delete this.schema.properties.mandatories;
    }
  }
}
