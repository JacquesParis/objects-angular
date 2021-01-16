import { RestEntityListService } from './rest-entity-list.service';
import {
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonComponent } from '../../common-app/common-component/common-component.component';
import {
  IEntityPropertiesWrapper,
  EntityName,
} from '@jacquesparis/objects-client';
import { IEntityMethod, IRestEntity } from '@jacquesparis/objects-model';
import {
  IJsonSchema,
  IJsonLayoutProperty,
} from '@jacquesparis/objects-angular-forms';
import { ObjectsCommonService } from '../services/objects-common.service';

export abstract class AbstractRestEntityComponent<
    Entity extends IRestEntity,
    EntityWrapper extends IEntityPropertiesWrapper<Entity>
  >
  extends CommonComponent
  implements OnInit, OnChanges {
  abstract entity: EntityWrapper;
  public schema: IJsonSchema;
  public isReady: boolean = false;
  public layout: IJsonLayoutProperty[] = [];
  public actions: IEntityMethod[] = [];
  public crud: { delete: boolean; update: boolean } = {
    delete: false,
    update: false,
  };
  @Output() public onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onSave: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();
  constructor(
    protected entityTypeName: EntityName,
    protected objectsCommonService: ObjectsCommonService,
    protected restEntityListService: RestEntityListService
  ) {
    super();
  }

  public saveValueMethod: (value) => Promise<void>;

  public deleteValueMethod: () => Promise<void>;

  public runActionMethod: (methodId: string, args) => Promise<void>;

  async ngOnInit(): Promise<void> {
    if (this.entity) {
      await this.initEntity();
      this.registerSubscription(
        this.entity.onChange((): void => {
          this.isReady = false;
          this.initEntity();
        })
      );
    }
  }
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.isReady = false;
    if (this.entity) {
      await this.initEntity();
    }
  }

  async initEntity() {
    await this.entity.waitForReady();
    this.schema = this.objectsCommonService.getSchema(
      this.entityTypeName,
      this.entity
    );
    this.saveValueMethod = this.saveValue.bind(this);
    this.deleteValueMethod = this.deleteValue.bind(this);
    this.runActionMethod = this.runAction.bind(this);
    this.actions = this.entity.entityCtx?.actions?.methods
      ? this.entity.entityCtx.actions.methods
      : [];
    this.crud = this.entity.entityCtx?.aclCtx?.rights
      ? this.entity.entityCtx.aclCtx.rights
      : {
          delete: false,
          update: false,
        };
    this.isReady = true;
  }

  protected async onNewEntityCreated(): Promise<void> {
    return;
  }

  protected async onEntityDeleted(): Promise<void> {
    return;
  }

  public async saveValue(value: Partial<Entity>): Promise<void> {
    const isNew = this.entity.isNewEntity;
    await this.entity.updateEditionProperties(value);
    if (isNew) {
      await this.onNewEntityCreated();
    }
    this.schema = this.objectsCommonService.getSchema(
      this.entityTypeName,
      this.entity
    );
    this.actions = this.entity.entityCtx?.actions?.methods
      ? this.entity.entityCtx.actions.methods
      : [];
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

  public async runAction(methodId: string, args): Promise<any> {
    return this.entity.runAction(methodId, args);
  }
}
