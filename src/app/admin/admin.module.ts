import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { ObjectNodesListComponent } from './admin/object-nodes-list/object-nodes-list.component';
import { CommonAppModule } from '../common-app/common-app.module';
import { UIRouterModule } from '@uirouter/angular';
import { ADMIN_STATES } from './admin.route';

@NgModule({
  declarations: [AdminComponent, ObjectNodesListComponent],
  imports: [
    CommonAppModule,
    UIRouterModule.forChild({
      states: ADMIN_STATES,
    }),
  ],
})
export class AdminModule {}
