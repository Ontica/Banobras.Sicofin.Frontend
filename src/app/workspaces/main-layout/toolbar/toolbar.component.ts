/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { PresentationState } from '@app/core/presentation';

import { MainUIStateAction, MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { TOOL } from '../config-data';

import { PermissionsLibrary } from '@app/models';


@Component({
  selector: 'emp-ng-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  permissions = PermissionsLibrary;

  displayAsideRight = false;

  toolSelected: TOOL = 'None';

  private unsubscribe: Subject<void> = new Subject();

  constructor(private store: PresentationState) {}

  ngOnInit(): void {
    this.store.select<TOOL>(MainUIStateSelector.TOOL_SELECTED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => this.setToolSelected(x));
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  onCloseAsideRight(tool: TOOL) {
    this.store.dispatch(MainUIStateAction.SET_TOOL_SELECTED, tool);
  }


  private setToolSelected(tool: TOOL) {
    this.toolSelected = tool;
    this.displayAsideRight = this.toolSelected !== 'None';
  }

}
