import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMentorsComponent } from './find-mentors.component';

describe('FindMentorsComponent', () => {
  let component: FindMentorsComponent;
  let fixture: ComponentFixture<FindMentorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindMentorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindMentorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
