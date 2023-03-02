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
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';
import { SharedModule } from '@app/shared/shared.module';

import { AccessControlControlsComponent } from './access-control-viewer/access-control-controls.component';
import { AccessControlFilterComponent } from './access-control-viewer/access-control-filter.component';
import { AccessControlTabbedViewComponent } from './access-control-tabbed-view/access-control-tabbed-view.component';
import { AccessControlViewerComponent } from './access-control-viewer/access-control-viewer.component';

import { SecurityItemAssignComponent } from './security-item/security-item-assign.component';
import { SecurityItemEditionComponent } from './security-item/security-item-edition.component';

import { SubjectCreatorComponent } from './subjects/subject-creator.component';
import { SubjectEditorComponent } from './subjects/subject-editor.component';
import { SubjectHeaderComponent } from './subjects/subject-header.component';
import { SubjectsTableComponent } from './subjects/subjects-table.component';
import { SubjectTabbedViewComponent } from './subjects/subject-tabbed-view.component';
import { ChangePasswordModalComponent } from './credentials/change-password-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,
  ],
  declarations: [
    AccessControlControlsComponent,
    AccessControlFilterComponent,
    AccessControlViewerComponent,
    AccessControlTabbedViewComponent,

    ChangePasswordModalComponent,

    SecurityItemAssignComponent,
    SecurityItemEditionComponent,

    SubjectCreatorComponent,
    SubjectEditorComponent,
    SubjectHeaderComponent,
    SubjectsTableComponent,
    SubjectTabbedViewComponent,
  ],
  exports: [
    AccessControlTabbedViewComponent,
    AccessControlViewerComponent,
    ChangePasswordModalComponent,
  ]
})
export class AccessControlModule { }
