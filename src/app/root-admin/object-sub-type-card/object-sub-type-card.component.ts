import { Component, OnInit, Input } from '@angular/core';
import { ObjectTypeImpl } from '@jacquesparis/objects-client';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import { IObjectSubType } from '@jacquesparis/objects-model';

@Component({
  selector: 'app-object-sub-type-card',
  templateUrl: './object-sub-type-card.component.html',
  styleUrls: ['./object-sub-type-card.component.sass'],
})
export class ObjectSubTypeCardComponent extends CommonComponentComponent {
  @Input() objectType: ObjectTypeImpl;
  @Input() subType: IObjectSubType;

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super();
  }

  get objectTypes(): ObjectTypeImpl[] {
    return Object.values(this.objectsCommonService.objectTypes);
  }

  get brothers(): IObjectSubType[] {
    return this.objectType.objectSubTypes.filter(
      (oneBrother) => oneBrother.id !== this.subType.id
    );
  }
}
