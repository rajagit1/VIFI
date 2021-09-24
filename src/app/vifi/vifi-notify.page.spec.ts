import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { VifiNotifyPage } from './vifi-notify.page';


describe('VifiNotifyPage', () => {
  let component: VifiNotifyPage;
  let fixture: ComponentFixture<VifiNotifyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VifiNotifyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VifiNotifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
