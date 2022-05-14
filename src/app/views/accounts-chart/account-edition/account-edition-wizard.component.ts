/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Assertion, DateString, DateStringLibrary, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { AccountsChartDataService } from '@app/data-services';

import { Account, AccountEditionCommand, AccountEditionCommandType, AccountEditionResult, AccountFields,
         AccountItem, AccountRole, AccountsChartMasterData, EmptyAccount, EmptyAccountEditionCommand,
         EmptyAccountEditionResult, getAccountEditionTypeName, Sector, SectorField,
         SectorRole } from '@app/models';

import { AccountHeaderComponent,
         AccountHeaderEventType } from './account-header.component';

import { AccountItemsTableComponent,
         AccountItemsTableEventType } from './account-items-table.component';


export enum AccountEditionWizardEventType {
  CLOSE_MODAL_CLICKED = 'AccountEditionWizardComponent.Event.CloseModalClicked',
  ACCOUNT_EDITED = 'AccountEditionWizardComponent.Event.AccountEdited',
}

@Component({
  selector: 'emp-fa-account-edition-wizard',
  templateUrl: './account-edition-wizard.component.html',
  styles: [`
    .step-container {
      min-height: 265px;
      width: 100%;
      margin: auto;
    }

    .step-list-container {
      max-height: 365px;
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

  title = 'Asistente para agregar cuenta';

  accountEditionTypeName = 'Agregar cuenta';

  submitted = false;

  isLoading = false;

  accountEditionCommand: AccountEditionCommand = Object.assign({}, EmptyAccountEditionCommand,
    {commandType: this.accountEditionCommandType});

  accountEditionResult: AccountEditionResult = EmptyAccountEditionResult;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  selectedAccountChart: AccountsChartMasterData = null;

  selectedSectorsList: Sector[] = [];

  executedDryRun = false;

  accountEdited = false;

  accountCurrenciesList: AccountItem[] = [];

  accountSectorsList: AccountItem[] = [];

  accountSectorsWithSubledgerAccountList: AccountItem[] = [];

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private accountsData: AccountsChartDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.setTitle();
    this.loadDataLists();
    this.setAccountCurrenciesList();
    this.setAccountSectorsList();
    this.setAccountSectorsWithSubledgerAccountList();
    this.validateApplicationDateToday();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get accountNameText(): string {
    if (this.showInfoStep) {
      return `<strong>${this.selectedAccountChart.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>` +
        `${this.accountEditionCommand.accountFields?.accountNumber}: ` +
        `${this.accountEditionCommand.accountFields?.name}`;
    }

    return `<strong>${this.account.accountsChart.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>` +
      `${this.account.number}: ` +
      `${this.account.name}`;
  }


  get isSaved(): boolean {
     return !isEmpty(this.account) ;
  }


  get sectorsRequired(): boolean {
    return this.accountEditionCommand?.accountFields?.role === AccountRole.Sectorizada ||
      this.account.sectorRules.length !== 0;
  }


  get isRoleEdition(): boolean {
    return this.accountEditionCommandType === AccountEditionCommandType.UpdateAccountRole;
  }


  get isRemoveCommandType(): boolean {
    return [AccountEditionCommandType.RemoveAccount,
            AccountEditionCommandType.RemoveCurrencies,
            AccountEditionCommandType.RemoveSectors].includes(this.accountEditionCommandType);
  }


  get showInfoStep(): boolean {
    return [AccountEditionCommandType.UpdateAccountAll,
            AccountEditionCommandType.CreateAccount,
            AccountEditionCommandType.UpdateAccountRole,
            AccountEditionCommandType.UpdateAccount].includes(this.accountEditionCommandType);
  }


  get showCurrenciesStep(): boolean {
    return [AccountEditionCommandType.UpdateAccountAll,
            AccountEditionCommandType.CreateAccount,
            AccountEditionCommandType.AddCurrencies,
            AccountEditionCommandType.RemoveCurrencies].includes(this.accountEditionCommandType);
  }


  get showSectorsStep(): boolean {
    return [AccountEditionCommandType.UpdateAccountAll,
            AccountEditionCommandType.CreateAccount,
            AccountEditionCommandType.AddSectors,
            AccountEditionCommandType.RemoveSectors].includes(this.accountEditionCommandType);
  }


  get isFormAccountValid() : boolean {
    if (!this.showInfoStep) {
      return true;
    }

    return !!this.accountHeader?.formHandler?.isValid;
  }


  get isFormCurrenciesValid() : boolean {
    if (!this.showCurrenciesStep) {
      return true;
    }

    return !!this.accountCurrenciesTable?.formHandler?.form.valid;
  }


  get isFormSectorsValid() : boolean {
    if (!this.showSectorsStep) {
      return true;
    }

    return !!this.accountSectorsTable?.formHandler?.form.valid;
  }


  get isFormRoleForSectorsValid() : boolean {
    if (!this.showSectorsStep || this.isRemoveCommandType) {
      return true;
    }
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
    return this.isReadyForSubmit && !this.executedDryRun && !this.accountEdited;
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
        this.validateSetAplicationDateFromTables(event.payload.applicationDate as DateString);
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
        this.validateSetAplicationDateFromTables(event.payload.applicationDate as DateString);
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

    this.editAccount(this.getAccountEditionCommand(true));
  }


  onEditAccountClicked() {
    if (this.submitted || !this.isDryRunResultValid || this.accountEdited) {
      return;
    }

    this.editAccount(this.getAccountEditionCommand(false));
  }


  private setTitle() {
    this.accountEditionTypeName = getAccountEditionTypeName(this.accountEditionCommandType);
    this.title = this.isSaved ?
      `Asistente para editar cuenta ( ${this.accountEditionTypeName.toLowerCase()} )` :
      'Asistente para agregar cuenta';
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


  private editAccount(command: AccountEditionCommand) {
    this.submitted = true;

    this.accountsData.editAccount(command)
    .toPromise()
    .then(x => {
      this.accountEditionResult = x;

      if (command.dryRun) {
        this.executedDryRun = true;
      } else {
        this.accountEdited = true;
        sendEvent(this.accountEditionWizardEvent, AccountEditionWizardEventType.ACCOUNT_EDITED,
          {account: isEmpty(x.account) ? EmptyAccount : x.account});
      }
    })
    .finally(() => this.submitted = false);
  }


  private setAccountCurrenciesList() {
    this.accountCurrenciesList = this.account.currencyRules.map(x => Object.create({
        uid: x.currency.uid,
        fullName: x.currency.fullName,
        startDate: x.startDate,
        endDate: x.endDate,
      }));
  }


  private setAccountSectorsList() {
    this.accountSectorsList = this.account.sectorRules.map(x => Object.create({
        uid: x.sector.uid,
        fullName: x.sector.fullName,
        role: x.sectorRole,
        startDate: x.startDate,
        endDate: x.endDate,
      }));
  }


  private setAccountSectorsWithSubledgerAccountList() {
    this.accountSectorsWithSubledgerAccountList = this.selectedAccountChart.sectors.filter(x =>
      this.account.sectorRules.find(y => y.uid === x.uid)?.sectorRole === SectorRole.Control
    )
  }


  private setAccountChartDefault() {
    if (this.accountsChartMasterDataList.length === 0) {
      return;
    }

    this.selectedAccountChart = !!this.account.accountsChart.uid ?
      this.accountsChartMasterDataList.find(x => x.uid === this.account.accountsChart.uid) :
      this.accountsChartMasterDataList[0];
    this.accountEditionCommand.accountsChartUID = this.selectedAccountChart?.uid ?? '';
    this.setAccountEditionCommandFromAccount();
  }


  private setAccountEditionCommandFromAccount() {
    if (this.isSaved && !this.showInfoStep) {
      this.accountEditionCommand.currencies = this.account.currencyRules.map(x => x.currency.uid);
      this.setSectorsWithRoleDefault(this.account.sectorRules.map(x => x.sector.uid));
      this.setRoleForSector(this.account.sectorRules.filter(x => x.sectorRole === 'Control').map(x => x.sector.uid));
    }
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


  private validateApplicationDateToday() {
    if (this.accountEditionCommandType === AccountEditionCommandType.RemoveAccount) {
      this.setApplicationDate(DateStringLibrary.today());
    }
  }


  private setApplicationDate(applicationDate: DateString) {
    this.accountEditionCommand.applicationDate = applicationDate ?? null;
  }


  private validateSetAplicationDateFromTables(applicationDate: DateString) {
    if (this.isSaved && !this.showInfoStep) {
      this.setApplicationDate(applicationDate);
    }
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
    this.accountEdited = false;
  }


  private getAccountEditionCommand(dryRun: boolean) {
    let command: AccountEditionCommand = Object.assign({}, EmptyAccountEditionCommand);

    command.commandType = this.accountEditionCommandType;
    command.dryRun = dryRun;
    command.applicationDate = this.accountEditionCommand.applicationDate;
    command.accountsChartUID = this.accountEditionCommand.accountsChartUID;

    if (this.isSaved) {
      command.accountUID = this.account.uid;
    }

    if (this.showInfoStep) {
      if (this.accountEditionCommandType === AccountEditionCommandType.UpdateAccountRole) {
        command.newRole = this.accountEditionCommand.accountFields.role;
      } else {
        command.accountFields = this.accountEditionCommand.accountFields;
      }
    }

    if (this.showCurrenciesStep) {
      if (this.accountEditionCommandType === AccountEditionCommandType.AddCurrencies) {
        command.currencies = this.accountEditionCommand.currencies
          .filter(x => !this.accountCurrenciesList.map(y => y.uid).includes(x));
      } else {
         command.currencies = this.accountEditionCommand.currencies;
      }
    }

    if (this.showSectorsStep) {
      if (this.accountEditionCommandType === AccountEditionCommandType.AddSectors) {
        command.sectors = this.accountEditionCommand.sectors
          .filter(x => !this.accountSectorsList.map(y => y.uid).includes(x.uid));
      } else {
        command.sectors = this.accountEditionCommand.sectors;
      }
    }

    return command;
  }

}
