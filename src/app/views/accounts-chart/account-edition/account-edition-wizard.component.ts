/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Assertion, DateString, DateStringLibrary, EmpObservable, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { AccountsEditionDataService } from '@app/data-services';

import { Account, AccountEditionCommand, AccountEditionCommandType, AccountEditionResult, AccountFields,
         AccountItem, AccountRole, AccountDataToBeUpdated, AccountsChartMasterData, EmptyAccount,
         EmptyAccountEditionCommand, EmptyAccountEditionResult, Sector, SectorRoleField, SectorRole,
         getAccountEditionTypeName, getAccountMainRole, getAccountRoleDescription, SectorRule,
         CurrencyRule } from '@app/models';

import { AccountHeaderComponent,
         AccountHeaderEventType } from './account-header.component';

import { AccountItemsTableComponent,
         AccountItemsTableEventType } from './account-items-table.component';

import { AccountEditionConfigComponent,
         AccountEditionConfigEventType } from './account-edition-config.component';

export enum AccountEditionWizardEventType {
  CLOSE_MODAL_CLICKED = 'AccountEditionWizardComponent.Event.CloseModalClicked',
  ACCOUNT_EDITED      = 'AccountEditionWizardComponent.Event.AccountEdited',
  ACCOUNT_DELETED     = 'AccountEditionWizardComponent.Event.AccountDeleted',
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

  usesSector = false;

  usesSubledger = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private accountsData: AccountsEditionDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.loadDataLists();
    this.setTitle();
    this.setInitDataToUpdateSelected();

    this.setInitAccountFields();
    this.setInitSectorsWithSubledgers();
    this.setInitAccountCurrencies();
    this.setInitAccountSectors();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get accountNameText(): string {
    if (!this.isSaved && this.showInfoStep && !!this.accountEditionCommand.accountFields) {
      return `<strong>${this.selectedAccountChart?.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>` +
        `${this.accountEditionCommand.accountFields?.accountNumber}: ` +
        `${this.accountEditionCommand.accountFields?.name}  (${this.accountRoleDescriptionForTitle})`;
    }

    return `<strong>${this.account.accountsChart.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>` +
      `${this.account.number}: ${this.account.name} (${this.accountRoleDescriptionForTitle})`;
  }


   get accountRole(): AccountRole {
    if (!!this.accountEditionCommand.accountFields?.role) {
      return this.accountEditionCommand.accountFields?.role;
    } else if (!!this.account.role) {
      return this.accountRoleFromAccount;
    }
    return null;
  }


  get accountRoleFromAccount(): AccountRole {
    return getAccountMainRole(this.account.role, this.account.usesSector, this.account.usesSubledger);
  }


  get accountRoleDescriptionForTitle(): string {
    if (this.isSaved) {
      const isRoleSumaria = this.account.role === AccountRole.Sumaria;
      const usesSector = isRoleSumaria ? false : this.account.usesSector;
      const usesSubledger = isRoleSumaria ? false : this.account.usesSubledger;
      return getAccountRoleDescription(this.account.role, usesSector, usesSubledger);
    } else {
      return this.accountRoleDescriptionFromCommand;
    }
  }


  get accountRoleDescriptionFromCommand(): string {
    return getAccountRoleDescription(this.accountEditionCommand.accountFields?.role,
      this.usesSector, this.usesSubledger);
  }


  get isSaved(): boolean {
     return !isEmpty(this.account) ;
  }


  get showConfigStep(): boolean {
    return this.commandType === AccountEditionCommandType.UpdateAccount;
  }


  get showInfoStep(): boolean {
    return this.isAccountHeaderUpdate ||
           [AccountEditionCommandType.CreateAccount,
            AccountEditionCommandType.FixAccountName].includes(this.commandType);
  }


  get showCurrenciesStep(): boolean {
    return (!!this.accountRole && this.accountRole !== AccountRole.Sumaria) &&
      (this.commandType === AccountEditionCommandType.CreateAccount || this.isAccountCurrenciesUpdate);
  }


  get showSectorsStep(): boolean {
    return this.accountRole === AccountRole.Sectorizada &&
      (this.commandType === AccountEditionCommandType.CreateAccount || this.isAccountSectorUpdate);
  }


  get showRoleForSectorsStep(): boolean {
    return false;
  }


  get isAccountHeaderUpdate(): boolean {
    return this.commandType === AccountEditionCommandType.UpdateAccount &&
           [AccountDataToBeUpdated.Name,
            AccountDataToBeUpdated.MainRole,
            AccountDataToBeUpdated.AccountType,
            AccountDataToBeUpdated.DebtorCreditor,
            AccountDataToBeUpdated.SubledgerRole].some(x => this.dataToUpdateSelected.includes(x));
  }


  get isAccountCurrenciesUpdate(): boolean {
    return this.commandType === AccountEditionCommandType.UpdateAccount && (
           (this.dataToUpdateSelected.includes(AccountDataToBeUpdated.Currencies))
           ||
           (this.dataToUpdateSelected.includes(AccountDataToBeUpdated.MainRole) &&
            this.accountRoleFromAccount === AccountRole.Sumaria)
    )
  }


  get isAccountSectorUpdate(): boolean {
    return this.commandType === AccountEditionCommandType.UpdateAccount && (
           (this.dataToUpdateSelected.includes(AccountDataToBeUpdated.Sectors))
           ||
           (this.dataToUpdateSelected.includes(AccountDataToBeUpdated.MainRole) &&
            this.accountRole === AccountRole.Sectorizada &&
            this.accountRoleFromAccount !== AccountRole.Sectorizada)
    )
  }


  get isFormAccountEditionConfigValid() : boolean {
    if (!this.showConfigStep) {
      return true;
    }

    return !!this.accountEditionConfig?.isFormValid;
  }


  get isFormAccountValid() : boolean {
    if (!this.showInfoStep) {
      return true;
    }

    return !!this.accountHeader?.isFormValid;
  }


  get isFormCurrenciesValid() : boolean {
    if (!this.showCurrenciesStep) {
      return true;
    }

    return !!this.accountCurrenciesTable?.isFormValid;
  }


  get isFormSectorsValid() : boolean {
    if (!this.showSectorsStep) {
      return true;
    }

    return !!this.accountSectorsTable?.isFormValid;
  }


  get isFormRoleForSectorsValid() : boolean {
    if (!this.showRoleForSectorsStep) {
      return true;
    }

    return !!this.accountRoleForSectorsTable?.isFormValid;
  }


  get isReadyForSubmit(): boolean {
    return this.isFormAccountValid && this.isFormCurrenciesValid &&
           this.isFormSectorsValid && this.isFormRoleForSectorsValid;
  }


  get isReadyForDryRun() {
    return this.isReadyForSubmit && !this.executedDryRun && !this.accountEdited;
  }


  get isDryRunResultValid(): boolean {
    return this.executedDryRun &&
           this.accountEditionResult.actions.length > 0 &&
           this.accountEditionResult.issues.length === 0;
  }


  onClose() {
    sendEvent(this.accountEditionWizardEvent, AccountEditionWizardEventType.CLOSE_MODAL_CLICKED);
  }


  onAccountEditionConfigEvent(event: EventInfo) {
    switch (event.type as AccountEditionConfigEventType) {
      case AccountEditionConfigEventType.FORM_CHANGED:
        this.dataToUpdateSelected = event.payload.dataToUpdate ?? [];
        this.setApplicationDate(event.payload.applicationDate as DateString);
        this.resetCommandFromAccount();
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
        this.setSectorsFlags(!!event.payload.usesSector, !!event.payload.usesSubledger);
        this.setSelectedAccountChart(event.payload.accountChartUID);
        this.validateApplicationDateFromHeader(event.payload.applicationDate as DateString);
        this.validateResetCurrencies();
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


  onDeleteAccountClicked() {
    this.showConfirmDeleteMessage();
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


  private resetCommandFromAccount() {
    this.setInitAccountFields();
    this.setInitAccountCurrencies();
    this.setInitAccountSectors();
    this.setInitSectorsWithSubledgers();
  }


  private setInitDataToUpdateSelected() {
    this.dataToUpdateSelected = this.commandType === AccountEditionCommandType.FixAccountName ?
      [AccountDataToBeUpdated.Name] : [];
  }


  private setInitAccountFields() {
    if (this.isSaved) {
      this.setAccountFields(this.getAccountFieldsFromAccount(this.account));
      this.setInitSectorsFlags();
    }
  }


  private setInitSectorsFlags() {
    const isRoleSumaria = this.account.role === AccountRole.Sumaria;

    const usesSector = isRoleSumaria ? false : this.account.usesSector;
    const usesSubledger = isRoleSumaria ? false : this.account.usesSubledger;

    this.setSectorsFlags(usesSector, usesSubledger);
  }


  private setInitAccountCurrencies() {
    const isRoleSumaria = this.account.role === AccountRole.Sumaria;

    this.accountCurrenciesList = isRoleSumaria ? [] :
      this.account.currencyRules.map(x => this.getAccountItemFromCurrencyRule(x));

    this.accountEditionCommand.currencies = isRoleSumaria ? [] :
      this.account.currencyRules.map(x => x.currency.uid);
  }


  private setInitAccountSectors() {
    this.accountSectorsList = this.usesSector ?
      this.account.sectorRules.map(x => this.getAccountItemFromSectorRule(x)): [];

    const sectors = this.usesSector ?
      this.account.sectorRules.map(x => this.getSectorRoleField(x.sector.code, x.sectorRole)) : [];

    this.accountEditionCommand.sectorRules = sectors;
  }


  private setInitSectorsWithSubledgers() {
    const sectorWithSubledger = this.account.sectorRules.filter(x => x.sectorRole === SectorRole.Control);
    this.setAccountSectorsWithSubledgerAccountList(sectorWithSubledger)
  }


  private getAccountFieldsFromAccount(account: Account): AccountFields {
    return {
      accountNumber: account.number ?? '',
      name: account.name ?? '',
      description: account.description ?? '',
      role: getAccountMainRole(account.role, account.usesSector, account.usesSubledger),
      accountTypeUID: account.type.uid ?? '',
      debtorCreditor: account.debtorCreditor ?? '',
    };
  }


  private getAccountItemFromCurrencyRule(rule: CurrencyRule): AccountItem {
    return {
        uid: rule.currency.uid,
        fullName: rule.currency.fullName,
        startDate: rule.startDate,
        endDate: rule.endDate,
    };
  }


  private getAccountItemFromSectorRule(rule: SectorRule): AccountItem {
    return {
      uid: rule.sector.uid,
      fullName: rule.sector.fullName,
      role: rule.sectorRole,
      startDate: rule.startDate,
      endDate: rule.endDate,
    };
  }


  private getSectorRoleField(code: string, role: SectorRole): SectorRoleField {
    return {code, role};
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


  private executeAccountOperation(observable: EmpObservable<AccountEditionResult>, dryRun: boolean) {
    this.submitted = true;

    observable
      .firstValue()
      .then(x => this.resolveAccountEditionResult(x, dryRun))
      .finally(() => this.submitted = false);
  }


  private resolveAccountEditionResult(result: AccountEditionResult, dryRun: boolean) {
    this.accountEditionResult = result;

    if (dryRun) {
      this.executedDryRun = true;
    } else {
      this.accountEdited = true;

      const account = !isEmpty(this.accountEditionResult.outcome) ?
        this.accountEditionResult.outcome: EmptyAccount;

      sendEvent(this.accountEditionWizardEvent, AccountEditionWizardEventType.ACCOUNT_EDITED, {account});
    }
  }


  private showConfirmDeleteMessage() {
    const accountName = `${this.account.number}: ${this.account.name} (${this.accountRoleDescriptionForTitle})`;
    const accountsChartName = this.account.accountsChart.name;
    const command = this.getAccountEditionCommandForDelete();

    let message = `Esta operación eliminara la cuenta
                   <strong> ${accountName}</strong>
                   del catálogo de cuentas <strong> ${accountsChartName}</strong>,
                   con fecha de ${DateStringLibrary.format(command.applicationDate)}.
                   <br><br>¿Elimino la cuenta?`;

    this.messageBox.confirm(message, 'Eliminar cuenta', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          this.deleteAccount(command);
        }
      });
  }


  private deleteAccount(command: AccountEditionCommand) {
    this.submitted = true;

    this.accountsData.deleteAccount(command.accountsChartUID, command.accountUID, command)
      .firstValue()
      .then(x => this.resolveAccountDeleteResponse())
      .finally(() => this.submitted = false);
  }


  private resolveAccountDeleteResponse() {
    this.messageBox.show('La cuenta fue eliminada correctamente.', 'Eliminar Cuenta');
    sendEvent(this.accountEditionWizardEvent, AccountEditionWizardEventType.ACCOUNT_EDITED,
      {account: EmptyAccount});
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


  private validateResetCurrencies() {
    if (this.accountRole === AccountRole.Sumaria) {
      this.accountEditionCommand.currencies = [];
      return;
    }

    if (this.isSaved) {
      this.accountEditionCommand.currencies = this.account.currencyRules.map(x => x.currency.uid);
    }
  }


  private validateResetSectors() {
    if (!this.usesSector) {
      this.accountEditionCommand.sectorRules = [];
    }
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


  private getAccountEditionCommand(dryRun: boolean): AccountEditionCommand {
    const command: AccountEditionCommand = {
      dryRun: dryRun,
      commandType: this.commandType,
      accountsChartUID: this.accountEditionCommand.accountsChartUID,
      accountUID: this.isSaved ? this.account.uid : '',
      applicationDate: this.accountEditionCommand.applicationDate,
      dataToBeUpdated: this.showConfigStep ? this.dataToUpdateSelected : [],
      accountFields: this.accountEditionCommand.accountFields,
      currencies: this.accountEditionCommand.currencies,
      sectorRules: this.accountEditionCommand.sectorRules,
    };

    return command;
  }


  private getAccountEditionCommandForDelete(): AccountEditionCommand {
    const command: AccountEditionCommand = {
      dryRun: false,
      commandType: AccountEditionCommandType.DeleteAccount,
      accountsChartUID: this.account.accountsChart.uid,
      accountUID: this.account.uid,
      applicationDate: DateStringLibrary.today(),
      dataToBeUpdated: [],
      accountFields: this.getAccountFieldsFromAccount(this.account),
      currencies: this.account.currencyRules.map(x => x.currency.uid),
      sectorRules: this.account.sectorRules.map(x => this.getSectorRoleField(x.sector.code, x.sectorRole)),
    };

    return command;
  }

}
