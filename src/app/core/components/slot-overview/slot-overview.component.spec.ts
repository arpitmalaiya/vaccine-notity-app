import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotOverviewComponent } from './slot-overview.component';

describe('SlotOverviewComponent', () => {
  let component: SlotOverviewComponent;
  let fixture: ComponentFixture<SlotOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
