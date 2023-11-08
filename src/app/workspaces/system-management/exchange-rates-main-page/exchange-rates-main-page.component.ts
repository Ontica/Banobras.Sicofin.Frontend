/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { combineLatest } from 'rxjs';

import { Assertion, EventInfo, Identifiable, SessionService } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { PERMISSIONS } from '@app/main-layout';

import { CataloguesStateSelector, ExchangeRatesStateSelector } from '@app/presentation/exported.presentation.types';

import { ExchangeRatesDataService } from '@app/data-services';

import { EmptyExchangeRateData, ExchangeRatesQuery, ExchangeRateData, ExecuteDatasetsQuery,
         mapToExchangeRatesQuery } from '@app/models';

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

  queryExecuted = false;

  query: ExchangeRatesQuery = null;

  exchangeRateData: ExchangeRateData = Object.assign({}, EmptyExchangeRateData);

  hasPermissionToEdit = false;

  excelFileUrl = '';

  exchangeRateTypeList: Identifiable[] = [];

  currenciesList: Identifiable[] = [];

  submitted = false;

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private exchangeRatesData: ExchangeRatesDataService,
              private session: SessionService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadDataLists();
    this.setHasPermissionToEdit();
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
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.queryExecuted = false;
        this.exchangeRateData = Object.assign({}, EmptyExchangeRateData);
        this.query = mapToExchangeRatesQuery(event.payload.query as ExecuteDatasetsQuery);
        this.searchExchangeRates(this.query);
        return;

      case ImportedDataViewerEventType.EXPORT_DATA:
        this.exportExchangeRatesToExcel(this.query);
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
        if (this.queryExecuted) {
          this.searchExchangeRates(this.query);
        }

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setHasPermissionToEdit() {
    this.hasPermissionToEdit = this.session.hasPermission(PERMISSIONS.FEATURE_EDICION_TIPOS_CAMBIO);
  }


  private loadDataLists() {
    this.setSubmitted(true);

    combineLatest([
      this.helper.select<Identifiable[]>(ExchangeRatesStateSelector.EXCHANGE_RATES_TYPES_LIST),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES_LIST),
    ])
    .subscribe(([a, b]) => {
      this.exchangeRateTypeList = a;
      this.currenciesList = b;
      this.setSubmitted(false);
    });
  }


  private searchExchangeRates(query: ExchangeRatesQuery) {
    this.setSubmitted(true);

    this.exchangeRatesData.searchExchangeRates(query)
      .firstValue()
      .then(x => {
        this.queryExecuted = true;
        this.exchangeRateData = Object.assign({}, EmptyExchangeRateData, {entries: x});
      })
      .finally(() => this.setSubmitted(false));
  }


  private exportExchangeRatesToExcel(query) {
    this.exchangeRatesData.exportExchangeRatesToExcel(query)
      .firstValue()
      .then(x => this.excelFileUrl = x.url);
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
