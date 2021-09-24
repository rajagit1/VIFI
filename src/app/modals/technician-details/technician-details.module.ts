import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TechnicianDetailsPageRoutingModule } from './technician-details-routing.module';

import { TechnicianDetailsPage } from './technician-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TechnicianDetailsPageRoutingModule
  ],
  declarations: [TechnicianDetailsPage],  
  entryComponents: [TechnicianDetailsPage]
})
export class TechnicianDetailsPageModule {}
