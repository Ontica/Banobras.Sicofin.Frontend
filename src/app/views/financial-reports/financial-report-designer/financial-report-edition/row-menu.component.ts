/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';


export enum RowMenuEventType {
  INSERT_ITEM_CLICKED = 'RowMenuComponent.Event.InsertItemClicked',
  UPDATE_ITEM_CLICKED = 'RowMenuComponent.Event.UpdateItemClicked',
  REMOVE_ITEM_CLICKED = 'RowMenuComponent.Event.RemoveItemClicked',
}


@Component({
  selector: 'emp-fa-row-menu',
  templateUrl: './row-menu.component.html',
})
export class RowMenuComponent {

  @Input() isSelected = false;

  @Input() canEditRows = false;

  @Output() rowMenuEvent = new EventEmitter<EventInfo>();


  get displayMenu(): boolean {
    return this.canEditRows && this.isSelected;
  }


  onInsertItemClicked() {
    sendEvent(this.rowMenuEvent, RowMenuEventType.INSERT_ITEM_CLICKED);
  }


  onUpdateItemClicked() {
    sendEvent(this.rowMenuEvent, RowMenuEventType.UPDATE_ITEM_CLICKED);
  }


  onRemoveItemClicked() {
    sendEvent(this.rowMenuEvent, RowMenuEventType.REMOVE_ITEM_CLICKED);
  }

}
