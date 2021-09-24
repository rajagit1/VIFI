import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ProdDirectDetailsPageRoutingModule } from './prod-direct-details-routing.module';
import { ProdDirectDetailsPage } from './prod-direct-details.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdDirectDetailsPageRoutingModule
  ],
  declarations: [ProdDirectDetailsPage]
})
export class ProdDirectDetailsPageModule {}
