import { AdminWelcomeComponent } from './admin-frames/admin-welcome/admin-welcome.component';
import { AdminNodeViewComponent } from './admin-node/admin-node-view/admin-node-view.component';
import { AdminNodeComponent } from './admin-node/admin-node.component';
import { AdminNodeTreeFieldComponent } from './admin-node-tree/admin-node-tree-field/admin-node-tree-field.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AdminFramesComponent } from './admin-frames/admin-frames.component';
import { ObjectNodeChildrenListComponent } from './admin/object-node-children-list/object-node-children-list.component';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin/admin.component';
import { ObjectNodesListComponent } from './admin/object-nodes-list/object-nodes-list.component';
import { CommonAppModule } from '../common-app/common-app.module';
import { UIRouterModule } from '@uirouter/angular';
import { ADMIN_STATES } from './admin.route';
import { ObjectNodeCardComponent } from './admin/object-node-card/object-node-card.component';
import { ObjectNodeChildrenAccordionComponent } from './admin/object-node-children-accordion/object-node-children-accordion.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { AdminNodeTreeComponent } from './admin-node-tree/admin-node-tree.component';
import { AdminNodeListComponent } from './admin-node/admin-node-list/admin-node-list.component';
@NgModule({
  declarations: [
    AdminComponent,
    ObjectNodesListComponent,
    ObjectNodeCardComponent,
    ObjectNodeChildrenAccordionComponent,
    ObjectNodeChildrenListComponent,
    AdminFramesComponent,
    AdminNodeTreeComponent,
    AdminNodeTreeFieldComponent,
    AdminNodeComponent,
    AdminNodeListComponent,
    AdminNodeViewComponent,
    AdminWelcomeComponent,
  ],
  exports: [ObjectNodesListComponent, ObjectNodeCardComponent],
  imports: [
    CommonAppModule,
    UIRouterModule.forChild({
      states: ADMIN_STATES,
    }),
    TabsModule.forRoot(),
    DragDropModule,
    CollapseModule,
  ],
})
export class AdminModule {}
