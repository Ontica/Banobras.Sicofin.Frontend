/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataImporterComponent } from './data-importer.component';

describe('VoucherEntriesImporterComponent', () => {
  let component: DataImporterComponent;
  let fixture: ComponentFixture<DataImporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataImporterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
