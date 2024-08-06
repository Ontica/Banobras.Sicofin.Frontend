/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubledgerAccountBalanceFilterComponent } from './subledger-account-balance-filter.component';


describe('SubledgerAccountBalanceFilterComponent', () => {
  let component: SubledgerAccountBalanceFilterComponent;
  let fixture: ComponentFixture<SubledgerAccountBalanceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubledgerAccountBalanceFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubledgerAccountBalanceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
