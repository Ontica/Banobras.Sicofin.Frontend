/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedUpBalancesModalComponent } from './locked-up-balances-modal.component';

describe('LockedUpBalancesModalComponent', () => {
  let component: LockedUpBalancesModalComponent;
  let fixture: ComponentFixture<LockedUpBalancesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockedUpBalancesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockedUpBalancesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
