import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterListPage } from './filter-list.page';

describe('FilterListPage', () => {
  let component: FilterListPage;
  let fixture: ComponentFixture<FilterListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
