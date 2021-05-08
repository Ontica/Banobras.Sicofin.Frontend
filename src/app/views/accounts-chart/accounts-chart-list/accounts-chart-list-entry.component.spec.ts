import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsChartListEntryComponent } from './accounts-chart-list-entry.component';

describe('AccountsChartListEntryComponent', () => {
  let component: AccountsChartListEntryComponent;
  let fixture: ComponentFixture<AccountsChartListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsChartListEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsChartListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
