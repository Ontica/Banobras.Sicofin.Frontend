import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsChartComponent } from './accounts-chart.component';

describe('AccountsChartComponent', () => {
  let component: AccountsChartComponent;
  let fixture: ComponentFixture<AccountsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
