import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterActordetailsPageRoutingModule } from './filter-actordetails-routing.module';

import { FilterActordetailsPage } from './filter-actordetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterActordetailsPageRoutingModule
  ],
  //declarations: [FilterActordetailsPage]
})
export class FilterActordetailsPageModule {}
