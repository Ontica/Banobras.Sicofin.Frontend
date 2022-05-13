/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { ExchangeRatesDataService } from '@app/data-services';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ExchangeRateValue, ExchangeRateValues } from '@app/models';

import { FormatLibrary, sendEvent } from '@app/shared/utils';


export enum ExchangeRatesEditorEventType {
  CLOSE_MODAL_CLICKED  = 'ExchangeRatesEditorComponent.Event.CloseModalClicked',
  DATA_UPDATED         = 'ExchangeRatesEditorComponent.Event.DataUpdated',
}

@Component({
  selector: 'emp-fa-exchange-rates-editor',
  templateUrl: './exchange-rates-editor.component.html',
})
export class ExchangeRatesEditorComponent {

  @Input() exchangeRateTypeList: Identifiable[] = [];

  @Output() exchangeRatesEditorEvent = new EventEmitter<EventInfo>();

  isLoading = false;

  submitClicked = false;

  formData = {
    exchangeRateType: null,
    date: null,
  };

  exchangeRateValuesSelected: ExchangeRateValues;


  constructor(private exchangeRatesData: ExchangeRatesDataService,
              private messageBox: MessageBoxService){}


  get hintText(): string {
    if (this.isLoading) {
      return 'Cargando...';
    }

    return !this.exchangeRateValuesSelected ? 'Seleccionar el tipo de cambio a editar.' :
      'El tipo de cambio seleccionado no tiene monedas asignadas.';
  }


  get selectorValid() {
    return !!this.formData.exchangeRateType && !!this.formData.date;
  }


  get valuesValid() {
    return this.exchangeRateValuesSelected?.values.length > 0 && this.exchangeRateValuesSelected.values
      .filter(x => FormatLibrary.stringToNumber(x.valueEdited) <= 0).length === 0;
  }


  get isDataValid() {
    return this.selectorValid && this.valuesValid;
  }


  onClose() {
    sendEvent(this.exchangeRatesEditorEvent, ExchangeRatesEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onExchangeRatesFilterChanged() {
    setTimeout(() => {
      this.submitClicked = false;

      if (this.selectorValid) {
        this.getExchangeRatesForEdition();
      } else {
        this.exchangeRateValuesSelected = null;
      }
    });
  }


  onUpdateExchangeRatesClicked() {
    this.submitClicked = true;

    if (this.isDataValid) {
      this.updateExchangeRates();
    }
  }


  private getSelectorData(): ExchangeRateValues {
    const exchangeRateForEditionCommand: ExchangeRateValues = {
      exchangeRateTypeUID: this.formData.exchangeRateType,
      date: this.formData.date,
    }

    return exchangeRateForEditionCommand;
  }


  private getExchangeRatesForEdition() {
    this.isLoading = true;

    this.exchangeRatesData.getExchangeRatesForEdition(this.getSelectorData())
      .toPromise()
      .then(x => this.setExchangeRateValuesSelected(x))
      .catch(x=> this.exchangeRateValuesSelected = null)
      .finally(() => this.isLoading = false);
  }


  private setExchangeRateValuesSelected(exchangeRateValues: ExchangeRateValues) {
    exchangeRateValues.values
      .forEach(x => x.valueEdited = x.hasValue ? FormatLibrary.numberWithCommas(x.value, '1.6-6') : '');

    this.exchangeRateValuesSelected = exchangeRateValues;
  }


  private updateExchangeRates() {
    this.isLoading = true;

    this.exchangeRatesData.updateExchangeRates(this.getExchangeRatesData())
      .toPromise()
      .then(x => {
        this.emitDataUpdated(x);
        this.onClose();
      })
      .finally(() => this.isLoading = false);
  }


  private getExchangeRatesData(): ExchangeRateValues {
    Assertion.assert(this.isDataValid,
      'Programming error: form must be validated before command execution.');

    const data: ExchangeRateValues = {
      exchangeRateTypeUID: this.exchangeRateValuesSelected.exchangeRateTypeUID,
      date: this.exchangeRateValuesSelected.date,
      values: this.getExchangeRateValues(),
    };

    return data;
  }


  private getExchangeRateValues() {
    const valuesList: ExchangeRateValue[] = [];

    this.exchangeRateValuesSelected.values.forEach(x => {
      const value: ExchangeRateValue = {
        toCurrencyUID: x.toCurrencyUID,
        value: FormatLibrary.stringToNumber(x.valueEdited),
      };

      valuesList.push(value);
    });

    return valuesList;
  }


  private emitDataUpdated(exchangeRateValues: ExchangeRateValues) {
    this.messageBox.show(`Los tipos de cambio se actualizaron correctamente.`, 'Editor de tipos de cambio');

    sendEvent(this.exchangeRatesEditorEvent, ExchangeRatesEditorEventType.DATA_UPDATED, {exchangeRateValues});
  }

}
