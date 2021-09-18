/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  FinancialReportBreakdownTabbedViewComponent
 } from './financial-report-breakdown-tabbed-view.component';

describe('FinancialReportBreakdownTabbedViewComponent', () => {
  let component: FinancialReportBreakdownTabbedViewComponent;
  let fixture: ComponentFixture<FinancialReportBreakdownTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialReportBreakdownTabbedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialReportBreakdownTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
