import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordPage } from './forgotpassword';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordRoutingModule
  ],
  declarations: [
    ForgotPasswordPage,
  ]
})
export class ForgotPasswordModule { }
