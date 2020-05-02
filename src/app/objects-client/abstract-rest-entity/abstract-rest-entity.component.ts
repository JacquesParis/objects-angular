import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
} from '@angular/core';
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
> extends CommonComponentComponent implements OnInit {
  entity: EntityWrapper;
  public schema: IJsonSchema;
  public layout: IJsonLayoutPorperty[] = [];
  public abstract onCancel: EventEmitter<void>;
  public abstract onSave: EventEmitter<void>;
  public abstract onDelete: EventEmitter<void>;
  constructor(
    protected entityTypeName: EntityName,
    protected objectsCommonService: ObjectsCommonService
  ) {
    super();
  }

  ngOnInit() {
    this.schema = this.objectsCommonService.getSchema(this.entityTypeName);
  }

  get saveValueMethod(): (value) => Promise<void> {
    return this.saveValue.bind(this);
  }

  get deleteValueMethod(): () => Promise<void> {
    return this.deleteValue.bind(this);
  }

  protected async onNewEntityCreated(): Promise<void> {
    this.objectsCommonService.registerNewlyCreatedEntity(
      this.entityTypeName,
      this.entity
    );
    return;
  }

  protected async onEntityDeleted(): Promise<void> {
    this.objectsCommonService.unRegisterEntity(
      this.entityTypeName,
      this.entity
    );
    return;
  }

  public async saveValue(value: Partial<Entity>): Promise<void> {
    const isNew = this.entity.isNewEntity;
    await this.entity.updateEditionProperties(value);
    if (isNew) {
      await this.onNewEntityCreated();
    }
    this.onSave.emit();
    return;
  }

  public async deleteValue(): Promise<void> {
    await this.entity.delete();
    await this.onEntityDeleted();
    this.onDelete.emit();
    return;
  }

  public cancelAction() {
    this.onCancel.emit();
  }
}
