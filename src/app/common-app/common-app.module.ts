import { ElementResizeDirective } from './element-resize/element-resize.directive';
import { UIRouterModule } from '@uirouter/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  JsonFormComponent,
  ObjectsAngularFormsModule,
} from '@jacquesparis/objects-angular-forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SchemaFormModule } from 'ngx-schema-form';
import { Bootstrap4FrameworkModule } from 'angular6-json-schema-form';
import { NgxBootstrapIconsModule, Trash } from 'ngx-bootstrap-icons';
import { AppNavComponent } from './app-nav/app-nav.component';
import { UiRouterStateDirective } from './ui-router-state/ui-router-state.directive';
import { ManagementPageComponent } from './management-page/management-page.component';
const icons = {
  Trash,
};

@NgModule({
  declarations: [
    AppNavComponent,
    UiRouterStateDirective,
    ManagementPageComponent,
    ElementResizeDirective,
  ],
  imports: [
    UIRouterModule,
    CommonModule,
    FormsModule,
    AccordionModule,
    ObjectsAngularFormsModule,
    SchemaFormModule,
    Bootstrap4FrameworkModule,
    NgxBootstrapIconsModule.pick(icons),
  ],
  exports: [
    CommonModule,
    AccordionModule,
    FormsModule,
    ObjectsAngularFormsModule,
    SchemaFormModule,
    Bootstrap4FrameworkModule,
    NgxBootstrapIconsModule,
    AppNavComponent,
    UiRouterStateDirective,
    ManagementPageComponent,
  ],
})
export class CommonAppModule {}
