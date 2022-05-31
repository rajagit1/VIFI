import { AfterViewInit, Component, Input } from '@angular/core';


import { AlertController, IonRouterOutlet, LoadingController, ModalController, ToastController } from '@ionic/angular';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { Router,Event as NavigationEvent,NavigationStart } from '@angular/router';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { UserData } from '../../providers/user-data';
import { ConferenceData } from '../../providers/conference-data';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
//import { stat } from 'fs';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage {
  @Input() name: string;
  ios: boolean;
  username: string;
  speakers: any[] = [];
  generType: string = "actor";
  segment = "actor";
  posts: any[];
  mobNoRequested: boolean = false;
  dramaStories: any;
  comedyStories: any;
  duplicateClickCount:number=1;
  advStories: any;
  crimeStories: any;
  isLoaded: boolean = false;
  liked: boolean = false;
  showSearchbar: boolean=true;
  heartClass: string;
  defaultHref = '/app/tabs/schedule';  
  safeURLs =[];
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 5,
    autoplay: false,
    slideShadows: true,
    pager: false
  };
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    slideShadows: true,
    onlyExternal:true,
    pager: false
  };
  @ViewChild('slideWithNav',{static:false}) ionSlides: IonSlides;
  dummyData = [
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
  ]

  excludeTracks: any;
  users: any = [];
  maleActor: any = [];
  femaleActor: any = [];
  musicDirector:any=[];
  malesinger:any=[];
  femalesinger:any=[];
  queryText: string;
  isItemAvailable: boolean;
  items: any;
  notifyList: any = [];
  sliderOne: any;
  constructor(public confData: ConferenceData,public alertCtrl: AlertController,
    public router: Router, public routerOutlet: IonRouterOutlet,
    public userData: UserData, public modalController: ModalController,
    private callNumber: CallNumber,private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,public ngFireAuth: AngularFireAuth,
    public fireBaseService: FireBaseService, public _sanitizer: DomSanitizer) { 
    this.router.events
    .subscribe(
      (event: NavigationEvent) => {
        if (event instanceof NavigationStart) {
          
          this.queryText = '';
          this.showSearchbar = false;
          this.items = [];
          if(event.url === '/app/tabs/speakers'){
          }
        }
      });

      this.sliderOne =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 995
        },
        {
          id: 925
        },
        {
          id: 940
        },
        {
          id: 943
        },
        {
          id: 944
        }
      ]
    };
  }

  updatePicture() {
  }
  ionViewDidEnter() {
    this.showSearchbar = false;
    this.isLoaded = false;
    this.getUserName();
    this.getPosts();

    this.showSkeltonLoading();
    
  }
  useFilter(arg) {
    return this.users.filter(item => {
      return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
    });
  }
  setFilteredItems() {
    if (this.queryText != '') {
      this.isItemAvailable = true;
      this.items = this.useFilter(this.queryText);
      this.items = _.uniqBy(this.items,'actorName',this.items,'image');
      this.maleActor =  _.uniqBy(this.items,'actorName',this.items,'image');
      this.femaleActor =  _.uniqBy(this.items,'actorName',this.items,'image');
      this.musicDirector =  _.uniqBy(this.items,'actorName',this.items,'image');
      this.malesinger =  _.uniqBy(this.items,'actorName',this.items,'image');
      this.femalesinger =  _.uniqBy(this.items,'actorName',this.items,'image');
      this.items = [];
    } else {
      this.getPosts();
    }


  }
  getUserName() {
    this.userData.getUsername().then((username) => {
     // this.ngFireAuth.onAuthStateChanged((obj)=>{
        if(username){
            //this.username = obj.email.split('@')[0];
            this.username = username;
            this.getRequestedNotify(this.username);
        }else{
          this.loginCheck();
        }
      
    });
  }
  loginCheck() {
    if (_.isEmpty(this.username)) {
      this.router.navigateByUrl('/signUp');
      return false;
    } else {
      return true;
    }
  }
  changeCategory(ev) {
    this.generType = ev.detail.value;
    this.isLoaded = false;
    this.showSkeltonLoading();
  }

  showSkeltonLoading() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 400);
  }
  showStatus(actor) {

    //  <ion-label (click)="showdialer(actor)" style="color:white" *ngIf="actor.mobNoRequested === 'NR'">Contact</ion-label>
    // <ion-label style="color:white" *ngIf="actor.mobNoRequested === 'A'">actor.mobile</ion-label>
    // <ion-label style="color:white" *ngIf="actor.mobNoRequested === 'R'">Rejected. Contact VIFI Support Team</ion-label>
    // <ion-label style="color:white" *ngIf="actor.mobNoRequested === 'P'">Request Sent</ion-label>
    let retval = "Contact";
    this.notifyList.forEach(element => {
       if(actor.actorName === element.actorName && this.username.indexOf(element.requestedUserEmail)>=0){
        if (element.status === "A") {
           
          retval = actor.mobile;
           
  
        } else if (element.status === "R") {
          retval = "Rejected";
          
  
        } else if (element.status === "P" && element.notify_status === "A") {          
          retval = "Request Sent";           
        }
        else {
          retval = "Contact";
           
        }
      }
     

    });
    return retval;

  }
  getRequestedNotify(actor) {
    this.fireBaseService.getWhatappNoRequestedDetails(actor).subscribe((res: any) => {
      this.notifyList = res;
    });
  }
  numberOnlyValidation(modifiedBudget) {
    const pattern = /^[0-9]+$/;
    //let inputChar = String.fromCharCode(event.charCode);
    if (!modifiedBudget.match(pattern)) {      
      //event.preventDefault();
      return true;
    }
  }
  async getPosts() {

    this.users = [];
    this.posts = [];
    this.maleActor = [];
    this.femaleActor = [];
    this.malesinger =[];
    this.femalesinger=[];
    this.musicDirector = [];
    this.dramaStories = [];
    this.comedyStories = [];
    this.advStories = [];
    this.crimeStories = [];
    this.fireBaseService.readActors().subscribe(data => {
      data.map((e: any) => {
        this.safeURLs  =[];
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        docData['storyCount'] = e.payload.doc.data()['associatedStories'].length;        
        if(e.payload.doc.data()['profilesArray'] !== undefined ){
            e.payload.doc.data()['profilesArray'].forEach( (element) => {
              let profile=element?element.split('=')[1]:element;
              this.safeURLs.push(this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+profile));
          });
      }
       /**
        let profile = e.payload.doc.data()['profiles'] ? e.payload.doc.data()['profiles'].split('=')[1] : e.payload.doc.data()['profiles'];
        if (profile == undefined) {
          profile = e.payload.doc.data()['profiles'] ? e.payload.doc.data()['profiles'].split('/')[3] : e.payload.doc.data()['profiles'];
        }
        docData['thumnail'] = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + profile);
        */ 
        docData['thumnail'] = this.safeURLs;
        if (docData['actorName'].indexOf(this.username) !== 0) {
          this.users.push(docData);
        }
      });
      this.maleActor = _.filter(this.users, { 'gender': 'M','userType': 'A'});
      this.maleActor = this.maleActor.map(actor => {
        // To get the mobNoRequested status
        const whatsAppNoRequestStatus = this.fireBaseService.whatsAppNoRequestDetails.filter(data => {
          return actor.id === data.actorDocId;
        });
        // To set the mobNoRequested status -- NR(Not Requested)->default status
        actor.mobNoRequested = (whatsAppNoRequestStatus.length) ? whatsAppNoRequestStatus[0].status : 'NR';
        return actor;
      });
      this.maleActor = _.uniqBy(this.maleActor,'actorName'); 
      this.maleActor = _.orderBy(this.maleActor, ['storyCount'], ['desc']);
      
      this.femaleActor = _.filter(this.users, { 'gender': 'F','userType': 'A' });
      this.femaleActor = this.femaleActor.map(actor => {
        // To get the mobNoRequested status
        const whatsAppNoRequestStatus = this.fireBaseService.whatsAppNoRequestDetails.filter(data => {
          return actor.id === data.actorDocId;
        });
        // To set the mobNoRequested status -- NR(Not Requested)->default status
        actor.mobNoRequested = (whatsAppNoRequestStatus.length) ? whatsAppNoRequestStatus[0].status : 'NR';
        return actor;
      });
      this.femaleActor = _.uniqBy(this.femaleActor,'actorName'); 
      this.femaleActor = _.orderBy(this.femaleActor, ['storyCount'], ['desc']);
      //Music Director
      this.musicDirector = _.filter(this.users, { 'userType': 'MD' },);
      this.musicDirector = this.musicDirector.map(actor => {
        // To get the mobNoRequested status
        const whatsAppNoRequestStatus = this.fireBaseService.whatsAppNoRequestDetails.filter(data => {
          return actor.id === data.actorDocId;
        });
        // To set the mobNoRequested status -- NR(Not Requested)->default status
        actor.mobNoRequested = (whatsAppNoRequestStatus.length) ? whatsAppNoRequestStatus[0].status : 'NR';
        return actor;
      });
      this.musicDirector = _.uniqBy(this.musicDirector,'actorName');
      this.musicDirector = _.orderBy(this.musicDirector, ['storyCount'], ['desc']);

    //Male singer
    this.malesinger = _.filter(this.users, { 'gender': 'Singer_M','userType': 'S'  },);
    this.malesinger = this.malesinger.map(actor => {
      // To get the mobNoRequested status
      const whatsAppNoRequestStatus = this.fireBaseService.whatsAppNoRequestDetails.filter(data => {
        return actor.id === data.actorDocId;
      });
      // To set the mobNoRequested status -- NR(Not Requested)->default status
      actor.mobNoRequested = (whatsAppNoRequestStatus.length) ? whatsAppNoRequestStatus[0].status : 'NR';
      return actor;
    });
    this.malesinger = _.uniqBy(this.malesinger,'actorName');
    this.malesinger = _.orderBy(this.malesinger, ['storyCount'], ['desc']);

  //Female singer
  this.femalesinger = _.filter(this.users, { 'gender': 'Singer_F','userType': 'S'  },);
  this.femalesinger = this.femalesinger.map(actor => {
    // To get the mobNoRequested status
    const whatsAppNoRequestStatus = this.fireBaseService.whatsAppNoRequestDetails.filter(data => {
      return actor.id === data.actorDocId;
    });
    // To set the mobNoRequested status -- NR(Not Requested)->default status
    actor.mobNoRequested = (whatsAppNoRequestStatus.length) ? whatsAppNoRequestStatus[0].status : 'NR';
    return actor;
  });
  this.femalesinger = _.uniqBy(this.femalesinger,'actorName');
  this.femalesinger = _.orderBy(this.femalesinger, ['storyCount'], ['desc']);

    });
  }
  async presentToast(msg, type) {
    const toast = await this.toastCtrl.create({
      message: msg,
      animated: true,
      cssClass: type,
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }
  async showdialer(actor,duplicateClickCount) {
    if (this.duplicateClickCount == 1){
              const loading = await this.loadingCtrl.create({
                message: 'Sending Request...',
                duration:1000
              });
              await loading.present(); 
              loading.onWillDismiss();           
        }   
    
    if(this.showStatus(actor) == 'Rejected'){
      this.duplicateClickCount = duplicateClickCount+1;
      this.presentToast('Your request already rejected', 'toast-danger');
      return;
    }
    else if(this.showStatus(actor) == 'Request Sent'){
      this.duplicateClickCount = duplicateClickCount+1;
      this.presentToast('Your request already sent', 'toast-danger');
      return;
    }
    else if(!(this.numberOnlyValidation(this.showStatus(actor)))){
      this.duplicateClickCount = duplicateClickCount+1;
      this.presentToast('You cannot send request', 'toast-danger');
      return;
    }
    else if(this.duplicateClickCount == 1){
    
                    let status=this.showStatus(actor);
                    if(!isNaN(_.toNumber(status))){
                      this.callNumber.callNumber(status, true)
                      .then(res => console.log('Launched dialer!', res))
                      .catch(err => console.log('Error launching dialer', err));
                    }else if(status == 'Contact'){                      
                      const reqObj = {
                        requestedUserEmail: this.username,
                        actorDocId: actor.id,
                        status: 'P',
                        actorName: actor.actorName,
                        notify_status: 'A',
                        notified:false,
                        createdOn: moment().format('YYYY-MM-DD hh:mm:ss A').toString(),
                        updateOn: moment().format('YYYY-MM-DD hh:mm:ss A').toString()
                      };
                      if(this.duplicateClickCount == 1 && status == 'Contact'){
                                  this.fireBaseService.whatsAppNoRequest(reqObj).then(creationResponse => {
                                    if (creationResponse != null) {
                              
                                      actor.mobNoRequested = 'P';
                              
                                      this.mobNoRequested = true;
                                      this.presentToast('WhatApp Number Request has been sent', 'toast-success');
                                      this.fireBaseService.filterDeviceInfoByUserName(reqObj.actorName).then((deviceInfo: any) => {
                                        if(deviceInfo.id) {
                                          const notificationReqObj = {
                                            'to':deviceInfo.deviceRegistrationToken,
                                            'notification':{
                                                  'body':`${this.username} has requested to view your WhatsApp number!`,
                                                  'title':"VIFI"
                                            }
                                          }
                                          this.fireBaseService.sendNotificationToSingleDevice(notificationReqObj).subscribe(res => {
                                            console.log('Like notification response ------->', res);
                                          });
                                        }
                                      });
                                    }
                                  })
                                    .catch(error => this.presentToast('Network/Server may slow.Please try after sometime..!', 'toast-danger'));
                                }
                             }     
         this.duplicateClickCount = this.duplicateClickCount+1;
         
        }else{
          this.duplicateClickCount = 1;
        }
            
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  goBack() {
    this.router.navigateByUrl('/app/tabs/speakers');
  }
  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }
//Call methods to check if slide is first or last to enable disbale navigation  
checkIfNavDisabled(object, slideView) {
  this.checkisBeginning(object, slideView);
  this.checkisEnd(object, slideView);
}
checkisBeginning(object, slideView) {
  slideView.isBeginning().then((istrue) => {
    object.isBeginningSlide = istrue;
  });
}
checkisEnd(object, slideView) {
  slideView.isEnd().then((istrue) => {
    object.isEndSlide = istrue;
  });
}
//popup
async showPopup(obj) {
  const alert = await this.alertCtrl.create({
    header: 'About '+ obj.displayName,
    message: obj.skills,
    buttons: [
      {
        text: 'Cancel',
        cssClass: 'danger',
        handler: () => {
        }
      }
    ]
  });
  
  // now present the alert on top of all other content
  await alert.present();
  //this.routeToHome();
}
next() {
  this.ionSlides.slideNext();
}

prev() {
  this.ionSlides.slidePrev();
}
}
