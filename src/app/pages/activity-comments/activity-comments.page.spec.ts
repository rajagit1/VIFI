import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivityCommentsPage } from './activity-comments.page';

describe('ActivityCommentsPage', () => {
  let component: ActivityCommentsPage;
  let fixture: ComponentFixture<ActivityCommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCommentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityCommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
