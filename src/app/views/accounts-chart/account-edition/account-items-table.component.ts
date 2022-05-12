/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FormHandler, sendEvent } from '@app/shared/utils';

export enum AccountItemsTableEventType {
  FORM_CHANGED = 'AccountItemsTableComponent.Event.FormChanged',
}

enum AccountItemsTableFormControls {
  applicationDate = 'applicationDate',
  items = 'items',
}

@Component({
  selector: 'emp-fa-account-items-table',
  templateUrl: './account-items-table.component.html',
  styles: [`
    .table-container {
      max-height: 420px;
    }
  `],
})
export class AccountItemsTableComponent implements OnChanges, OnInit, OnDestroy {

  @Input() dataList: any[] = [];

  @Input() selectedList: string[] = [];

  @Input() itemType: 'currencies' | 'sectors' = 'currencies';

  @Input() selectionType: 'add' | 'delete' = 'add';

  @Input() selectionRequired = true;

  @Output() accountItemsTableEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = AccountItemsTableFormControls;

  displayedColumnsDefault: string[] = ['selection', 'fullName'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<any>;

  selection = new SelectionModel<any>(true, []);

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      if (changes.dataList || changes.itemType) {
        this.setFormModel();
        this.clearSelection();
        this.setDataTableData();
      }
    });
  }


  ngOnInit() {
    this.suscribeToDataChanges();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  clearSelection() {
    this.selection.clear();
  }


  get roleRequired(): boolean {
    return this.itemType === 'sectors' && this.selectionType !== 'delete';
  }


  get hasEntries() {
    return !!this.dataSource || this.dataSource?.data.length > 0
  }


  get dataForCheckList(): string[] {
    return this.dataList.map(x => x.uid);
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        applicationDate: new FormControl(''),
        items: new FormControl([], [Validators.required, Validators.minLength(1)]),
      })
    );
  }


  private suscribeToDataChanges() {
    this.formHandler.form.valueChanges.subscribe(x => this.emitChanges());

    this.selection.changed.subscribe(x =>
      this.formHandler.getControl(this.controls.items).reset(this.selection.selected)
    );
  }


  private setFormModel() {
    this.formHandler.form.reset({
      applicationDate: '',
      items: [],
    });
    this.validateRequiredFormFields();
  }


  private validateRequiredFormFields() {
    if (this.selectionRequired) {
      this.formHandler.setControlValidators(this.controls.items, [Validators.required, Validators.minLength(1)]);
    } else {
      this.formHandler.clearControlValidators(this.controls.items);
    }
  }


  private setDataTableData() {
    this.setDisplayedColumns();
    this.dataSource = new MatTableDataSource(this.dataList ?? []);
  }


  private setDisplayedColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.selectionType !== 'add') {
      if (this.itemType === 'sectors') {
        this.displayedColumns.push('role');
      }

      this.displayedColumns.push('startDate');
      this.displayedColumns.push('endDate');
    }
  }


  private emitChanges() {
    const formModel = this.formHandler.form.getRawValue();

    const payload = {
      isFormValid: this.formHandler.form.valid,
      applicationDate: formModel.applicationDate ?? '',
      items: formModel.items ?? [],
    };

    sendEvent(this.accountItemsTableEvent, AccountItemsTableEventType.FORM_CHANGED, payload);
  }

}
