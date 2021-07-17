/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { Component } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo } from '@app/core';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { AccountsChartMasterData } from '@app/models';

export enum StoredBalanceSetCreatorEventType {
  CLOSE_MODAL_CLICKED = 'StoredBalanceSetCreatorComponent.Event.CloseModalClicked',
  CREATE_STORED_BALANCE_SET = 'StoredBalanceSetCreatorComponent.Event.CreateStoredBalanceSetClicked',
}

enum StoredBalanceSetCreatorFormControls {
  accountsChart = 'accountsChart',
  balancesDate = 'balancesDate',
}

@Component({
  selector: 'emp-fa-stored-balance-set-creator',
  templateUrl: './stored-balance-set-creator.component.html',
})
export class StoredBalanceSetCreatorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() accountsChartDefault: AccountsChartMasterData;

  @Output() storedBalanceSetCreatorEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;
  controls = StoredBalanceSetCreatorFormControls;
  isLoading = false;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges() {
    this.formHandler.form.reset({
      accountsChart: this.accountsChartDefault?.uid || '',
    });
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onClose() {
    sendEvent(this.storedBalanceSetCreatorEvent, StoredBalanceSetCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onCreateStoredBalanceSetClicked() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    sendEvent(this.storedBalanceSetCreatorEvent, StoredBalanceSetCreatorEventType.CREATE_STORED_BALANCE_SET, {
      accountsChartUID: this.formHandler.getControl(this.controls.accountsChart).value ?? '',
      storedBalanceSet: this.getFormData()
    });
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
    .subscribe(x => {
      this.accountsChartMasterDataList = x;
      this.isLoading = false;
    });
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        accountsChart: new FormControl('', Validators.required),
        balancesDate: new FormControl('', Validators.required),
      })
    );
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data = {
      balancesDate: formModel.balancesDate ?? '',
    };

    return data;
  }

}
