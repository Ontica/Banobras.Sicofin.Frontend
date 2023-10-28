/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapsCoberturaEntryHeaderComponent } from './swaps-cobertura-entry-header.component';

describe('SwapsCoberturaEntryHeaderComponent', () => {
  let component: SwapsCoberturaEntryHeaderComponent;
  let fixture: ComponentFixture<SwapsCoberturaEntryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwapsCoberturaEntryHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwapsCoberturaEntryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
