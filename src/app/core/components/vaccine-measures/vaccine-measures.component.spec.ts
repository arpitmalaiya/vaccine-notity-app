import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccineMeasuresComponent } from './vaccine-measures.component';

describe('VaccineMeasuresComponent', () => {
  let component: VaccineMeasuresComponent;
  let fixture: ComponentFixture<VaccineMeasuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaccineMeasuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccineMeasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
