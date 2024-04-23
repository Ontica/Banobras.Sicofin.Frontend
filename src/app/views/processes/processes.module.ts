/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';

import { SharedModule } from '@app/shared/shared.module';

import {
  AccountingCalendarsEditorComponent
} from './accounting-calendars-editor/accounting-calendars-editor.component';

import {
  ExternalProcessSubmitterComponent
} from './external-process-submitter/external-process-submitter.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],
  declarations: [
    AccountingCalendarsEditorComponent,
    ExternalProcessSubmitterComponent,
  ],
  exports: [
    AccountingCalendarsEditorComponent,
    ExternalProcessSubmitterComponent,
  ],
})
export class ProcessesModule { }
