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
  ADD_ITEM       = 'SecurityItemEditionComponent.Event.AddItem',
  REMOVE_ITEM    = 'SecurityItemEditionComponent.Event.RemoveItem',
}

@Component({
  selector: 'emp-ng-security-item-edition',
  templateUrl: './security-item-edition.component.html',
})
export class SecurityItemEditionComponent implements OnChanges {

  @Input() itemsList: Identifiable[] = [];

  @Input() itemsForFilterList: Identifiable[] = [];

  @Input() itemsForAddList: Identifiable[] = [];

  @Input() canEdit = false;

  @Input() filterRequired = false;

  @Input() itemTypeName: string = '';

  @Input() notFoundText = 'No se han definido elementos.';

  @Output() securityItemEditionEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['item'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<Identifiable>;

  selectedFilter = null;

  displayItemAdd = false;

  itemToAdd = Empty;

  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.itemsList) {
      this.dataSource = new MatTableDataSource(this.itemsList);
      this.resetColumns();
    }

    if (changes.itemsForFilterList) {
      this.selectedFilter = null;
    }
  }


  get isFilterValid(): boolean {
    return this.filterRequired ? !!this.selectedFilter : true;
  }


  get isItemToAddValid(): boolean {
    return !isEmpty(this.itemToAdd);
  }


  onSelectedFilterChanges(item: Identifiable) {
    const payload = {
      itemUID: item.uid,
    };

    sendEvent(this.securityItemEditionEvent, SecurityItemEditionEventType.FILTER_CHANGED, payload);
  }


  onAddItemButtonClicked() {
    this.displayItemAdd = true;
    this.itemToAdd = Empty;
  }


  onCloseItemAdd() {
    this.displayItemAdd = false;
    this.itemToAdd = Empty;
  }


  onAddItem() {
    sendEvent(this.securityItemEditionEvent, SecurityItemEditionEventType.ADD_ITEM,
      {itemUID: this.itemToAdd.uid});
  }


  onRemoveItemClicked(item: Identifiable) {
    this.showConfirmMessage(item);
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
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
