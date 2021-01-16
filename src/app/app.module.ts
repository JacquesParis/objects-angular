import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import {
  Compiler,
  CompilerFactory,
  COMPILER_OPTIONS,
  NgModule,
} from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { UIRouterModule } from '@uirouter/angular';
import { ObjectsClientModule } from './objects-client/objects-client.module';
import { CommonAppModule } from './common-app/common-app.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { APP_STATES } from './app.route';
import { HttpClientModule } from '@angular/common/http';
import { RootAdminModule } from './root-admin/root-admin.module';
import { LAZY_STATES } from './app.lazy.route';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  SchemaFormModule,
  WidgetRegistry,
  DefaultWidgetRegistry,
} from 'ngx-schema-form';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import {
  NgxBootstrapIconsModule,
  Trash,
  PlusCircle,
  ChevronBarLeft,
  ChevronBarRight,
  ArrowRightShort,
  ArrowBarUp,
  HourglassSplit,
  FileEarmark,
} from 'ngx-bootstrap-icons';

const icons = {
  Trash,
  PlusCircle,
  ChevronBarLeft,
  ChevronBarRight,
  ArrowRightShort,
  ArrowBarUp,
  HourglassSplit,
  FileEarmark,
};

export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}
@NgModule({
  declarations: [AppComponent, WelcomeComponent],
  entryComponents: [WelcomeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    UIRouterModule.forRoot({
      states: [...APP_STATES, ...LAZY_STATES],
      useHash: true,
    }),
    ModalModule.forRoot(),
    SchemaFormModule.forRoot(),
    ObjectsClientModule,
    CommonAppModule,
    RootAdminModule,
    AccordionModule.forRoot(),
    CollapseModule.forRoot(),
    BrowserAnimationsModule,
    NgxBootstrapIconsModule.pick(icons),
  ],
  providers: [
    { provide: WidgetRegistry, useClass: DefaultWidgetRegistry },
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
  bootstrap: [WelcomeComponent],
})
export class AppModule {
  constructor(compiler: Compiler) {}
}
