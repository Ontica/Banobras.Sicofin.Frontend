/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Assertion, DateString, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { AccountsChartDataService } from '@app/data-services';

import { Account, AccountEditionCommand, AccountEditionCommandType, AccountEditionResult, AccountFields,
         AccountRole, AccountsChartMasterData, EmptyAccount, EmptyAccountEditionCommand,
         EmptyAccountEditionResult, Sector, SectorField, SectorRole } from '@app/models';

import { AccountHeaderComponent,
         AccountHeaderEventType } from './account-header.component';

import { AccountItemsTableComponent,
         AccountItemsTableEventType } from './account-items-table.component';


export enum AccountEditionWizardEventType {
  CLOSE_MODAL_CLICKED = 'AccountEditionWizardComponent.Event.CloseModalClicked',
  ACCOUNT_CREATED = 'AccountEditionWizardComponent.Event.AccountCreated',
}

@Component({
  selector: 'emp-fa-account-edition-wizard',
  templateUrl: './account-edition-wizard.component.html',
  styles: [`
    .step-container {
      min-height: 265px;
      max-height: 420px;
      width: 100%;
      margin: auto;
    }

    .divider-stepper-margin {
      margin: 8px -28px;
    }
  `],
})
export class AccountEditionWizardComponent implements OnInit, OnDestroy {

  @ViewChild('accountHeader') accountHeader: AccountHeaderComponent;

  @ViewChild('accountCurrenciesTable') accountCurrenciesTable: AccountItemsTableComponent;

  @ViewChild('accountSectorsTable', {static: false}) accountSectorsTable: AccountItemsTableComponent;

  @ViewChild('accountRoleForSectorsTable', {static: false}) accountRoleForSectorsTable: AccountItemsTableComponent;

  @Input() accountEditionCommandType = AccountEditionCommandType.CreateAccount;

  @Input() account: Account = EmptyAccount;

  @Output() accountEditionWizardEvent = new EventEmitter<EventInfo>();

  submitted = false;

  isLoading = false;

  accountEditionCommand: AccountEditionCommand = Object.assign({}, EmptyAccountEditionCommand,
    {commandType: this.accountEditionCommandType});

  accountEditionResult: AccountEditionResult = EmptyAccountEditionResult;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  selectedAccountChart: AccountsChartMasterData = null;

  selectedSectorsList: Sector[] = [];

  executedDryRun = false;

  accountCreated = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private accountsData: AccountsChartDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get accountNameText() {
    return `<strong>${this.selectedAccountChart.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>` +
      `${this.accountEditionCommand.accountFields?.accountNumber}: ` +
      `${this.accountEditionCommand.accountFields?.name}`;
  }


  get isSaved() {
     return !isEmpty(this.account) ;
  }


  get sectorsRequired(): boolean {
    return this.accountEditionCommand?.accountFields?.role === AccountRole.Sectorizada;
  }


  get isFormAccountValid() : boolean {
    return !!this.accountHeader?.formHandler?.isValid;
  }


  get isFormCurrenciesValid() : boolean {
    return !!this.accountCurrenciesTable?.formHandler?.form.valid;
  }


  get isFormSectorsValid() : boolean {
    return !!this.accountSectorsTable?.formHandler?.form.valid;
  }


  get isFormRoleForSectorsValid() : boolean {
    return !!this.accountRoleForSectorsTable?.formHandler?.form.valid;
  }


  get isReadyForSubmit(): boolean {
    if (this.sectorsRequired) {
      return this.isFormAccountValid && this.isFormCurrenciesValid &&
            this.isFormSectorsValid && this.isFormRoleForSectorsValid;
    }

    return this.isFormAccountValid && this.isFormCurrenciesValid;
  }


  get isReadyForDryRun() {
    return this.isReadyForSubmit && !this.executedDryRun && !this.accountCreated;
  }


  get isDryRunResultValid(): boolean {
    return this.executedDryRun && this.accountEditionResult.actions.length > 0 &&
      this.accountEditionResult.issues.length === 0;
  }


  onClose() {
    sendEvent(this.accountEditionWizardEvent, AccountEditionWizardEventType.CLOSE_MODAL_CLICKED);
  }


  onAccountHeaderEvent(event: EventInfo) {
    switch (event.type as AccountHeaderEventType) {

      case AccountHeaderEventType.FORM_CHANGED:
        Assertion.assertValue(event.payload.account, 'event.payload.account');

        this.setAccountFields(event.payload.account as AccountFields);
        this.setSelectedAccountChart(event.payload.accountChartUID);
        this.setApplicationDate(event.payload.applicationDate as DateString);
        this.validateResetSectors();
        this.resetAccountEditionResult();

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountCurrenciesTableEvent(event: EventInfo) {
    switch (event.type as AccountItemsTableEventType) {

      case AccountItemsTableEventType.FORM_CHANGED:
        Assertion.assertValue(event.payload.items, 'event.payload.items');
        this.accountEditionCommand.currencies = [...[], ...event.payload.items];
        this.resetAccountEditionResult();

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountSectorsTableEvent(event: EventInfo) {
    switch (event.type as AccountItemsTableEventType) {

      case AccountItemsTableEventType.FORM_CHANGED:
        Assertion.assertValue(event.payload.items, 'event.payload.items');
        this.setSectorsWithRoleDefault(event.payload.items);
        this.resetAccountEditionResult();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountRoleForSectorsTableEvent(event: EventInfo) {
    switch (event.type as AccountItemsTableEventType) {

      case AccountItemsTableEventType.FORM_CHANGED:
        Assertion.assertValue(event.payload.items, 'event.payload.items');
        this.setRoleForSector(event.payload.items);
        this.resetAccountEditionResult();

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDryRunDataClicked() {
    if (this.submitted || !this.isReadyForDryRun) {
      return;
    }

    this.accountEditionCommand.commandType = this.accountEditionCommandType;
    this.accountEditionCommand.dryRun = true;

    this.editAccount();
  }


  onEditAccountClicked() {
    if (this.submitted || !this.isDryRunResultValid || this.accountCreated) {
      return;
    }

    this.accountEditionCommand.commandType = this.accountEditionCommandType;
    this.accountEditionCommand.dryRun = false;

    this.editAccount();
  }


  private loadDataLists() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.isLoading = false;
        this.accountsChartMasterDataList = x;
        this.setAccountChartDefault();
      });
  }


  private editAccount() {
    this.submitted = true;

    this.accountsData.editAccount(this.accountEditionCommand)
    .toPromise()
    .then(x => {
      this.accountEditionResult = x;

      if (this.accountEditionCommand.dryRun) {
        this.executedDryRun = true;
      } else {
        this.accountCreated = true;
        sendEvent(this.accountEditionWizardEvent, AccountEditionWizardEventType.ACCOUNT_CREATED,
          {account: isEmpty(x.account) ? EmptyAccount : x.account});
      }
    })
    .finally(() => this.submitted = false);
  }


  private setAccountChartDefault() {
    if (this.accountsChartMasterDataList.length === 0) {
      return;
    }

    this.selectedAccountChart = !!this.account.accountsChart.uid ?
      this.accountsChartMasterDataList.find(x => x.uid === this.account.accountsChart.uid) :
      this.accountsChartMasterDataList[0];
    this.accountEditionCommand.accountsChartUID = this.selectedAccountChart?.uid ?? '';
  }


  private setSelectedAccountChart(accountChartUID: string) {
    if (this.selectedAccountChart?.uid === accountChartUID) {
      return;
    }

    this.selectedAccountChart = this.accountsChartMasterDataList.find(x => x.uid === accountChartUID);
    this.accountEditionCommand.accountsChartUID = this.selectedAccountChart?.uid ?? '';
  }


  private setAccountFields(fields: AccountFields) {
    this.accountEditionCommand.accountFields = Object.assign({}, fields);
  }


  private setApplicationDate(applicationDate: DateString) {
    this.accountEditionCommand.applicationDate = applicationDate ?? null;
  }


  private validateResetSectors() {
    if (!this.sectorsRequired) {
      this.accountEditionCommand.sectors = [];
    }
  }


  private setSectorsWithRoleDefault(items: string[]) {
    this.selectedSectorsList = this.selectedAccountChart.sectors.filter(x => items.includes(x.uid));
    this.accountEditionCommand.sectors = [...[], ...items.map(x => this.getSectorField(x))];
  }


  private getSectorField(UIDSector: string): SectorField {
    return {uid: UIDSector, role: SectorRole.Detalle};
  }


  private setRoleForSector(items: string[]) {
    this.accountEditionCommand.sectors
      .forEach(x => x.role = items.includes(x.uid) ? SectorRole.Control : SectorRole.Detalle);
  }


  private resetAccountEditionResult() {
    this.accountEditionResult = EmptyAccountEditionResult;
    this.executedDryRun = false;
    this.accountCreated = false;
  }

}
