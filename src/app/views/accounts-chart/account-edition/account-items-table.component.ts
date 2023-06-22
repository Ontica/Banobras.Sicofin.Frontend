/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { SelectionModel } from '@angular/cdk/collections';

import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { EventInfo, Validate } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { AccountItem } from '@app/models';

export enum AccountItemsTableEventType {
  FORM_CHANGED = 'AccountItemsTableComponent.Event.FormChanged',
}

interface AccountItemsFormModel extends FormGroup<{ items: FormControl<string[]> }> { }

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

  form: AccountItemsFormModel;

  formHelper = FormHelper;

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


  get hasItems(): boolean {
    return !!this.dataSource || this.dataSource?.data.length > 0
  }


  get isFormValid(): boolean {
    return !!this.form.valid;
  }


  validateCheckAllChanged(selection) {
    this.selection = selection;
  }


  invalidateForm() {
    this.formHelper.markFormControlsAsTouched(this.form);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      items: [[] as string[], [Validators.required, Validators.minLength(1)]],
    });
  }


  private suscribeToDataChanges() {
    this.selection.changed.subscribe(x => this.form.controls.items.reset(this.selection.selected));
    this.form.valueChanges.subscribe(x => this.emitChanges());
  }


  private setFormData() {
    this.form.reset({items: this.selectedList.map(x => x.uid)});
    this.validateItemsFieldValidators();
  }


  private validateItemsFieldValidators() {
    if (this.selectionRequired) {
      const initialSelection = this.selectedList.map(x => x.uid);
      const validators = this.changeSelectionRequired ?
        [Validators.required, Validators.minLength(1), Validate.changeRequired(initialSelection)] :
        [Validators.required, Validators.minLength(1)];

      this.formHelper.setControlValidators(this.form.controls.items, validators);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.items);
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
    const formModel = this.form.getRawValue();
    const payload = {items: formModel.items ?? []};
    sendEvent(this.accountItemsTableEvent, AccountItemsTableEventType.FORM_CHANGED, payload);
  }

}
