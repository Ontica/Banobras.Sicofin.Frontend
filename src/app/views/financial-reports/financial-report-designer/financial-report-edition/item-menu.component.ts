/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';


export enum ItemMenuEventType {
  INSERT_ITEM_CLICKED = 'ItemMenuComponent.Event.InsertItemClicked',
  UPDATE_ITEM_CLICKED = 'ItemMenuComponent.Event.UpdateItemClicked',
  REMOVE_ITEM_CLICKED = 'ItemMenuComponent.Event.RemoveItemClicked',
}


@Component({
  selector: 'emp-fa-item-menu',
  templateUrl: './item-menu.component.html',
})
export class ItemMenuComponent {

  @Input() isSelected = false;

  @Input() itemType: 'row' | 'column' = 'row';

  @Input() canEdit = false;

  @Output() itemMenuEvent = new EventEmitter<EventInfo>();


  get displayMenu(): boolean {
    return this.canEdit && this.isSelected;
  }


  onInsertItemClicked() {
    sendEvent(this.itemMenuEvent, ItemMenuEventType.INSERT_ITEM_CLICKED);
  }


  onUpdateItemClicked() {
    sendEvent(this.itemMenuEvent, ItemMenuEventType.UPDATE_ITEM_CLICKED);
  }


  onRemoveItemClicked() {
    sendEvent(this.itemMenuEvent, ItemMenuEventType.REMOVE_ITEM_CLICKED);
  }

}
