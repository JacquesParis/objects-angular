import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ObjectsAngularFormsModule } from '@jacquesparis/objects-angular-forms';
// RECOMMENDED
import { AccordionModule } from 'ngx-bootstrap/accordion';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AccordionModule,
    ObjectsAngularFormsModule,
  ],
  exports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AccordionModule,
    FormsModule,
    ObjectsAngularFormsModule,
  ],
})
export class CommonAppModule {}
