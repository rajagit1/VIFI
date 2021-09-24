import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserdetailsPopupPage } from './userdetails-popup.page';

describe('UserdetailsPopupPage', () => {
  let component: UserdetailsPopupPage;
  let fixture: ComponentFixture<UserdetailsPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserdetailsPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserdetailsPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
