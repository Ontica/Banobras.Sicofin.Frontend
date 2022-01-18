/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceReconciliationMainPageComponent } from './balance-reconciliation-main-page.component';

describe('BalanceReconciliationMainPageComponent', () => {
  let component: BalanceReconciliationMainPageComponent;
  let fixture: ComponentFixture<BalanceReconciliationMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceReconciliationMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceReconciliationMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
