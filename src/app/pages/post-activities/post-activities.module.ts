import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostActivitiesPageRoutingModule } from './post-activities-routing.module';

import { PostActivitiesPage } from './post-activities.page';

//image cropping
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostActivitiesPageRoutingModule,
    ImageCropperModule
  ],
  declarations: [PostActivitiesPage]
})
export class PostActivitiesPageModule {}
