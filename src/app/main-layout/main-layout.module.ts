/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';

import { SharedDirectivesModule } from '@app/shared/directives/shared-directives.module';
import { SharedFormControlsModule } from '@app/shared/form-controls/shared-form-controls.module';
import { SharedIndicatorsModule } from '@app/shared/indicators/shared-indicators.module';
import { ToolsModule } from '@app/views/tools/tools.module';

import { FooterComponent } from './footer/footer.component';
import { MainLayoutComponent } from './main-layout.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavigationHeaderComponent } from './nav-header/nav-header.component';
import { NavigationMenuComponent } from './nav-menu/nav-menu.component';
import { NoContentComponent } from './no-content.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { UserSessionComponent } from './user-session/user-session.component';


@NgModule({

  imports: [
    CommonModule,
    RouterModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,

    SharedDirectivesModule,
    SharedFormControlsModule,
    SharedIndicatorsModule,

    ToolsModule,
  ],

  declarations: [
    FooterComponent,
    MainLayoutComponent,
    MainMenuComponent,
    NavBarComponent,
    NavigationHeaderComponent,
    NavigationMenuComponent,
    NoContentComponent,
    ToolbarComponent,
    TopBarComponent,
    UserSessionComponent,
  ],

  exports: [
    MainLayoutComponent,
    NoContentComponent,
  ],

  providers: []

})
export class MainLayoutModule { }
