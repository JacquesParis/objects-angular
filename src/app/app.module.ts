import { EntityObservationInterceptor } from './common-app/services/entity-observation.interceptor';
import { EntityObservationService } from './common-app/services/entity-observation.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { UIRouterModule } from '@uirouter/angular';
import { ObjectsClientModule } from './objects-client/objects-client.module';
import { CommonAppModule } from './common-app/common-app.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { APP_STATES } from './app.route';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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

// RECOMMENDED
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';

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
  Folder,
  Folder2Open,
  BoxArrowUp,
  BoxArrowLeft,
  BoxArrowRight,
  BoxArrowDown,
  ArrowUpLeft,
  ChevronRight,
  ChevronDown,
  ArrowRepeat,
  Eye,
  ArrowDownUp,
  Pencil,
  ClipboardCheck,
  PlayFill,
  PencilSquare,
  BoxArrowInRight,
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
  Folder,
  Folder2Open,
  BoxArrowUp,
  BoxArrowLeft,
  BoxArrowRight,
  BoxArrowDown,
  ArrowUpLeft,
  ChevronRight,
  ChevronDown,
  ArrowRepeat,
  Eye,
  ArrowDownUp,
  Pencil,
  ClipboardCheck,
  PlayFill,
  PencilSquare,
  BoxArrowInRight,
};

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
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    { provide: WidgetRegistry, useClass: DefaultWidgetRegistry },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EntityObservationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [WelcomeComponent],
})
export class AppModule {
  constructor() {
    defineLocale('fr', frLocale);
  }
}
