import { GenericTemplateComponent } from './generic-template/generic-template.component';
import { DynamicTemplateDirective } from './generic-template/dynamic-template.dircetive';
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

export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}

@NgModule({
  imports: [
    CommonAppModule,
    UIRouterModule.forChild({
      states: VIEW_STATES,
    }),
  ],
  declarations: [
    ViewComponent,
    DynamicTemplateDirective,
    GenericTemplateComponent,
  ],
  providers: [
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS],
    },
    {
      provide: Compiler,
      useFactory: createCompiler,
      deps: [CompilerFactory],
    },
  ],
})
export class ViewModule {}
