import { GenericMustacheTemplateComponent } from './generic-mustache-template/generic-mustache-template.component';
import { VIEW_STATES } from './view.route';
import { UIRouterModule } from '@uirouter/angular';
import { CommonAppModule } from './../common-app/common-app.module';
import { NgModule } from '@angular/core';
import { ViewComponent } from './view/view.component';

@NgModule({
  imports: [
    CommonAppModule,
    UIRouterModule.forChild({
      states: VIEW_STATES,
    }),
  ],
  declarations: [ViewComponent, GenericMustacheTemplateComponent],
  providers: [],
})
export class ViewModule {}
