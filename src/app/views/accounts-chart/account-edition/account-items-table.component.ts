/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { AccountItem } from '@app/models';

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
      max-height: 365px;
      margin-right: 8px;
    }

    .column-checkbox {
      padding-top: 4px;
      padding-bottom: 4px;
    }
  `],
})
export class AccountItemsTableComponent implements OnChanges, OnInit, OnDestroy {

  @Input() dataList: AccountItem[] = [];

  @Input() selectedList: AccountItem[] = [];

  @Input() disabledList: AccountItem[] = [];

  @Input() itemType: 'currencies' | 'sectors' | 'roles' = 'currencies';

  @Input() deletingMode = false;

  @Input() selectionRequired = true;

  @Input() applicationDateRequired = false;

  @Output() accountItemsTableEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = AccountItemsTableFormControls;

  displayedColumnsDefault: string[] = ['selection', 'fullName'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<AccountItem>;

  selection = new SelectionModel<string>(true, []);

  dataDisplayedUIDList: string[] = [];

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges() {
    setTimeout(() => {
      this.setFormData();
      this.setDataTable();
      this.setSelectionData();
    });
  }


  ngOnInit() {
    this.suscribeToDataChanges();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get hasItems() {
    return !!this.dataSource || this.dataSource?.data.length > 0
  }


  get hasDisabledItems() {
    return this.disabledList.length > 0;
  }


  validateCheckAllChanged(selection) {
    this.selection = selection;

    if(!this.deletingMode && this.hasDisabledItems) {
      this.disabledList.forEach(x => this.selection.deselect(x.uid));
      this.selectedList.forEach(x => this.selection.select(x.uid));
    }
  }


  showDisabled(uid): boolean {
    if(this.deletingMode) {
      return false;
    }

    return this.disabledList.map(x => x.uid).includes(uid);
  }


  invalidateForm() {
    this.formHandler.invalidateForm();
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


  private setFormData() {
    this.formHandler.form.reset({
      items: this.deletingMode ? [] : this.selectedList.map(x => x.uid),
    });
    this.validateRequiredFormFields();
  }


  private validateRequiredFormFields() {
    if (this.selectionRequired) {
      const minLength = this.deletingMode || !this.hasDisabledItems ? 1 : this.selectedList.length + 1;
      this.formHandler.setControlValidators(this.controls.items, [Validators.required, Validators.minLength(minLength)]);
    } else {
      this.formHandler.clearControlValidators(this.controls.items);
    }

    if(this.applicationDateRequired) {
      this.formHandler.setControlValidators(this.controls.applicationDate, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.applicationDate);
    }
  }


  private setDataTable() {
    this.setDisplayedColumns();

    if (this.deletingMode) {
      this.dataSource = new MatTableDataSource(this.selectedList ?? []);
    } else {
      const dataListWithSavedData = this.getDataListWithSavedData();
      this.dataSource = new MatTableDataSource(dataListWithSavedData ?? []);
    }

    this.dataDisplayedUIDList = this.dataSource.data.map(x => x.uid);
  }


  private setSelectionData() {
    this.selection.clear();

    if (!this.deletingMode) {
      this.dataDisplayedUIDList.forEach(x => {
        if (this.selectedList.map(y => y.uid).includes(x)) {
          this.selection.select(x);
        }
      });
    }
  }


  private getDataListWithSavedData(): any[] {
    return this.dataList.map(x => {
        if (this.selectedList.map(y => y.uid).includes(x.uid)) {
          return this.selectedList.find(z => z.uid === x.uid);
        }
        return x;
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

    const payload = {
      isFormValid: this.formHandler.form.valid,
      applicationDate: formModel.applicationDate ?? '',
      items: formModel.items ?? [],
    };

    sendEvent(this.accountItemsTableEvent, AccountItemsTableEventType.FORM_CHANGED, payload);
  }

}
