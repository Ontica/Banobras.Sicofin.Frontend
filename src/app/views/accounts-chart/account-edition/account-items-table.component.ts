/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo, Validate } from '@app/core';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { AccountItem } from '@app/models';

export enum AccountItemsTableEventType {
  FORM_CHANGED = 'AccountItemsTableComponent.Event.FormChanged',
}

enum AccountItemsTableFormControls {
  items = 'items',
}

@Component({
  selector: 'emp-fa-account-items-table',
  templateUrl: './account-items-table.component.html',
  styles: [`
    .table-container {
      max-height: 365px;
      margin-right: 8px;
    }

    .column-checkbox {
      padding-top: 4px;
      padding-bottom: 4px;
    }
  `],
})
export class AccountItemsTableComponent implements OnChanges, OnInit {

  @Input() dataList: AccountItem[] = [];

  @Input() selectedList: AccountItem[] = [];

  @Input() itemType: 'currencies' | 'sectors' | 'roles' = 'currencies';

  @Input() selectionDisabled = false;

  @Input() selectionRequired = true;

  @Input() changeSelectionRequired = false;

  @Output() accountItemsTableEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = AccountItemsTableFormControls;

  displayedColumnsDefault: string[] = ['selection', 'fullName'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<AccountItem>;

  selection = new SelectionModel<string>(true, []);

  dataDisplayedUIDList: string[] = [];


  constructor() {
    this.initForm();
  }


  ngOnChanges() {
    setTimeout(() => {
      this.setFormData();
      this.setDisplayedColumns();
      this.setDataTable();
      this.setSelectionData();
    });
  }


  ngOnInit() {
    this.suscribeToDataChanges();
  }


  get hasItems() {
    return !!this.dataSource || this.dataSource?.data.length > 0
  }


  validateCheckAllChanged(selection) {
    this.selection = selection;
  }


  invalidateForm() {
    this.formHandler.invalidateForm();
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new UntypedFormGroup({items: new UntypedFormControl([], [Validators.required, Validators.minLength(1)])})
    );
  }


  private suscribeToDataChanges() {
    this.selection.changed.subscribe(x =>
      this.formHandler.getControl(this.controls.items).reset(this.selection.selected)
    );
    this.formHandler.form.valueChanges.subscribe(x =>
      this.emitChanges()
    );
  }


  private setFormData() {
    this.formHandler.form.reset({items: this.selectedList.map(x => x.uid)});
    this.validateItemsFieldValidators();
  }


  private validateItemsFieldValidators() {
    if (this.selectionRequired) {
        const initialSelection = this.selectedList.map(x => x.uid);
        const validators = this.changeSelectionRequired ?
          [Validators.required, Validators.minLength(1), Validate.changeRequired(initialSelection)] :
          [Validators.required, Validators.minLength(1)];

        this.formHandler.setControlValidators(this.controls.items, validators);
    } else {
      this.formHandler.clearControlValidators(this.controls.items);
    }
  }


  private setDataTable() {
    const data = this.selectedList.length === 0 ? this.dataList :
      this.dataList.map(x => this.selectedList.find(y => y.uid === x.uid) ?? x);

    this.dataSource = new MatTableDataSource(data ?? []);

    this.dataDisplayedUIDList = this.dataSource.data.map(x => x.uid);
  }


  private setSelectionData() {
    this.selection.clear();

    this.selectedList.forEach(x => {
      if (this.dataDisplayedUIDList.includes(x.uid)) {
        this.selection.select(x.uid);
      }
    });
  }


  private setDisplayedColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.selectedList.length > 0) {
      if (this.itemType === 'sectors') {
        this.displayedColumns.push('role');
      }

      if (this.itemType !== 'roles') {
        this.displayedColumns.push('startDate');
        this.displayedColumns.push('endDate');
      }
    }
  }


  private emitChanges() {
    const formModel = this.formHandler.form.getRawValue();
    const payload = {items: formModel.items ?? []};
    sendEvent(this.accountItemsTableEvent, AccountItemsTableEventType.FORM_CHANGED, payload);
  }

}
