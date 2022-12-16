/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
         ViewChild } from '@angular/core';

import { EventInfo } from '@app/core';

import { FinancialConcept, FinancialConceptDescriptor} from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

export enum FinancialConceptsTableEventType {
  ENTRIES_DISPLAYED_TEXT    = 'FinancialConceptsTableComponent.Event.EntriesDisplayedText',
  FINANCIAL_CONCEPT_CLICKED = 'FinancialConceptsTableComponent.Event.FinancialConceptClicked',
  EXPORT_DATA               = 'FinancialConceptsTableComponent.Event.ExportData',
}

@Component({
  selector: 'emp-fa-financial-concepts-table',
  templateUrl: './financial-concepts-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialConceptsTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() financialConceptsList: FinancialConceptDescriptor[] = [];

  @Input() selectedFinancialConcept: FinancialConcept = null;

  @Input() queryExecuted = true;

  @Input() isLoading = false;

  @Output() financialConceptsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns: string[] = ['code', 'name', 'variableID'];

  dataSource: TableVirtualScrollDataSource<FinancialConceptDescriptor>;

  filter = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.financialConceptsList) {
      this.filter = '';
      this.setDataSource();
      this.scrollToTop();
    }
  }


  onFilterData() {
    this.applyFilter(this.filter);
  }


  onClearFilter() {
    this.filter = '';
    this.applyFilter(this.filter);
  }


  onExportButtonClicked() {
    sendEvent(this.financialConceptsTableEvent, FinancialConceptsTableEventType.EXPORT_DATA);
  }


  onFinancialConceptClicked(financialConcept: FinancialConceptDescriptor) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.financialConceptsTableEvent, FinancialConceptsTableEventType.FINANCIAL_CONCEPT_CLICKED,
        { financialConcept });
    }
  }


  private setDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(this.financialConceptsList);
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }


  private getFilterPredicate() {
    return (row: FinancialConceptDescriptor, filters: string) => (
      this.displayedColumns.filter(x => row[x] && row[x].toString().toLowerCase().includes(filters)).length > 0
    );
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    this.scrollToTop();
    this.emitEntriesDisplayedText();
  }


  private emitEntriesDisplayedText() {
    const entriesTotal = this.financialConceptsList.length;
    const filteredEntriesTotal = this.dataSource.filteredData.length;
    const entriesDisplayedText = this.displayedEntriesMessage(entriesTotal, filteredEntriesTotal);

    sendEvent(this.financialConceptsTableEvent, FinancialConceptsTableEventType.ENTRIES_DISPLAYED_TEXT,
      {entriesDisplayedText});
  }


  private displayedEntriesMessage(entriesTotal: number, filteredEntriesTotal: number) {
    if (filteredEntriesTotal === entriesTotal) {
      return `${entriesTotal} registros encontrados`;
    }

    return `${filteredEntriesTotal} de ${entriesTotal} registros mostrados`;
  }

}
