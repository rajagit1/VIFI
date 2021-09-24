import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActorAddPageRoutingModule } from './actor-add-routing.module';

import { ActorAddPage } from './actor-add.page';
import { DragulaModule } from 'ng2-dragula';
import { ActordetailsPopupPage } from '../../pages/actordetails-popup/actordetails-popup.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActorAddPageRoutingModule,
    DragulaModule
  ],
  declarations: [ActorAddPage,ActordetailsPopupPage],
  entryComponents:[ActordetailsPopupPage]
})
export class ActorAddPageModule {}
