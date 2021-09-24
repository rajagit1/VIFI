import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdManagementPageRoutingModule } from './ad-management-routing.module';

import { AdManagementPage } from './ad-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdManagementPageRoutingModule
  ],
  //declarations: [AdManagementPage]
})
export class AdManagementPageModule {}
