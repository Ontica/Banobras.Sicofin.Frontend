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
  ExternalVariableEditorComponent
} from './external-variables-edition/external-variable-editor.component';
import {
  ExternalVariablesEditionComponent
} from './external-variables-edition/external-variables-edition.component';
import {
  ExternalVariableSetSelectorComponent
} from './external-variables-edition/external-variable-set-selector.component';
import {
  ExternalVariablesListComponent
} from './external-variables-edition/external-variables-list.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],
  declarations: [
    ExternalVariableEditorComponent,
    ExternalVariablesEditionComponent,
    ExternalVariableSetSelectorComponent,
    ExternalVariablesListComponent,
  ],
  exports: [
    ExternalVariablesEditionComponent,
  ],
})
export class ExternalVariablesModule { }
