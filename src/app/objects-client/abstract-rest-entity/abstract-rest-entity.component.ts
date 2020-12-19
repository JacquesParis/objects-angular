import { RestEntityListService } from './rest-entity-list.service';
import { OnInit, EventEmitter, Output } from '@angular/core';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
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
  extends CommonComponentComponent
  implements OnInit {
  abstract entity: EntityWrapper;
  public schema: IJsonSchema;
  public isReady: boolean = false;
  public layout: IJsonLayoutProperty[] = [];
  public actions: IEntityMethod[] = [];
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

  public runActionMethod: (method: IEntityMethod, args) => Promise<void>;

  async ngOnInit() {
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

  public async runAction(method: IEntityMethod, args): Promise<any> {
    return this.entity.runAction(method, args);
  }
}
