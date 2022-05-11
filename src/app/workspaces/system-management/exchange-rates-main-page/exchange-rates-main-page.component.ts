/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { combineLatest } from 'rxjs';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ExchangeRatesStateSelector } from '@app/presentation/exported.presentation.types';

import { ExchangeRatesDataService } from '@app/data-services';

import { PermissionsLibrary } from '@app/main-layout';

import { EmptyExchangeRateData, ExchangeRatesSearchCommand, ExchangeRateData, ExecuteDatasetsCommand,
         mapToExchangeRatesSearchCommand } from '@app/models';

import {
  ImportedDataViewerEventType
} from '@app/views/reports-controls/imported-data-viewer/imported-data-viewer.component';

import {
  ExchangeRatesEditorEventType
} from '@app/views/exchange-rates/exchange-rates-editor/exchange-rates-editor.component';


@Component({
  selector: 'emp-fa-exchange-rates-main-page',
  templateUrl: './exchange-rates-main-page.component.html',
})
export class ExchangeRatesMainPageComponent implements OnInit, OnDestroy {

  displayExchangeRatesEditor = false;

  commandExecuted = false;

  command: ExchangeRatesSearchCommand = null;

  exchangeRateData: ExchangeRateData = Object.assign({}, EmptyExchangeRateData);

  permissionToEdit = PermissionsLibrary.FEATURE_EDICION_TIPOS_CAMBIO;

  excelFileUrl = '';

  exchangeRateTypeList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];

  submitted = false;

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private exchangeRatesData: ExchangeRatesDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onImportedDataViewerEvent(event: EventInfo){
    if (this.submitted) {
      return;
    }

    switch (event.type as ImportedDataViewerEventType) {

      case ImportedDataViewerEventType.EXECUTE_DATA:
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.commandExecuted = false;
        this.exchangeRateData = Object.assign({}, EmptyExchangeRateData);
        this.command = mapToExchangeRatesSearchCommand(event.payload.command as ExecuteDatasetsCommand);
        this.searchExchangeRates(this.command);
        return;

      case ImportedDataViewerEventType.EXPORT_DATA:
        this.exportExchangeRatesToExcel(this.command);
        return;

      case ImportedDataViewerEventType.EDIT_DATA_CLICKED:
        this.displayExchangeRatesEditor = true;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExchangeRatesEditorEvent(event: EventInfo) {
    switch (event.type as ExchangeRatesEditorEventType) {

      case ExchangeRatesEditorEventType.CLOSE_MODAL_CLICKED:
        this.displayExchangeRatesEditor = false;
        return;

      case ExchangeRatesEditorEventType.DATA_UPDATED:
        if (this.commandExecuted) {
          this.searchExchangeRates(this.command);
        }

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private loadDataLists() {
    this.setSubmitted(true);

    combineLatest([
      this.helper.select<Identifiable[]>(ExchangeRatesStateSelector.EXCHANGE_RATES_TYPES_LIST),
      this.helper.select<Identifiable[]>(ExchangeRatesStateSelector.CURRENCIES_LIST),
    ])
    .subscribe(([a, b]) => {
      this.exchangeRateTypeList = a;
      this.currenciesList = b;
      this.setSubmitted(false);
    });
  }


  private searchExchangeRates(command: ExchangeRatesSearchCommand) {
    this.setSubmitted(true);

    this.exchangeRatesData.searchExchangeRates(command)
      .toPromise()
      .then(x => {
        this.commandExecuted = true;
        this.exchangeRateData = Object.assign({}, EmptyExchangeRateData, {entries: x});
      })
      .finally(() => this.setSubmitted(false));
  }


  private exportExchangeRatesToExcel(command) {
    this.exchangeRatesData.exportExchangeRatesToExcel(command)
      .toPromise()
      .then(x => this.excelFileUrl = x.url);
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
