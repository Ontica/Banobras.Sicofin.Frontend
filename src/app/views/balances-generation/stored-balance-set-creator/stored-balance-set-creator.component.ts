/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { AccountsChartMasterData, BalanceStorageCommand } from '@app/models';

export enum StoredBalanceSetCreatorEventType {
  CLOSE_MODAL_CLICKED = 'StoredBalanceSetCreatorComponent.Event.CloseModalClicked',
  CREATE_STORED_BALANCE_SET = 'StoredBalanceSetCreatorComponent.Event.CreateStoredBalanceSetClicked',
}

interface StoredBalanceSetFormModel extends FormGroup<{
  accountsChart: FormControl<string>;
  balancesDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-fa-stored-balance-set-creator',
  templateUrl: './stored-balance-set-creator.component.html',
})
export class StoredBalanceSetCreatorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() accountsChartDefault: AccountsChartMasterData;

  @Output() storedBalanceSetCreatorEvent = new EventEmitter<EventInfo>();

  form: StoredBalanceSetFormModel;

  formHelper = FormHelper;

  isLoading = false;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges() {
    this.setFormData();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onClose() {
    sendEvent(this.storedBalanceSetCreatorEvent, StoredBalanceSetCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onCreateStoredBalanceSetClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {command: this.getFormData()}

      sendEvent(this.storedBalanceSetCreatorEvent,
        StoredBalanceSetCreatorEventType.CREATE_STORED_BALANCE_SET, payload);
    }
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
    const fb = new FormBuilder();

    this.form = fb.group({
      accountsChart: ['', Validators.required],
      balancesDate: ['' as DateString, Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({ accountsChart: this.accountsChartDefault?.uid || '' });
  }


  private getFormData(): BalanceStorageCommand {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: BalanceStorageCommand = {
      accountsChartUID: formModel.accountsChart ?? '',
      balancesDate: formModel.balancesDate ?? '',
    };

    return data;
  }

}
