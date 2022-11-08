/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ReportGroup } from '@app/models';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

@Component({
  selector: 'emp-fa-operational-reports-main-page',
  templateUrl: './operational-reports-main-page.component.html',
})
export class OperationalReportsMainPageComponent implements OnInit, OnDestroy {

  reportGroup: ReportGroup;

  subscriptionHelper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.onCurrentViewChanged(x));
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  private onCurrentViewChanged(newView: View) {
    switch (newView.name) {
      case 'AccountingDashboards.OperationalReports':
        this.reportGroup = ReportGroup.ReportesOperativos;
        return;

      case 'AccountingDashboards.FiscalReports':
        this.reportGroup = ReportGroup.ReportesFiscales;
        return;

      default:
        this.reportGroup = null;
        return;
    }
  }

}
