/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptyStoredBalanceSet, StoredBalanceSet } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

export enum StoredBalanceSetsTableEventType {
  SEARCH_BALANCES_SET = 'StoredBalanceSetsTableComponent.Event.SearchBalancesSet',
  SELECT_BALANCES_SET = 'StoredBalanceSetsTableComponent.Event.SelectBalancesSet',
  CREATE_BALANCE_SET = 'StoredBalanceSetsTableComponent.Event.CreateBalancesSet',
}

@Component({
  selector: 'emp-fa-stored-balance-sets-table',
  templateUrl: './stored-balance-sets-table.component.html',
})
export class StoredBalanceSetsTableComponent implements OnChanges, OnInit, OnDestroy  {

  @Input() storedBalanceSetList: StoredBalanceSet[] = [];

  @Input() selectedStoredBalanceSet: StoredBalanceSet = EmptyStoredBalanceSet;

  @Output() storedBalanceSetsTableEvent = new EventEmitter<EventInfo>();

  isLoading = false;

  isLoadingAccountChart = false;

  cardHint = 'Favor de seleccionar los filtros';

  displayedColumns: string[] = ['accountsChart', 'name', 'balancesDate', 'calculationTime'];

  dataSource: MatTableDataSource<StoredBalanceSet>;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  accountChartSelected: AccountsChartMasterData = null;

  helper: SubscriptionHelper;

  textNotFound = 'No se ha invocado la consulta.';

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.storedBalanceSetList) {
      this.setText(this.accountChartSelected?.name);
      this.dataSource = new MatTableDataSource(this.storedBalanceSetList);
      this.isLoading = false;
    }
  }


  ngOnInit(): void {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onSearchBalancesSetClicked() {
    this.isLoading = true;
    sendEvent(this.storedBalanceSetsTableEvent, StoredBalanceSetsTableEventType.SEARCH_BALANCES_SET,
      {accountsChart: this.accountChartSelected});
  }


  onSelectStoredBalanceSetClicked(storedBalanceSet: StoredBalanceSet) {
    sendEvent(this.storedBalanceSetsTableEvent, StoredBalanceSetsTableEventType.SELECT_BALANCES_SET,
      {storedBalanceSet});
  }


  onClickCreateBalanceSet() {
    sendEvent(this.storedBalanceSetsTableEvent, StoredBalanceSetsTableEventType.CREATE_BALANCE_SET);
  }


  private loadAccountsCharts() {
    this.isLoadingAccountChart = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.isLoadingAccountChart = false;
      });
  }


  private setText(accountsChartName) {
    this.cardHint = accountsChartName ?? 'Filtro no seleccionado';
    this.textNotFound = isEmpty(this.accountChartSelected) ? 'No se ha invocado la consulta.' :
      'No se encontraron registros con el filtro proporcionado.';
  }

}
