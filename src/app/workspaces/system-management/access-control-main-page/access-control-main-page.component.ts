/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { EmptyAccessControlSelectionData, AccessControlSelectionData } from '@app/models';

import {
  AccessControlTabbedViewEventType
} from '@app/views/_access-control/access-control-tabbed-view/access-control-tabbed-view.component';

import {
  AccessControlViewerEventType
} from '@app/views/_access-control/access-control-viewer/access-control-viewer.component';

@Component({
  selector: 'emp-ng-access-control-main-page',
  templateUrl: './access-control-main-page.component.html',
})
export class AccessControlMainPageComponent {

  displayTabbedView = false;

  selectedData: AccessControlSelectionData = EmptyAccessControlSelectionData;

  onAccessControlViewerEvent(event: EventInfo) {
    switch (event.type as AccessControlViewerEventType) {

      case AccessControlViewerEventType.ITEM_SELECTED:
        Assertion.assertValue(event.payload, 'event.payload');
        this.setSelectedData(event.payload as AccessControlSelectionData);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccessControlTabbedViewEvent(event: EventInfo) {
    switch (event.type as AccessControlTabbedViewEventType) {

      case AccessControlTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyAccessControlSelectionData);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setSelectedData(data: AccessControlSelectionData) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.item);
  }

}
