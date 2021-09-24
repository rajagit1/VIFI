import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActordetailsPopupPage } from './actordetails-popup.page';

describe('ActordetailsPopupPage', () => {
  let component: ActordetailsPopupPage;
  let fixture: ComponentFixture<ActordetailsPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActordetailsPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActordetailsPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
