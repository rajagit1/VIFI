import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateActorPageRoutingModule } from './create-actor-routing.module';

import { CreateActorPage } from './create-actor.page';
//image cropping
import { ImageCropperModule } from 'ngx-image-cropper';
import { UploadMorePageModule } from '../../upload-more/upload-more.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ImageCropperModule,
    CreateActorPageRoutingModule,
    UploadMorePageModule
  ],
  declarations: [CreateActorPage]
})
export class CreateActorPageModule {}
