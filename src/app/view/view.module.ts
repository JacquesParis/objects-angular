import { GenericTemplateComponent } from './generic-template/generic-template.component';
import { DynamicTemplateDirective } from '../common-app/generic-template/dynamic-template.dircetive';
import { VIEW_STATES } from './view.route';
import { UIRouterModule } from '@uirouter/angular';
import { CommonAppModule } from './../common-app/common-app.module';
import {
  Compiler,
  CompilerFactory,
  COMPILER_OPTIONS,
  NgModule,
} from '@angular/core';
import { ViewComponent } from './view/view.component';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';

@NgModule({
  imports: [
    CommonAppModule,
    UIRouterModule.forChild({
      states: VIEW_STATES,
    }),
  ],
  declarations: [ViewComponent, GenericTemplateComponent],
  providers: [],
})
export class ViewModule {}
