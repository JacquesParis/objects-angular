import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import { extend } from '@uirouter/core';
import { RestEntityImpl } from '@jacquesparis/objects-client/lib/rest/rest-entity.impl';
import {
  IEntityPropertiesWrapper,
  EntityName,
} from '@jacquesparis/objects-client';
import {
  IJsonSchema,
  IJsonLayoutPorperty,
} from '@jacquesparis/objects-angular-forms';
import { IRestEntity } from '@jacquesparis/objects-model';
import { ObjectsCommonService } from '../services/objects-common.service';

export abstract class AbstractRestEntityComponent<
  Entity extends IRestEntity,
  EntityWrapper extends IEntityPropertiesWrapper<Entity>
> extends CommonComponentComponent {
  entity: EntityWrapper;
  public schema: IJsonSchema;
  public layout: IJsonLayoutPorperty[] = [];
  constructor(
    protected entityTypeName: EntityName,
    protected objectsCommonService: ObjectsCommonService
  ) {
    super();
    this.schema = this.objectsCommonService.getSchema(this.entityTypeName);
  }

  get saveValueMethod() {
    return this.saveValue.bind(this);
  }

  public async saveValue(value: Partial<Entity>): Promise<void> {
    await this.entity.updateEditionProperties(value);
  }
}
