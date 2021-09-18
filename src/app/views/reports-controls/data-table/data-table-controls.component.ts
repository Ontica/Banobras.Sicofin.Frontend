/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

export enum DataTableControlsEventType {
  FILTER_CHANGED        = 'DataTableControlsComponent.Event.FilterChanged',
  EXPORT_BUTTON_CLICKED = 'DataTableControlsComponent.Event.ExportButtonClicked',
}

@Component({
  selector: 'emp-fa-data-table-controls',
  templateUrl: './data-table-controls.component.html',
  styles: [`
    .controls-container {
      padding: 5px;
      margin: 3px;
    }

    .controls-container-aligned {
      padding-bottom: 5px;
      margin-bottom: 3px;
    }`
  ],
})
export class DataTableControlsComponent {

  @Input() filter = '';

  @Input() showExportButton = true;

  @Input() controlsAligned = false;

  @Output() dataTableControlsEvent = new EventEmitter<EventInfo>();


  onClearFilter() {
    this.filter = '';
    this.onFilterData();
  }


  onFilterData() {
    sendEvent(this.dataTableControlsEvent, DataTableControlsEventType.FILTER_CHANGED,
      {filter: this.filter});
  }


  onExportButtonClicked() {
    sendEvent(this.dataTableControlsEvent, DataTableControlsEventType.EXPORT_BUTTON_CLICKED);
  }

}
