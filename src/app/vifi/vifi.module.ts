import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { VifiNotifyPage } from './vifi-notify.page';
import { VifiNotifyPageRoutingModule } from './vifi-notify-routing.module';
//image cropping
import { ImageCropperModule } from 'ngx-image-cropper';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VifiNotifyPageRoutingModule,
    ImageCropperModule
  ],
  declarations: [VifiNotifyPage]
})
export class VifiNotifyPageModule {}
