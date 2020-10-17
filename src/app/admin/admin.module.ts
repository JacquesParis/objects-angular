import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { ObjectNodesListComponent } from './admin/object-nodes-list/object-nodes-list.component';
import { CommonAppModule } from '../common-app/common-app.module';
import { UIRouterModule } from '@uirouter/angular';
import { ADMIN_STATES } from './admin.route';
import { ObjectNodeCardComponent } from './admin/object-node-card/object-node-card.component';
import { ObjectNodeChildrenAccordionComponent } from './admin/object-node-children-accordion/object-node-children-accordion.component';

@NgModule({
  declarations: [
    AdminComponent,
    ObjectNodesListComponent,
    ObjectNodeCardComponent,
    ObjectNodeChildrenAccordionComponent,
  ],
  exports: [ObjectNodesListComponent, ObjectNodeCardComponent],
  imports: [
    CommonAppModule,
    UIRouterModule.forChild({
      states: ADMIN_STATES,
    }),
  ],
})
export class AdminModule {}
