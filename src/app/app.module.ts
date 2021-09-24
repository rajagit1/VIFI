import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule, AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { FireBaseService } from './services/firebase.service';
import {
  AngularFireFunctionsModule
} from '@angular/fire/functions';
//import { ShortNumberPipe } from './pipes/short-number.pipe';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { DragulaModule } from 'ng2-dragula';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Network } from '@ionic-native/network/ngx';
import { TitleCasePipe } from '@angular/common';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
//image cropping
import { ImageCropperModule } from 'ngx-image-cropper';

import {File} from "@ionic-native/file/ngx";
import {Media} from "@ionic-native/media/ngx";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
 
 

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,     
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule ,
    DragulaModule.forRoot(),
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AngularFirestoreModule,
    //mage crop
    ImageCropperModule,
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  declarations: [AppComponent],
  providers: [InAppBrowser,SplashScreen,AdMobFree,LocalNotifications,YoutubeVideoPlayer, TitleCasePipe,StatusBar, 
    LottieSplashScreen, FireBaseService,CallNumber,Network,AngularFirestoreModule,File,Media,SocialSharing],
  bootstrap: [AppComponent]
})
export class AppModule {

}
