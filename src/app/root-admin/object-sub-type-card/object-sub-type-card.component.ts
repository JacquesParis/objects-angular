import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ObjectSubTypeImpl } from '@jacquesparis/objects-client';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import * as _ from 'lodash-es';
import { AbtractObjectSubTypeComponent } from '../../objects-client/components/abtract-object-sub-type.component';

@Component({
  selector: 'app-object-sub-type-card',
  templateUrl: './object-sub-type-card.component.html',
  styleUrls: ['./object-sub-type-card.component.scss'],
})
export class ObjectSubTypeCardComponent extends AbtractObjectSubTypeComponent {
  @Input() entity: ObjectSubTypeImpl;
  @Output() public onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onSave: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onDelete: EventEmitter<void> = new EventEmitter<void>();

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super(objectsCommonService);
  }
}
