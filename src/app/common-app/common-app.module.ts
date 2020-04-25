import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ObjectsAngularFormsModule } from '@jacquesparis/objects-angular-forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SchemaFormModule } from 'ngx-schema-form';
import { Bootstrap4FrameworkModule } from 'angular6-json-schema-form';
@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AccordionModule,
    ObjectsAngularFormsModule,
    SchemaFormModule,
    Bootstrap4FrameworkModule,
  ],
  exports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AccordionModule,
    FormsModule,
    ObjectsAngularFormsModule,
    SchemaFormModule,
    Bootstrap4FrameworkModule,
  ],
})
export class CommonAppModule {}
