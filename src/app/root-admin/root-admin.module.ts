import { AdminModule } from './../admin/admin.module';
import { NgModule } from '@angular/core';
import { RootAdminComponent } from './root-admin/root-admin.component';
import { CommonAppModule } from '../common-app/common-app.module';
import { ROOT_ADMIN_STATES } from './root-admin.route';
import { UIRouterModule } from '@uirouter/angular';
import { ObjectTypesListComponent } from './object-types-list/object-types-list.component';
import { ObjectTypeCardComponent } from './object-type-card/object-type-card.component';
import { ObjectSubTypesAccordionComponent } from './object-sub-types-accordion/object-sub-types-accordion.component';
import { ObjectSubTypeCardComponent } from './object-sub-type-card/object-sub-type-card.component';

@NgModule({
  imports: [
    CommonAppModule,
    AdminModule,
    UIRouterModule.forChild({
      states: ROOT_ADMIN_STATES,
    }),
  ],
  declarations: [
    RootAdminComponent,
    ObjectTypesListComponent,
    ObjectTypeCardComponent,
    ObjectSubTypesAccordionComponent,
    ObjectSubTypeCardComponent,
  ],
  entryComponents: [RootAdminComponent],
  exports: [],
})
export class RootAdminModule {}
