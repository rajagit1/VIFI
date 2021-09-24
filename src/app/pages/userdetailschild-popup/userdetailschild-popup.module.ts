import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserdetailschildPopupPageRoutingModule } from './userdetailschild-popup-routing.module';

import { UserdetailschildPopupPage } from './userdetailschild-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserdetailschildPopupPageRoutingModule
  ],
 // declarations: [UserdetailschildPopupPage]
})
export class UserdetailschildPopupPageModule {}
