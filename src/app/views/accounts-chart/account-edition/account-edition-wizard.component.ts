/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, DateString, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { AccountsEditionDataService } from '@app/data-services';

import { Account, AccountEditionCommand, AccountEditionCommandType, AccountEditionResult, AccountFields,
         AccountItem, AccountRole, AccountDataToBeUpdated, AccountsChartMasterData, EmptyAccount,
         EmptyAccountEditionCommand, EmptyAccountEditionResult, Sector, SectorRoleField, SectorRole,
         getAccountEditionTypeName,
         getAccountRole} from '@app/models';

import { AccountHeaderComponent,
         AccountHeaderEventType } from './account-header.component';

import { AccountItemsTableComponent,
         AccountItemsTableEventType } from './account-items-table.component';

import { AccountEditionConfigComponent,
         AccountEditionConfigEventType } from './account-edition-config.component';


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

  @ViewChild('accountEditionConfig') accountEditionConfig: AccountEditionConfigComponent;

  @ViewChild('accountHeader') accountHeader: AccountHeaderComponent;

  @ViewChild('accountCurrenciesTable') accountCurrenciesTable: AccountItemsTableComponent;

  @ViewChild('accountSectorsTable', {static: false}) accountSectorsTable: AccountItemsTableComponent;

  @ViewChild('accountRoleForSectorsTable', {static: false}) accountRoleForSectorsTable: AccountItemsTableComponent;

  @Input() commandType: AccountEditionCommandType = AccountEditionCommandType.CreateAccount;

  @Input() account: Account = EmptyAccount;

  @Output() accountEditionWizardEvent = new EventEmitter<EventInfo>();

  title = 'Asistente para agregar cuenta';

  accountEditionTypeName = 'Agregar cuenta';

  submitted = false;

  isLoading = false;

  dataToUpdateSelected: AccountDataToBeUpdated[] = [];

  accountEditionCommand: AccountEditionCommand = Object.assign({}, EmptyAccountEditionCommand,
    {commandType: this.commandType});

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

  // TODO: Remove these variables and use the role field

  usesSector = false;

  usesSubledger = false;


  constructor(private uiLayer: PresentationLayer,
              private accountsData: AccountsEditionDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.setTitle();
    this.loadDataLists();
    this.setInitDataToUpdateSelected();
    this.setAccountCurrenciesList();
    this.setSectorsFlags(this.account.usesSector, this.account.usesSubledger);
    this.setAccountSectorsList();
    this.setInitSectorWithSubledgers();
  }


  private setInitDataToUpdateSelected() {
    this.dataToUpdateSelected = this.commandType === AccountEditionCommandType.FixAccountName ?
      [AccountDataToBeUpdated.Name] : [];
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get accountNameText(): string {
    if (!this.isSaved && this.showInfoStep && !!this.accountEditionCommand.accountFields) {
      return `<strong>${this.selectedAccountChart?.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>` +
        `${this.accountEditionCommand.accountFields?.accountNumber}: ` +
        `${this.accountEditionCommand.accountFields?.name} ` +
        `(${this.accountEditionCommand.accountFields?.role})`;
    }

    return `<strong>${this.account.accountsChart.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>` +
      `${this.account.number}: ${this.account.name} ` +
      `(${getAccountRole(this.account.role, this.account.usesSector, this.account.usesSubledger)})`;
  }


  get isSaved(): boolean {
     return !isEmpty(this.account) ;
  }


  get isAccountHeaderUpdate(): boolean {
    return [AccountDataToBeUpdated.Name,
            AccountDataToBeUpdated.MainRole,
            AccountDataToBeUpdated.AccountType,
            AccountDataToBeUpdated.DebtorCreditor,
            AccountDataToBeUpdated.SubledgerRole].some(x => this.dataToUpdateSelected.includes(x));
  }


  get showConfigStep(): boolean {
    return this.commandType === AccountEditionCommandType.UpdateAccount;
  }


  get showInfoStep(): boolean {
    return this.isAccountHeaderUpdate ||
           [AccountEditionCommandType.CreateAccount,
            AccountEditionCommandType.FixAccountName].includes(this.commandType);
  }

  // TODO: check these flags by the selected role instead of the command
  get showCurrenciesStep(): boolean {
    return this.commandType === AccountEditionCommandType.CreateAccount ||
           this.dataToUpdateSelected.includes(AccountDataToBeUpdated.Currencies);
  }


  get showSectorsStep(): boolean {
    return this.commandType === AccountEditionCommandType.CreateAccount ||
           this.dataToUpdateSelected.includes(AccountDataToBeUpdated.Sectors);
  }


  get showRoleForSectorsStep(): boolean {
    return this.commandType === AccountEditionCommandType.CreateAccount ||
           this.dataToUpdateSelected.includes(AccountDataToBeUpdated.Sectors);
  }


  get isFormAccountEditionConfigValid() : boolean {
    if (!this.showConfigStep) {
      return true;
    }

    return !!this.accountEditionConfig?.formHandler?.isValid;
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
    if (!this.showSectorsStep) {
      return true;
    }
    return !!this.accountRoleForSectorsTable?.formHandler?.form.valid;
  }


  get isReadyForSubmit(): boolean {
    if (this.usesSector) {
      return this.isFormAccountValid && this.isFormCurrenciesValid &&
            this.isFormSectorsValid && this.isFormRoleForSectorsValid;
    }

    return this.isFormAccountValid && this.isFormCurrenciesValid;
  }


  get isReadyForDryRun() {
    return this.isReadyForSubmit && !this.executedDryRun && !this.accountEdited;
  }


  get isDryRunResultValid(): boolean {
    return this.executedDryRun && this.accountEditionResult.itemsList.length > 0 &&
      this.accountEditionResult.errorsList.length === 0;
  }


  onClose() {
    sendEvent(this.accountEditionWizardEvent, AccountEditionWizardEventType.CLOSE_MODAL_CLICKED);
  }


  onAccountEditionConfigEvent(event: EventInfo) {
    switch (event.type as AccountEditionConfigEventType) {

      case AccountEditionConfigEventType.FORM_CHANGED:
        this.setApplicationDate(event.payload.applicationDate as DateString);
        this.dataToUpdateSelected = event.payload.dataToUpdate ?? [];
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountHeaderEvent(event: EventInfo) {
    switch (event.type as AccountHeaderEventType) {

      case AccountHeaderEventType.FORM_CHANGED:
        Assertion.assertValue(event.payload.accountFields, 'event.payload.accountFields');

        this.setAccountFields(event.payload.accountFields as AccountFields);
        this.setSelectedAccountChart(event.payload.accountChartUID);
        this.validateApplicationDateFromHeader(event.payload.applicationDate as DateString);
        this.setSectorsFlags(!!event.payload.usesSector, !!event.payload.usesSubledger);
        this.validateResetSectors();
        this.validateUsesSubdlegerFlag();
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
        this.validateUsesSubdlegerFlag();
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

    switch (this.commandType) {
      case AccountEditionCommandType.CreateAccount:
        this.executeCreateAccount(true);
        return;
      case AccountEditionCommandType.UpdateAccount:
      case AccountEditionCommandType.FixAccountName:
        this.executeUpdateAccount(true);
        return;

      default:
        return;
    }
  }


  onEditAccountClicked() {
    if (this.submitted || !this.isDryRunResultValid || this.accountEdited) {
      return;
    }

    switch (this.commandType) {
      case AccountEditionCommandType.CreateAccount:
        this.executeCreateAccount(false);
        return;
      case AccountEditionCommandType.UpdateAccount:
      case AccountEditionCommandType.FixAccountName:
        this.executeUpdateAccount(false);
        return;

      default:
        return;
    }
  }


  private executeCreateAccount(dryRun: boolean) {
    const command =  this.getAccountEditionCommand(dryRun);
    const observable = this.accountsData.createAccount(command.accountsChartUID, command);
    this.executeAccountOperation(observable, dryRun);
  }


  private executeUpdateAccount(dryRun: boolean) {
    const command =  this.getAccountEditionCommand(dryRun);
    const observable = this.accountsData.updateAccount(command.accountsChartUID,
      command.accountUID, command);
    this.executeAccountOperation(observable, dryRun);
  }


  private setTitle() {
    this.accountEditionTypeName = getAccountEditionTypeName(this.commandType);
    this.title = `Asistente para ${this.accountEditionTypeName.toLowerCase()}`
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


  private executeAccountOperation(observable: Observable<AccountEditionResult>, dryRun: boolean) {
    this.submitted = true;

    observable
      .toPromise()
      .then(x => {
        this.accountEditionResult = x;

        if (dryRun) {
          this.executedDryRun = true;
        } else {
          this.accountEdited = true;
          sendEvent(this.accountEditionWizardEvent, AccountEditionWizardEventType.ACCOUNT_EDITED,
            {account: EmptyAccount});
            // TODO: implement the new data interface for this response
            // {account: isEmpty(x.account) ? EmptyAccount : x.account}
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
      this.setRoleForSector(this.account.sectorRules.filter(x => x.sectorRole === SectorRole.Control).map(x => x.sector.uid));
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


  private validateApplicationDateFromHeader(date: DateString) {
    if ([AccountEditionCommandType.CreateAccount,
         AccountEditionCommandType.FixAccountName].includes(this.commandType)) {
      this.setApplicationDate(date);
    }
  }


  private setApplicationDate(applicationDate: DateString) {
    this.accountEditionCommand.applicationDate = applicationDate ?? null;
  }


  private setSectorsFlags(usesSector: boolean, usesSubledger: boolean) {
    this.usesSector = usesSector;
    this.usesSubledger = usesSubledger;
  }


  private validateResetSectors() {
    if (!this.usesSector) {
      this.accountEditionCommand.sectorRules = [];
    }
  }


  private setInitSectorWithSubledgers() {
    const sectorWithSubledger = this.account.sectorRules.filter(x => x.sectorRole === SectorRole.Control);
    this.setAccountSectorsWithSubledgerAccountList(sectorWithSubledger)
  }


  private setSectorsWithRoleDefault(items: string[]) {
    this.selectedSectorsList = this.selectedAccountChart?.sectors.filter(x => items.includes(x.uid));
    this.accountEditionCommand.sectorRules = [...[], ...items.map(x => this.getSectorDefault(x))];
  }


  private getSectorDefault(code: string): SectorRoleField {
    return {code, role: SectorRole.Detalle};
  }


  private validateUsesSubdlegerFlag() {
    const sectorsWithSubledgers = this.usesSubledger ? this.accountEditionCommand.sectorRules : [];

    this.setRoleForSector(sectorsWithSubledgers.map(x => x.code));
    this.setAccountSectorsWithSubledgerAccountList(sectorsWithSubledgers);
  }


  private setRoleForSector(items: string[]) {
    if (!this.accountEditionCommand.sectorRules) {
      return;
    }

    this.accountEditionCommand.sectorRules
      .forEach(x => x.role = items.includes(x.code) ? SectorRole.Control : SectorRole.Detalle);
  }


  private setAccountSectorsWithSubledgerAccountList(list) {
    this.accountSectorsWithSubledgerAccountList = this.selectedAccountChart?.sectors.filter(x =>
      list.some(y => y.code === x.code)
    )
  }


  private resetAccountEditionResult() {
    this.accountEditionResult = EmptyAccountEditionResult;
    this.executedDryRun = false;
    this.accountEdited = false;
  }


  private getAccountEditionCommand(dryRun: boolean) {
    let command: AccountEditionCommand = Object.assign({}, EmptyAccountEditionCommand);

    command.dryRun = dryRun;
    command.commandType = this.commandType;
    command.accountsChartUID = this.accountEditionCommand.accountsChartUID;
    command.applicationDate = this.accountEditionCommand.applicationDate;

    if (this.isSaved) {
      command.accountUID = this.account.uid;
    }

    // TODO: send all data for validation, check the account header data
    if (this.showConfigStep) {
      command.dataToBeUpdated = this.dataToUpdateSelected;
    }

    if (this.showInfoStep) {
      command.accountFields = this.accountEditionCommand.accountFields;
    }

    if (this.showCurrenciesStep) {
      command.currencies = this.accountEditionCommand.currencies;
    }

    if (this.showSectorsStep) {
      command.sectorRules = this.accountEditionCommand.sectorRules;
    }

    return command;
  }

}
