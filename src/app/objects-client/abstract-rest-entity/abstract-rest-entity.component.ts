import { OnInit, EventEmitter, Output } from '@angular/core';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import {
  IEntityPropertiesWrapper,
  EntityName,
} from '@jacquesparis/objects-client';
import { IRestEntity } from '@jacquesparis/objects-model';
import {
  IJsonSchema,
  IJsonLayoutProperty,
} from '@jacquesparis/objects-angular-forms';
import { ObjectsCommonService } from '../services/objects-common.service';

export abstract class AbstractRestEntityComponent<
    Entity extends IRestEntity,
    EntityWrapper extends IEntityPropertiesWrapper<Entity>
  >
  extends CommonComponentComponent
  implements OnInit {
  abstract entity: EntityWrapper;
  public schema: IJsonSchema;
  public layout: IJsonLayoutProperty[] = [];
  @Output() public onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onSave: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();
  constructor(
    protected entityTypeName: EntityName,
    protected objectsCommonService: ObjectsCommonService
  ) {
    super();
  }

  ngOnInit() {
    this.schema = this.objectsCommonService.getSchema(
      this.entityTypeName,
      this.entity
    );
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
