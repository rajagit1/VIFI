import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
 
import { IonRouterOutlet, MenuController, Platform, ToastController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
//import { Plugins } from '@capacitor/core';
//const { App } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Daily Activities',
      url: '/daily-activities',
      icon: 'trending-up'

    },
    {
      title: 'Trending',
      url: '/app/tabs/schedule',
      icon: 'trending-up'

    },
    {
      title: 'Category',
      url: '/app/tabs/speakers',
      icon: 'folder-open'

    },
    {
      title: 'Favorites',
      url: '/app/tabs/map',
      icon: 'images'

    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information'
    }
  ];
  loggedIn = false;
  dark = false;
  disconnectSubscription: any;
  connectSubscription: any;
  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;
  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: LottieSplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private network: Network,
    private fcm: FCM

  ) {
    this.initializeApp();
    /**this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    }); **/
  }
  async ngOnDestroy(){
    this.disconnectSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
  }
  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'middle',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
    // watch network for a disconnection
    this.disconnectSubscription = this.network.onDisconnect().subscribe(async () => {
      console.log('disconnected');
      const toast =  this.toastCtrl.create({
        message: 'It seems you are offline..!',
        position: 'middle',
        buttons: [
          {
            role: 'cancel',
            text: 'close'
          }
        ]
      });

       (await toast).present();
    });

    
  


    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(async () => {
      console.log('connected');
      const toast =  this.toastCtrl.create({
        message: 'You back to Online..!',
        position: 'middle',
        buttons: [
          {
            role: 'cancel',
            text: 'close'
          }
        ]
      });

       (await toast).present();
      
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          const toast =  this.toastCtrl.create({
            message: 'Got Wifi Connection..!',
            position: 'middle',
            buttons: [
              {
                role: 'cancel',
                text: 'close'
              }
            ]
          });
        }
      }, 3000);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();

      setTimeout(() => {
        this.splashScreen.hide();
      }, 2500);
      /***PUSH NOTIFICATION CODE STARTS HERE*/
      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        // Register your new token in your back-end if you want
        // backend.registerToken(token);
      });
      /***PUSH NOTIFICATION CODE ENDS HERE*/
    });
  
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        navigator['app'].exitApp();
      }
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  openTutorial() {

  }

  /***PUSH NOTIFICATION FUNCTION*/
  subscribeToTopic() {
    this.fcm.subscribeToTopic('enappd');
  }

  /***PUSH NOTIFICATION FUNCTION*/
  getToken() {
    this.fcm.getToken().then(token => {
      console.log('firebase push notification token', token);
      // Register your new token in your back-end if you want
      // backend.registerToken(token);
    });
  }

  /***PUSH NOTIFICATION FUNCTION*/
  unsubscribeFromTopic() {
    this.fcm.unsubscribeFromTopic('enappd');
  }
}
