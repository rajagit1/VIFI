import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActordetailsPopupPageRoutingModule } from './actordetails-popup-routing.module';

import { ActordetailsPopupPage } from './actordetails-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActordetailsPopupPageRoutingModule
  ],
 // declarations: [ActordetailsPopupPage]
})
export class ActordetailsPopupPageModule {}
