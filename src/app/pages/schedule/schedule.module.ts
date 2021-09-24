import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShortNumberPipe } from '../../pipes/short-number.pipe';
import { SchedulePage } from './schedule';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { SchedulePageRoutingModule } from './schedule-routing.module';
import {LoginPopover} from './login-popup/login-popover';
import { ScrollVanishDirective } from '../../directives/scroll-vanish.directive';
import { FilterListPage } from '../filter-list/filter-list.page';
import { FilterActordetailsPage } from '../filter-actordetails/filter-actordetails.page';
//import { UserdetailschildPopupPage } from '../userdetailschild-popup/userdetailschild-popup.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulePageRoutingModule
  ],
  declarations: [
    SchedulePage,
    FilterListPage,
    ScheduleFilterPage,
    LoginPopover,
    ShortNumberPipe,
    ScrollVanishDirective,
    FilterActordetailsPage
  ],
  entryComponents: [
    FilterListPage,
    ScheduleFilterPage,
    LoginPopover,
    FilterActordetailsPage
  ]
})
export class ScheduleModule { }
