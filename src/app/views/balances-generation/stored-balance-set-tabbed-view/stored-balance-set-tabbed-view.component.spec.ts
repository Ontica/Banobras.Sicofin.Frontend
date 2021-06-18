/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoredBalanceSetTabbedViewComponent } from './stored-balance-set-tabbed-view.component';

describe('StoredBalanceSetTabbedViewComponent', () => {
  let component: StoredBalanceSetTabbedViewComponent;
  let fixture: ComponentFixture<StoredBalanceSetTabbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoredBalanceSetTabbedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredBalanceSetTabbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
