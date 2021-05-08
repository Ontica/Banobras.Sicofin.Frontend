/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import {
  Component, ContentChild, TemplateRef, ViewChild, EventEmitter, forwardRef,
  Input, Output, OnInit, OnChanges, OnDestroy, SimpleChanges
} from '@angular/core';

import { Subject } from 'rxjs';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DropdownPosition, NgSelectComponent } from '@ng-select/ng-select';


export interface SelectBoxConfig {
  addTag?: boolean;
  addTagText?: string;
  appendTo?: string;
  autoSelect?: boolean;
  bindByValue?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  dropdownPosition?: DropdownPosition;
  groupBy?: string;
  hideSelected?: boolean;
  minTermLength?: number;
  multiple?: boolean;
  notFoundText?: string;
  searchable?: boolean;
  selectFirst?: boolean;
  typeToSearchText?: string;
  virtualScroll?: boolean;
}


const DefaultSelectBoxConfig: SelectBoxConfig = {
  addTag: false,
  addTagText: 'Agregar Item',
  appendTo: 'body',
  autoSelect: false,
  bindByValue: true,
  clearable: false,
  closeOnSelect: true,
  dropdownPosition: 'auto',
  groupBy: null,
  hideSelected: false,
  minTermLength: 5,
  multiple: false,
  notFoundText: 'No se encontraron registros',
  searchable: true,
  selectFirst: false,
  typeToSearchText: 'Por favor ingrese 5 o mas caracteres',
  virtualScroll: false,
};


@Component({
  selector: 'emp-ng-select',
  templateUrl: './select-box.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectBoxComponent),
      multi: true
    }
  ]
})
export class SelectBoxComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @ViewChild(NgSelectComponent) select: NgSelectComponent;

  @ContentChild('labelTemplate', { read: TemplateRef }) labelTemplate: TemplateRef<any>;
  @ContentChild('groupTemplate', { read: TemplateRef }) groupTemplate: TemplateRef<any>;
  @ContentChild('optionTemplate', { read: TemplateRef }) optionTemplate: TemplateRef<any>;

  @Input() items: any[];
  @Input() bindLabel = 'name';
  @Input() bindValue = 'uid';
  @Input() placeholder = 'Seleccionar';

  @Input() loading = false;
  @Input() typeahead: Subject<string>;
  @Input() showError = false;

  @Input()
  get config() {
    return this.selectBoxConfig;
  }
  set config(value: SelectBoxConfig) {
    this.selectBoxConfig = Object.assign({}, DefaultSelectBoxConfig, value);
  }

  @Output() clear = new EventEmitter<boolean>();
  @Output() changes = new EventEmitter<any>();
  @Output() search = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();

  selectBoxConfig = DefaultSelectBoxConfig;

  onChange: (value: any) => void;
  onTouched: (event: any) => void;

  disabled: boolean;
  value: any = null;

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll, true);
    window.addEventListener('resize', this.onResize, true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      if (this.selectBoxConfig.autoSelect) {
        this.selectItemIfUnique();
      }
      if (this.selectBoxConfig.selectFirst) {
        this.selectFirstItem();
      }
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll, true);
    window.removeEventListener('resize', this.onResize, true);
  }

  writeValue(value: any): void {
    this.value = value ? value : null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChangedEvent(event) {
    let value = event;

    if (Array.isArray(event)) {
      value = event.map(item => this.selectBoxConfig.bindByValue && this.bindValue ?
                                item[this.bindValue] : item);
    } else if (event) {
      value = this.selectBoxConfig.bindByValue && this.bindValue ? event[this.bindValue] : event;
    }

    this.onChange(value);
    this.changes.emit(event);
  }

  onClear() {
    this.clear.emit(true);
  }

  clearModel() {
    this.select.clearModel();
  }

  onSearch(event) {
    this.search.emit(event);
  }

  onBlur(event) {
    this.blur.emit(event);
  }

  private selectItemIfUnique() {
    if (this.items.length !== 1 || this.value !== null) {
      return;
    }

    this.selectFirstItem();
  }

  private selectFirstItem() {
    setTimeout(() => {
      this.onChangedEvent(this.items[0]);
      this.writeValue(this.selectBoxConfig.bindByValue && this.bindValue ?
                      this.items[0][this.bindValue] : this.items[0]);
    }, 100);
  }

  private onResize = (event: any) => {
    if (this.select && this.select.isOpen) {
      this.select.close();
    }
  }

  private onScroll = (event: any) => {
    const autoscroll = event.srcElement.classList.contains('ng-dropdown-panel-items');

    const inputOverflow = event.srcElement.offsetParent.classList.contains('ng-input');

    if (this.select && this.select.isOpen && !autoscroll && !inputOverflow) {
      this.select.close();
    }
  }

}
