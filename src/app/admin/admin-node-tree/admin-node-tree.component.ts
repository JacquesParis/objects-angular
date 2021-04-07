import { CommonComponent } from './../../common-app/common-component/common-component.component';
import { RestEntityListService } from './../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { OBJECT_TREE_TOKEN } from './../admin.const';
import { ObjectTreeImpl, EntityName } from '@jacquesparis/objects-client';
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  Input,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-admin-node-tree,[app-admin-node-tree]',
  templateUrl: './admin-node-tree.component.html',
  styleUrls: ['./admin-node-tree.component.scss'],
})
export class AdminNodeTreeComponent extends CommonComponent implements OnInit {
  @Input() entityListType: string = EntityName.objectTree;
  @Input() defaultAction: (tree: ObjectTreeImpl) => void;
  @Input() postDisplay: TemplateRef<any>;
  constructor(
    @Inject(OBJECT_TREE_TOKEN) public objectTree: ObjectTreeImpl,
    protected restEntityListService: RestEntityListService
  ) {
    super();
  }

  ngOnInit() {}
}
