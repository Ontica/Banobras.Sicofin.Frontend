import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsChartFilterComponent } from './accounts-chart-filter.component';

describe('AccountsChartFilterComponent', () => {
  let component: AccountsChartFilterComponent;
  let fixture: ComponentFixture<AccountsChartFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsChartFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsChartFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
