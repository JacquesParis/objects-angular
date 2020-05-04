import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import { RestEntityImpl } from '@jacquesparis/objects-client/lib/rest/rest-entity.impl';
import { ObjectsCommonService } from '../services/objects-common.service';
import { EntityName } from '@jacquesparis/objects-client';
export class AbstractRestEntityListComponent<
  T extends RestEntityImpl<T>
> extends CommonComponentComponent {
  public newEntity: T;
  public inCreation = false;

  constructor(
    protected objectsCommonService: ObjectsCommonService,
    protected entityName: EntityName,
    protected parentEntityName?: EntityName
  ) {
    super();
  }

  public createNewEntity() {
    this.newEntity = this.objectsCommonService.newEntity<T>(
      this.entityName,
      this[this.parentEntityName]
    );
    this.inCreation = true;
  }

  public endCreation() {
    this.inCreation = false;
  }
}
