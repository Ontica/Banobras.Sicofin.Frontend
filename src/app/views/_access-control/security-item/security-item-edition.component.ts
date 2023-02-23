/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

export enum SecurityItemEditionEventType {
  FILTER_CHANGED = 'SecurityItemEditionComponent.Event.FilterChanged',
  ASSIGN_ITEM    = 'SecurityItemEditionComponent.Event.AssignItem',
  REMOVE_ITEM    = 'SecurityItemEditionComponent.Event.RemoveItem',
}

@Component({
  selector: 'emp-ng-security-item-edition',
  templateUrl: './security-item-edition.component.html',
})
export class SecurityItemEditionComponent implements OnChanges {

  @Input() itemsList: Identifiable[] = [];

  @Input() itemsForFilterList: Identifiable[] = [];

  @Input() itemsToAssignList: Identifiable[] = [];

  @Input() canEdit = false;

  @Input() filterRequired = false;

  @Input() itemTypeName: string = '';

  @Input() queryExcecuted = true;

  @Input() submitted = false;

  @Output() securityItemEditionEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['item'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<Identifiable>;

  selectedFilter = null;

  displayItemAssign = false;

  itemToAssign = Empty;

  itemsToAssignValidsList: Identifiable[] = [];


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.itemsList) {
      this.setDataTable();
      this.resetItemAssign();
    }

    if (changes.itemsForFilterList) {
      this.validateResetFilter();
    }
  }


  get isFilterValid(): boolean {
    return this.filterRequired ? !!this.selectedFilter : true;
  }


  get isItemToAssignValid(): boolean {
    return !isEmpty(this.itemToAssign);
  }


  onSelectedFilterChanges(item: Identifiable) {
    const payload = {
      itemUID: item.uid,
    };

    sendEvent(this.securityItemEditionEvent, SecurityItemEditionEventType.FILTER_CHANGED, payload);
  }


  onAssignItemButtonClicked() {
    this.displayItemAssign = true;
    this.itemToAssign = Empty;
    this.setItemsToAssignValids();
  }


  onCloseItemAssign() {
    this.resetItemAssign();
  }


  onAssignItem() {
    sendEvent(this.securityItemEditionEvent, SecurityItemEditionEventType.ASSIGN_ITEM,
      {itemUID: this.itemToAssign.uid});
  }


  onRemoveItemClicked(item: Identifiable) {
    this.showConfirmMessage(item);
  }


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.itemsList);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private validateResetFilter() {
    if (!this.itemsForFilterList.map(x => x.uid).includes(this.selectedFilter)) {
      this.selectedFilter = null;
      setTimeout(() => this.onSelectedFilterChanges(Empty));
    }
  }


  private resetItemAssign() {
    this.displayItemAssign = false;
    this.itemToAssign = Empty;
    this.itemsToAssignValidsList = [];
  }


  private setItemsToAssignValids() {
    this.itemsToAssignValidsList =
      this.itemsToAssignList.filter(x => !this.itemsList.map(y => y.uid).includes(x.uid));
  }


  private showConfirmMessage(item: Identifiable) {
    const title = `Eliminar ${this.itemTypeName.toLowerCase()}`;
    const message = `Esta operación eliminara del usuario el elemento
      <strong> ${this.itemTypeName}: ${item.name}</strong>.
      <br><br>¿Elimino el elemento?`;

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.securityItemEditionEvent,
            SecurityItemEditionEventType.REMOVE_ITEM, {itemUID: item.uid});
        }
      });
  }

}
