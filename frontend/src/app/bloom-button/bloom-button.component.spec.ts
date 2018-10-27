import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloomButtonComponent } from './bloom-button.component';

describe('BloomButtonComponent', () => {
  let component: BloomButtonComponent;
  let fixture: ComponentFixture<BloomButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloomButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloomButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
