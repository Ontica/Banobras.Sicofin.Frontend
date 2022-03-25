/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy } from '@angular/core';

import { ActivationEnd, Router } from '@angular/router';

import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { PresentationState } from '@app/core/presentation';

import { MainUIStateAction, MainUIStateSelector } from '@app/core/presentation/presentation-types';

import { APP_CONFIG, TOOL } from './config-data';


@Component({
  selector: 'emp-ng-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnDestroy {

  appLayoutConfig = APP_CONFIG.layout;

  spinnerService = null;

  displayAsideLeft = false;

  displayAsideRight = false;

  toolSelected: TOOL = 'None';

  private unsubscribe: Subject<void> = new Subject();

  constructor(private store: PresentationState, private router: Router) {

    this.spinnerService = store.select<boolean>(MainUIStateSelector.IS_PROCESSING);

    store.select<TOOL>(MainUIStateSelector.TOOL_SELECTED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.toolSelected = x;
        this.displayAsideRight = this.toolSelected !== 'None';
      });

    this.router.events
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(val => {
        if (val instanceof ActivationEnd) {
          const url = this.router.routerState.snapshot.url.split(';')[0];
          store.dispatch(MainUIStateAction.SET_CURRENT_VIEW_FROM_URL, { url });
        }
      });
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  onCloseAsideRight() {
    this.store.dispatch(MainUIStateAction.SET_TOOL_SELECTED, 'None' as TOOL);
  }


  onAction(action: string) {

  }

}
