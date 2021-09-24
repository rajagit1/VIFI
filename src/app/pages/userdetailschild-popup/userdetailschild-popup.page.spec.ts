import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserdetailschildPopupPage } from './userdetailschild-popup.page';

describe('UserdetailschildPopupPage', () => {
  let component: UserdetailschildPopupPage;
  let fixture: ComponentFixture<UserdetailschildPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserdetailschildPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserdetailschildPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
