import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdManagementPage } from './ad-management.page';

describe('AdManagementPage', () => {
  let component: AdManagementPage;
  let fixture: ComponentFixture<AdManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdManagementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
