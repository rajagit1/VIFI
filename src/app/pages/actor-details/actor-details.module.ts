import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActorDetailsPageRoutingModule } from './actor-details-routing.module';

import { ActorDetailsPage } from './actor-details.page';
import { UserdetailsPopupPage } from '../userdetails-popup/userdetails-popup.page';
import { ActordetailsPopupPage } from '../actordetails-popup/actordetails-popup.page';
import { UserdetailschildPopupPage } from '../userdetailschild-popup/userdetailschild-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActorDetailsPageRoutingModule
  ],
  declarations: [ActorDetailsPage,UserdetailsPopupPage,UserdetailschildPopupPage],
  entryComponents:[UserdetailsPopupPage,UserdetailschildPopupPage]
})
export class ActorDetailsPageModule {}
