/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { RulesDataService } from '@app/data-services';

import { EmptyGroupingRule, EmptyGroupingRuleCommand, EmptyGroupingRuleDataTable, GroupingRule,
         GroupingRuleCommand, GroupingRuleDataTable } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { DataTableEventType } from '@app/views/reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { GroupingRulesFilterEventType } from './grouping-rules-filter.component';

export enum GroupingRulesViewerEventType {
  GROUPING_RULE_SELECTED = 'GroupingRulesViewerComponent.Event.GroupingRuleSelected',
}

@Component({
  selector: 'emp-fa-grouping-rules-viewer',
  templateUrl: './grouping-rules-viewer.component.html',
})
export class GroupingRulesViewerComponent {

  @Output() groupingRulesViewerEvent = new EventEmitter<EventInfo>();

  rulesSetName = '';

  cardHint = 'Selecciona los filtros';

  isLoading = false;

  submitted = false;

  commandExecuted = false;

  groupingRuleData: GroupingRuleDataTable = EmptyGroupingRuleDataTable;

  groupingRuleCommand: GroupingRuleCommand = Object.assign({}, EmptyGroupingRuleCommand);

  displayExportModal = false;

  excelFileUrl = '';

  selectedGroupingRule = EmptyGroupingRule;

  constructor(private rulesData: RulesDataService) { }


  onGroupingRulesFilterEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as GroupingRulesFilterEventType) {

      case GroupingRulesFilterEventType.SEARCH_GROUPING_RULES_CLICKED:
        Assertion.assertValue(event.payload.groupingRuleCommand, 'event.payload.groupingRuleCommand');
        Assertion.assertValue(event.payload.rulesSetName, 'event.payload.rulesSetName');

        this.commandExecuted = true;
        this.groupingRuleCommand = event.payload.groupingRuleCommand as GroupingRuleCommand;
        this.rulesSetName = event.payload.rulesSetName;
        this.getGroupingRules();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onGroupingRulesTableEvent(event) {
    switch (event.type as DataTableEventType) {

      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload, 'event.payload');
        this.setText(event.payload);
        return;

      case DataTableEventType.EXPORT_DATA:
        this.setDisplayExportModal(true);
        return;

      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        this.selectedGroupingRule = event.payload.entry as GroupingRule;
        this.emitGroupingRuleSelected(this.selectedGroupingRule);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        if (this.submitted || !this.groupingRuleData.command.accountsChartUID) {
          return;
        }

        this.exportGroupingRulesToExcel();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getGroupingRules() {
    this.setSubmitted(true);

    this.rulesData.getGroupingRules(this.groupingRuleCommand.rulesSetUID)
      .toPromise()
      .then(x => {
        this.groupingRuleData = Object.assign({}, this.groupingRuleData,
          {command: this.groupingRuleCommand, entries: x});
        this.setText();
        this.emitGroupingRuleSelected(EmptyGroupingRule);
      })
      .finally(() => this.setSubmitted(false));
  }


  private exportGroupingRulesToExcel() {
    this.rulesData.exportGroupingRulesToExcel(this.groupingRuleCommand.rulesSetUID)
      .toPromise()
      .then(x => {
        this.excelFileUrl = x.url;
      });
  }


  private setText(itemsDisplayed?: number) {
    if (!this.commandExecuted) {
      this.cardHint = 'Selecciona los filtros';
      return;
    }

    if (typeof itemsDisplayed === 'number' && itemsDisplayed !== this.groupingRuleData.entries.length) {
      this.cardHint = `${this.rulesSetName} - ${itemsDisplayed} de ` +
        `${this.groupingRuleData.entries.length} registros mostrados`;
      return;
    }

    this.cardHint = `${this.rulesSetName} - ${this.groupingRuleData.entries.length} registros encontrados`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.excelFileUrl = '';
  }


  private emitGroupingRuleSelected(groupingRule: GroupingRule) {
    const payload = {
      groupingRule,
    };

    sendEvent(this.groupingRulesViewerEvent, GroupingRulesViewerEventType.GROUPING_RULE_SELECTED, payload);
  }

}
