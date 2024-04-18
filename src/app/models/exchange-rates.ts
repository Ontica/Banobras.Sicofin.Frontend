/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableColumnType, DataTableQuery,
         DataTableEntry } from './_data-table';

import { ExecuteDatasetsQuery } from './imported-data';

export interface ExchangeRate {
  id: number;
  exchangeRateType: Identifiable;
  date: DateString;
  fromCurrency: Identifiable;
  toCurrency: Identifiable;
  value: number;
}


export interface ExchangeRatesQuery extends DataTableQuery {
  fromDate: DateString;
  toDate: DateString;
  exchangeRateTypes?: string[];
  currencies?: string[];
}


export interface ExchangeRateData extends DataTable {
  query: ExchangeRatesQuery;
  columns: DataTableColumn[];
  entries: ExchangeRateDescriptor[];
}


export interface ExchangeRateDescriptor extends DataTableEntry {
  id: number;
  exchangeRateType: string;
  date: DateString;
  currency: string;
  value: number;
}


export const ExchangeRateColumns: DataTableColumn[] = [
  {
    field: 'date',
    title: 'Fecha',
    type: DataTableColumnType.date,
  },
  {
    field: 'exchangeRateType',
    title: 'Tipo',
    type: DataTableColumnType.text,
  },
  {
    field: 'currency',
    title: 'Moneda',
    type: DataTableColumnType.text,
  },
  {
    field: 'value',
    title: 'Valor',
    type: DataTableColumnType.decimal,
    digits: 6,
  },
];


export const EmptyExchangeRatesQuery: ExchangeRatesQuery = {
  fromDate: '',
  toDate: '',
  exchangeRateTypes: [],
  currencies: [],
};


export const EmptyExchangeRateData: ExchangeRateData = {
  query: EmptyExchangeRatesQuery,
  columns: ExchangeRateColumns,
  entries: [],
};


export function mapToExchangeRatesQuery(query: ExecuteDatasetsQuery): ExchangeRatesQuery {
  const exchangeRatesQuery: ExchangeRatesQuery = {
    exchangeRateTypes: !!query.typeUID ? query.typeUID as string[] : [],
    currencies: !!query.additionalUID ? query.additionalUID as string[] : [],
    fromDate: query.fromDate,
    toDate: query.toDate,
  };

  return exchangeRatesQuery;
}


export interface ExchangeRateValues {
  exchangeRateTypeUID: string;
  date: DateString;
  values?: ExchangeRateValue[];
}


export interface ExchangeRateValue {
  toCurrencyUID: string;
  toCurrency?: string;
  value: number;
  hasValue?: boolean;
  valueEdited?: string;
}
