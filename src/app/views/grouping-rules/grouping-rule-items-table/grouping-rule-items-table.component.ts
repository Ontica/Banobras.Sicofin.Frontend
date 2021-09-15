/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { GroupingRuleItem } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

export enum GroupingRuleItemsTableEventType {
  UPDATE_GROUPING_RULE_ITEM_CLICKED = 'GroupingRuleItemsTableComponent.Event.UpdateGroupingRuleItemClicked',
  REMOVE_GROUPING_RULE_ITEM_CLICKED = 'GroupingRuleItemsTableComponent.Event.RemoveGroupingRuleItemClicked',
}

@Component({
  selector: 'emp-fa-grouping-rule-items-table',
  templateUrl: './grouping-rule-items-table.component.html',
})
export class GroupingRuleItemsTableComponent implements OnChanges {

  @Input() groupingRuleItemList: GroupingRuleItem[] = [];

  @Input() canEdit = false;

  @Input() isLoading = false;

  @Output() groupingRuleItemsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['itemCode', 'itemName', 'subledgerAccount', 'sectorCode', 'operator'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<GroupingRuleItem>;

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.groupingRuleItemList) {
      this.dataSource = new MatTableDataSource(this.groupingRuleItemList);
      this.resetColumns();
    }
  }


  onUpdateGroupingRuleItemClicked(groupingRuleItem: GroupingRuleItem) {
    if (this.canEdit && window.getSelection().toString().length <= 0) {
      sendEvent(this.groupingRuleItemsTableEvent,
        GroupingRuleItemsTableEventType.UPDATE_GROUPING_RULE_ITEM_CLICKED, {groupingRuleItem});
    }
  }


  onRemoveGroupingRuleItemClicked(groupingRuleItem: GroupingRuleItem) {

    const message = this.getConfirmMessage(groupingRuleItem);

    this.messageBox.confirm(message, 'Eliminar subagrupación', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.groupingRuleItemsTableEvent,
            GroupingRuleItemsTableEventType.REMOVE_GROUPING_RULE_ITEM_CLICKED, {groupingRuleItem});
        }
      });
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(groupingRuleItem: GroupingRuleItem): string {
    return `
      <table style='margin: 0;'>
        <tr><td class='nowrap'>Clave / Cuenta: </td><td><strong>
          ${groupingRuleItem.itemCode}
        </strong></td></tr>

        <tr><td class='nowrap'>Descripción: </td><td><strong>
          ${groupingRuleItem.itemName}
        </strong></td></tr>

        <tr><td class='nowrap'>Auxiliar: </td><td><strong>
          ${!!groupingRuleItem.subledgerAccount.trim() ? groupingRuleItem.subledgerAccount : '-'}
        </strong></td></tr>
      </table>

     <br>¿Elimino la subagrupación?`;
  }

}
