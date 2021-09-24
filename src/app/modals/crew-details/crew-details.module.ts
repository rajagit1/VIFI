import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrewDetailsPageRoutingModule } from './crew-details-routing.module';

import { CrewDetailsPage } from './crew-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrewDetailsPageRoutingModule
  ],
  declarations: [CrewDetailsPage]
})
export class CrewDetailsPageModule {}
