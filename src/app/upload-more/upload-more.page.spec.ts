import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadMorePage } from './upload-more.page';

describe('UploadMorePage', () => {
  let component: UploadMorePage;
  let fixture: ComponentFixture<UploadMorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadMorePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadMorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
