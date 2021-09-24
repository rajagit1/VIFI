import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserdetailsPopupPageRoutingModule } from './userdetails-popup-routing.module';

import { UserdetailsPopupPage } from './userdetails-popup.page';
import { ActordetailsPopupPage } from '../actordetails-popup/actordetails-popup.page';
import { UserdetailschildPopupPage } from '../userdetailschild-popup/userdetailschild-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserdetailsPopupPageRoutingModule
  ],
  //declarations: [UserdetailschildPopupPage],
 // entryComponents: [
 //   UserdetailschildPopupPage
 // ]
})
export class UserdetailsPopupPageModule {}
