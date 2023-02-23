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
  SELECTOR_CHANGED = 'SecurityItemEditionComponent.Event.SelectorChanged',
  ASSIGN_ITEM      = 'SecurityItemEditionComponent.Event.AssignItem',
  REMOVE_ITEM      = 'SecurityItemEditionComponent.Event.RemoveItem',
}

@Component({
  selector: 'emp-ng-security-item-edition',
  styles: [`
    .items-container {
      max-height: 100%;
      overflow-y: auto;
    }

    @media (min-height: 800px) {
      .items-container {
        max-height: 640px;
        overflow-y: auto;
      }
    }
  `],
  templateUrl: './security-item-edition.component.html',
})
export class SecurityItemEditionComponent implements OnChanges {

  @Input() itemsList: Identifiable[] = [];

  @Input() itemsForSelectorList: Identifiable[] = [];

  @Input() itemsToAssignList: Identifiable[] = [];

  @Input() canEdit = false;

  @Input() selectorRequired = false;

  @Input() itemTypeName: string = '';

  @Input() queryExcecuted = true;

  @Input() submitted = false;

  @Output() securityItemEditionEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['item'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<Identifiable>;

  selectedSelectorUID = null;

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

    if (changes.itemsForSelectorList) {
      this.validateResetSelector();
    }
  }


  get isSelectorValid(): boolean {
    return this.selectorRequired ? !!this.selectedSelectorUID : true;
  }


  get isItemToAssignValid(): boolean {
    return !isEmpty(this.itemToAssign);
  }


  onSelectedSelectorChanges(selector: Identifiable) {
    const payload = {
      selectorUID: selector.uid ?? '',
    };

    sendEvent(this.securityItemEditionEvent, SecurityItemEditionEventType.SELECTOR_CHANGED, payload);
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
    const payload = {
      selectorUID: this.selectedSelectorUID ?? '',
      itemUID: this.itemToAssign.uid,
    };

    sendEvent(this.securityItemEditionEvent, SecurityItemEditionEventType.ASSIGN_ITEM, payload);
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


  private validateResetSelector() {
    if (!!this.selectedSelectorUID &&
        !this.itemsForSelectorList.map(x => x.uid).includes(this.selectedSelectorUID)) {
      this.selectedSelectorUID = null;
      setTimeout(() => this.onSelectedSelectorChanges(Empty));
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
          const payload = {
            selectorUID: this.selectedSelectorUID ?? '',
            itemUID: item.uid,
          };

          sendEvent(this.securityItemEditionEvent, SecurityItemEditionEventType.REMOVE_ITEM, payload);
        }
      });
  }

}
