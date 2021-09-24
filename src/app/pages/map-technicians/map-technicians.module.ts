import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
//image cropping
import { ImageCropperModule } from 'ngx-image-cropper';
import { MapTechniciansRoutingModule } from './MapTechniciansRoutingModule';
import { MapTechniciansComponent } from './map-technicians.component';
import { ActorAddPageModule } from '../../modals/actor-add/actor-add.module';
import { ActorDetailsPageModule } from '../actor-details/actor-details.module';
import { TechnicianDetailsPageModule } from '../../modals/technician-details/technician-details.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapTechniciansRoutingModule,
    ActorAddPageModule,    
    TechnicianDetailsPageModule
  ],
  declarations: [MapTechniciansComponent]
})
export class MapTechniciansPageModule {}
