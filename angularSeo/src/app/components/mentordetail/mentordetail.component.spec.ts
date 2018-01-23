import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentordetailComponent } from './mentordetail.component';

describe('MentordetailComponent', () => {
  let component: MentordetailComponent;
  let fixture: ComponentFixture<MentordetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentordetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentordetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
