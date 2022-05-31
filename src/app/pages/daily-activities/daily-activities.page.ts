import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ActionSheetController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config, PopoverController, IonSlides } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ShortNumberPipe } from '../../pipes/short-number.pipe';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NavigationStart, Event as NavigationEvent } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivityCommentsPageModule } from '../activity-comments/activity-comments.module';
import { ActivityCommentsPage } from '../activity-comments/activity-comments.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PostActivitiesPage } from '../post-activities/post-activities.page';
import * as firebase from 'firebase';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
//import { FCM } from '@ionic-native/fcm/ngx';
//import * as firebaseapp from 'firebase/app';
//import firebase from "firebase/app";
import "firebase/messaging";
import { VideoEditor } from '@ionic-native/video-editor/ngx';

@Component({
  selector: 'app-daily-activities',
  templateUrl: './daily-activities.page.html',
  styleUrls: ['./daily-activities.page.scss'],
})
export class DailyActivitiesPage implements OnInit {

  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;
  @ViewChild('video', { static: false }) myVideo: ElementRef;


  isplay = false;
  name = 'Angular';

  playVideo(playPressed) {
    if (playPressed == 'play') {
      this.myVideo.nativeElement.pause();
    }
    else {
      this.myVideo.nativeElement.play();
    }

  }
  activitiesPaginationInitVal = 0;
  heartClass: string;
  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  pendingStatus: any;
  specialStorygroups: any = ['Feature Film Special Stories', 'Non-Feature Film Special Stories'];
  groups: any = ['Most Viewed - Feature film', 'Most Viewed - Non Feature film', 'Top Actors', 'Top Actress', 'Top Music Directors', 'Top Singers', 'Top DOP', 'Top Editor', 'Top Directors'];
  confDate: string;
  showSearchbar: boolean;
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  slideOpts;
  activities: any[];
  lastInResponse: any;
  topBudget: any[];
  topBudgetToProducer: any[];
  sliderOne: any;
  topViewed: any[];
  topViewedToProducer: any[];
  topViewedDirectorPostedStories: any[];
  topBudgetDirectorPostedStories: any[];
  username: string;
  rejectOrApproveFlag: boolean = false;
  actors: any = [];
  shooting
  topActress: any = [];
  topActors: any = [];
  directorPostedStoryList: any = [];
  producerVisibilityStoryList: any = [];
  vifiNotificationList: any = [];
  userType: string;
  isCertified: boolean = false;
  searchTerm: string;
  isLoaded: boolean = false;
  changeTool: string = 'change-tool-height2';
  items: any[];
  items1: any[];
  popup: boolean = false;
  notifyImPopup: boolean = false;
  showMore: boolean = false;
  localnotifyCount: number = 0;
  vifiLocalCount: number = 0;
  whatsNotificationCount: number = 0;
  noRecords = { title: "No Records Found", image: '' };
  //social sharing test
  textToShare: string;
  urlToShare: string;
  imageToShare: any;

  bannerUnitId: string;
  rewardUnitId: string;
  interstitialUnitId: string;

  notifiedImg: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    slideShadows: true,
    pager: false
  };
  slideOptsCards = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    direction: 'vertical',
    slideShadows: true,
    pager: false
  };
  slideOptsActors = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    slideShadows: true,
    pager: false
  };

  sliderConfig = {
    initialSlide: 0,
    spaceBetween: 10,
    centeredSlides: true,
    speed: 500,
    loop: true,
    direction: 'vertical',
    slidesPerview: 1.6
  }
  isItemAvailable = false;


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
  shootingYes: any = [];
  q1: any[];
  q3: any[];
  users: any[];
  alreadyBooked: any[];
  userDetails: [];
  userEmail: string = "";
  whatsappApprovedNotifyList: any = [];
  topMusic: any[];
  topSingers: any[];
  topDOPList: any[];
  topEditors: any[];
  topDirectors: any[];
  notify: any = [];
  notify1: any = [];
  page_number = 1;
  page_limit = 7;

  public readonly VAP_ID_KEY = 'BDBKqSSFjLmk0hXFHfLwU6n2lJJXKi_Z0CH0x-LjfnSQoal2CzymZMk2xZm7FnWA1b29bL8uRHM8uN6GssGvWJc';
  public readonly VAP_ID_KEY_ANDROID = "BGhTOZ30l2KvdJwX9ajvoXQpvG6rAb56OM7cXD0-n-wTMJfKj6atErBFetZjOvfT-Bp9skFzdf5JtnILJjPLdf4"
  constructor(
    public popoverCtrl: PopoverController, public toastController: ToastController,
    public userData: UserData, public modalController: ModalController,
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public router: Router, public actionSheetController: ActionSheetController,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public config: Config,
    public fireBaseService: FireBaseService,
    public platForm: Platform,
    private http: HttpClient,
    public ngFireAuth: AngularFireAuth,
    private socialSharing: SocialSharing,
    private localNotifications: LocalNotifications,
    private admobFree: AdMobFree,
    private fcm: FCM,
    private videoEditor: VideoEditor
  ) {

    this.sliderOne =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 995
        }
      ]
    };
    const slideOpts = {
      slidesPerView: 2,
      coverflowEffect: {
        initialSlide: 1,
        rotate: 10,
        stretch: 50,
        depth: 50,
        modifier: 1,
        slideShadows: true,
        centeredSlides: true,
      },

    }


    this.slideOpts = slideOpts;


  }
  doRefresh(obj) {
    this.getActivities(false, "", 0);
    setTimeout(() => {

      obj.target.complete();
    }, 300);
  }
  trimString(string, length) {
    return string.length > length ?
      string.substring(0, length) + '...' :
      string;
  }
  changeClass(obj) {

    let activity = {};
    activity['id'] = obj['id']
    activity['likes'] = obj.likes;
    activity['likes'].push(this.userData.userName);
    this.heartClass = "heart-cls-red";
    this.fireBaseService.addOrupdateActivityComment(activity);
  }
  showMoreCall() {
    this.showMore = true;
  }
  ionViewDidEnter() {
    this.activities = [];
    this.activitiesPaginationInitVal = 0;
    this.textToShare = "";
    this.urlToShare = "";
    this.imageToShare = null;
    this.heartClass = 'heart-cls-white';
    let networkStatus = (window.navigator.onLine ? 'on' : 'off') + 'line'
    if (networkStatus == 'offline') {
      //this.presentToast('No Internet Connection:Please turn on your network connection!', 'toast-danger');
      return;
    }
    this.getActivities(false, "", this.activitiesPaginationInitVal);
    this.getNotificationCount(this.userData.userName);
    //Everybody can see the post but hen click on detail of story or crew need to login
    this.showSkeltonLoading();
    // this.fireBaseService.readAdsUnit().subscribe(data => {
    //   data.map(e => {
    //     let docData = e.payload.doc.data();
    //     if (docData['typeofAd'] == 'banner') {
    //       this.bannerUnitId = docData['unitId'];
    //     }
    //     if (docData['typeofAd'] == 'interstitial') {
    //       this.interstitialUnitId = docData['unitId'];
    //     }
    //     if (docData['typeofAd'] == 'rewardVideo') {
    //       this.rewardUnitId = docData['unitId'];
    //     }
    //   });
    // });

    // this.fireBaseService.readAdManagement().subscribe(data => {
    //   data.map(e => {
    //     let docData = e.payload.doc.data();
    //     if (docData['screenName'] == 'dailyActivities') {
    //       if (docData['isBannerAdsRequired']) {
    //         this.showBannerAd();
    //       }
    //       if (docData['isInterstitialAdsRequired']) {
    //         this.showInterstitialAds();
    //       }
    //       if (docData['isRewardVideoAdsRequired']) {
    //         this.showRewardVideoAds();
    //       }

    //     }
    //   });
    // });

    this.ios = this.config.get('mode') === 'ios';
    setTimeout(() => {
      this.userData.getUsername().then((username) => {
        this.userData.userName = username;
      });
    });
  }
  isAlreadyLiked(likeObj) {
    //this.ngFireAuth.onAuthStateChanged((obj)=>{
    if (!(_.isEmpty(this.userData.userName))) {
      if (likeObj['likes'].indexOf(this.userData.userName) >= 0) {
        this.heartClass = "heart-cls-red";
        this.presentToastForLike("Already Liked", 'toast-success');
        return;
      } else {
        this.fireBaseService.filterDeviceInfoByUserName(likeObj.uploaderUserName).then((deviceInfo: any) => {
          if(deviceInfo.id) {
            const notificationReqObj = {
              'to':deviceInfo.deviceRegistrationToken,
              'notification':{
                    'body':`${this.userData.userName} liked your Post`,
                    'title':"VIFI"
              },
              'fcm_options': {
                'link': "vifi://"
              }
            }
            this.fireBaseService.sendNotificationToSingleDevice(notificationReqObj).subscribe(res => {
              console.log('Like notification response ------->', res);
            });
          }
        });
        this.heartClass = "heart-cls-red";
        this.changeClass(likeObj);
      }
    } else {
      this.presentToast('Please login/signup to see more!', 'toast-success');
      this.router.navigateByUrl('/signUp');
    }
    //})
  }
  async presentToastForLike(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: type,
      duration: 1000,
      position: 'middle'
    });
    toast.present();
  }
  showLocalNotification() {
    this.fireBaseService.getWhatappNoRequestedDetails(this.username).subscribe((res: any) => {

      this.fireBaseService.whatsAppNoRequestDetails = Array.isArray(res) ? res : [];


      this.whatsappApprovedNotifyList = [];

      this.whatsappApprovedNotifyList = _.filter(this.fireBaseService.whatsAppNoRequestDetails, { 'status': 'A', 'requestedUserEmail': this.username });



      this.whatsappApprovedNotifyList = _.orderBy(this.whatsappApprovedNotifyList, ['updateOn'], ['desc']);

      this.whatsappApprovedNotifyList = this.whatsappApprovedNotifyList ? this.whatsappApprovedNotifyList.splice(0, 1) : this.whatsappApprovedNotifyList;
      this.localNotifications.schedule([{
        id: 2,
        title: 'ViFi Team - Update',
        text: 'Contact request was approved by' + this.whatsappApprovedNotifyList.actorName,
        icon: '../../../assets/icons/Black And Red.png'
      }]);

    });
  }

  getUserName() {
    //this.getPosts();
    setTimeout(() => {
      this.userData.getUsername().then((username) => {
        //this.ngFireAuth.onAuthStateChanged((obj)=>{
        if (username) {
          // this.username = obj.email.split('@')[0];  
          this.username = username;
          this.fireBaseService.filterUsers(this.username).get().subscribe(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              sessionStorage.setItem('userEmail', doc.data()['emailId']);
            });
          });
          if (this.username != null) {
            this.changeTool = 'change-tool-height1';

            setTimeout(() => {
              this.userData.getRole().then((role) => {
                this.userType = role;
                //this.validateExactStoryForRightDirector(this.username);
              });
            }, 100);


            this.fireBaseService.readwhatsAppApproveNoify().subscribe(data => {
              data.map(e => {
                let docData = e.payload.doc.data();
                if (docData !== '') {
                  this.notify.push(docData);
                }
              });

              this.notify.reverse();
              this.notify = [...this.notify];
              this.notify = _.orderBy(this.notify, ['updateOn'], ['desc']);
              this.notify1 = _.filter(this.notify, { 'actorName': this.username, 'status': 'P' });
              if (this.notify1.length <= 0) {//For Director only required story likes,dislikes
                this.notify = _.filter(this.notify, { 'uploadedBy': this.username, 'notified': false });
                this.notify = _.uniqBy(this.notify, 'actorName');
              } else { //For Actor/Actress only required approval notification
                this.notify = this.notify1;
                this.notify = _.uniqBy(this.notify, 'requestedUserEmail');
              }

            });
          }
        } else {
          this.changeTool = 'change-tool-height2';
        }
      });
    }, 200);
  }
  showDetail(posterOwner) {
    if (this.userData.userName) {
      this.fireBaseService.filterActorByName(posterOwner).then(element => {
        this.confData.actorData = {};
        this.confData.actorData = element['docs'][0].data();
        this.confData.isFromPage = "activities";
        this.router.navigateByUrl('/actor-details');
      });
    } else {
      //this.presentToast('Please login/signup to see more!','toast-success');
      this.router.navigateByUrl('/signUp');
    }
  }
  async getwhatsAppNotifications() {
    let whatsApparray = [];
    let pendingStatus = [];
    let approvedOrRejectedStatus = [];
    if (this.userType == 'D') {
      this.fireBaseService.getWhatappNoRequestedDetails(this.userData.userName).subscribe((res: any) => {
        whatsApparray = Array.isArray(res) ? res : [];
        approvedOrRejectedStatus = _.filter(whatsApparray, function (o) {
          return o.status !== 'P' && o.notified == false;
        });
        if (approvedOrRejectedStatus) {
          this.whatsNotificationCount = approvedOrRejectedStatus.length;
        }
      });
    } else {
      this.fireBaseService.getRequestDetails(this.userData.userName).subscribe((res: any) => {
        whatsApparray = Array.isArray(res) ? res : [];
        pendingStatus = _.filter(whatsApparray, { 'status': 'P' });
        if (pendingStatus) {
          this.whatsNotificationCount = pendingStatus.length;
        }
      });
    }

  }
  async getVifiNotifications() {
    let notifiedImgList = [];
    //this.ngFireAuth.onAuthStateChanged((obj)=>{
    // if(obj){
    setTimeout(() => {
      this.userData.getUsername().then((username) => {
        //this.userData.userName = obj.email.split('@')[0]; 
        this.userData.userName = username;
      });
    });
    //}
    //});
    this.fireBaseService.getVifiNotifications().subscribe(data => {
      if (data !== undefined && data.length > 0) {
        data.map((e: any) => {
          let docData = e.payload.doc.data();

          if (e.payload.doc.data()['image'] !== '') {
            docData['image'] = e.payload.doc.data()['image'];
            this.notifiedImg = e.payload.doc.data()['image'];
          }
          docData['id'] = e.payload.doc.id;
          docData['vifi-notify-msg'] = e.payload.doc.data()['vifi-notify-msg'];
          this.vifiNotificationList.push(docData);

        });
      } else {
        this.notifiedImg = ''
        this.vifiLocalCount = 0;
        this.notifyImPopup = false;
        return;
      }
      this.vifiNotificationList = _.uniqBy(this.vifiNotificationList, 'uid');
      this.vifiLocalCount = this.vifiNotificationList.length;

      if (this.notifiedImg !== undefined && this.notifiedImg !== '') {
        this.vifiNotificationList.forEach(element => {
          if (element['imageNotified'] !== undefined) {
            if (element['imageNotified'].length > 0) {
              element['imageNotified'].forEach(element => {
                if (element == 'true_' + this.userData.userName) {
                  notifiedImgList.push(element);
                }
              });
            }
          } else {
            return;
          }
        });
      } else {
        return;
      }
      if (notifiedImgList.length == 0) {
        this.notifyImPopup = true;
      } else {
        this.notifyImPopup = false;
      }
    });
  }
  async getNotificationCount(username) {
    this.notify = [];
    this.vifiNotificationList = [];
    this.notify = [];
    this.getwhatsAppNotifications();
    this.getVifiNotifications();
    this.fireBaseService.readNoify().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();

        this.notify.push(docData);
      });

      this.notify.reverse();
      this.notify = [...this.notify];
      this.notify = _.orderBy(this.notify, ['updateOn'], ['desc']);
      this.notify = _.filter(this.notify, { 'storyUploadedBy': username, 'notified': false });
      this.localnotifyCount = this.notify.length;
    });
  }

  ngOnInit() {
  }
  updateViewCount(obj) {
    if (obj['views'] != undefined) {
      obj['views'] = obj['views'] + 1;
    }
    this.fireBaseService.updatePost(obj['id'], obj);
  }

  showSkeltonLoading() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 3000);
  }
  fetchTicketGenerated() {
    let alreadyBooked = [];
    this.shootingYes.forEach(element => {
      this.fireBaseService.filterTicket(this.username).get().subscribe(async function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (element['id'] == doc.data()['storyId']) {
            alreadyBooked.push(doc.data());
          }
          sessionStorage.setItem('alreadyBooked', JSON.stringify(alreadyBooked));

        });
      });
    });
  }
  /***
    * getPosts
    */
  async getActivities(isFirstLoad, event, activitiesPaginationInitVal) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading Activities...',
      duration: 2000
    });
    if (!isFirstLoad) {
      await loading.present();
    }
    // this.activities = [];
    /**this.fireBaseService.readActivities().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        this.activities.push(docData);
      }); */
    this.fireBaseService.readActivitiesWithPagination(activitiesPaginationInitVal).subscribe((data: any) => {
      this.lastInResponse = data.docs[data.docs.length - 1];
      data.docs.map(e => {
        let docData = e.data();
        docData['id'] = e.data().id;
        this.activities.push(docData);
      });
      this.activities = this.activities.map((activity, index) => {
        if (activity.mediaFileType === 'video') {
          activity['videoThumbnail'] = '';
          this.createThumbnail(activity.mediaFile, activity.id, index);
        }
        return activity;
      });
      console.log('activities with video thumbnail --->', this.activities);
      this.activities.reverse();
      this.activities = [...this.activities];
      this.activities = _.uniqBy(this.activities, 'seqId');
      //this.activities = _.orderBy(this.activities, ['uploadedOn'], ['desc']);
      this.activities = _.orderBy(this.activities, [(obj) => new Date(obj.uploadedOn)], ['desc']);
      if (isFirstLoad) {
        console.log("page_number::", this.page_number);
        console.log("inside is Firstload:::", event.target.complete());
        event.target.complete();
        this.page_number++;
      }

      loading.dismiss();
    });


  }




  openPostList() {

    this.router.navigateByUrl('/post-list');

  }

  /**async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: LoginPopover,
      event
    });
    await popover.present();
  }*/



  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
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

  validateExactStoryForRightDirector(username) {
  }
  calculateHeight() {
  }
  async showOrAddComments(activityObj) {

    const modal = await this.modalController.create({
      component: ActivityCommentsPage,
      componentProps: {
        "paramID": activityObj,
        "paramTitle": "Test Title"
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {

      }
    });
    return await modal.present();


  }

  async presentActionSheet(message, url) {
    this.urlToShare = "";
    this.imageToShare = "";
    this.textToShare = "";
    this.textToShare = message;
    if (url.split('activities_image')[1] !== undefined) {
      const firstSpilit_img = url.split('activities_image')[1];
      const secondSpilit_img = firstSpilit_img.split('?')[0];
      this.urlToShare = 'https://storage.googleapis.com/app-quick-direct.appspot.com/activities_image' + secondSpilit_img.replaceAll('%2F', '/');
      this.imageToShare = 'https://storage.googleapis.com/app-quick-direct.appspot.com/activities_image' + secondSpilit_img.replaceAll('%2F', '/');
    }
    if (url.split('activities_video')[1] !== undefined) {
      const firstSpilit_video = url.split('activities_video')[1];
      const secondSpilit_video = firstSpilit_video.split('?')[0];
      this.urlToShare = 'https://storage.googleapis.com/app-quick-direct.appspot.com/activities_video' + secondSpilit_video.replaceAll('%2F', '/');
      this.imageToShare = 'https://storage.googleapis.com/app-quick-direct.appspot.com/activities_video' + secondSpilit_video.replaceAll('%2F', '/');
    }
    if (url.split('activities_audio')[1] !== undefined) {
      const firstSpilit_audio = url.split('activities_audio')[1];
      const secondSpilit_audio = firstSpilit_audio.split('?')[0];
      this.urlToShare = 'https://storage.googleapis.com/app-quick-direct.appspot.com/activities_audio' + secondSpilit_audio.replaceAll('%2F', '/');
      this.imageToShare = 'https://storage.googleapis.com/app-quick-direct.appspot.com/activities_audio' + secondSpilit_audio.replaceAll('%2F', '/');
    }
    if (this.textToShare !== '' || this.textToShare !== undefined) {
      this.textToShare = this.textToShare + " [ Shared from VIFI app : " + " https://play.google.com/store/apps/details?id=com.vifi_01 ]";
    } else {
      this.textToShare = "- " + " [ Shared from VIFI app : " + "https://play.google.com/store/apps/details?id=com.vifi_01 ]"
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Below To share...',
      buttons: [{
        text: 'WhatsApp',
        role: 'destructive',
        icon: 'logo-whatsapp',
        handler: () => {
          this.shareviaWhatsapp();
        }
      }, {
        text: 'FaceBook',
        icon: 'logo-facebook',
        handler: () => {
          this.shareviaFacebook();
        }
      }, {
        text: 'Instagram',
        icon: 'logo-instagram',
        handler: () => {
          this.shareviaInstagram();
        }
      },
      {
        text: 'Twitter',
        icon: 'logo-twitter',
        handler: () => {
          this.shareviaTwitter();
        }
      }]
    });
    await actionSheet.present();
  }
  shareviaWhatsapp() {
    this.socialSharing.shareViaWhatsApp(this.textToShare, this.imageToShare)
      .then((success) => {
        //this.presentToastForLike("Your message shared",'toast-success');
      })
      .catch(() => {
        //this.presentToastForLike("Could not share information",'toast-danger');
      });
  }
  shareviaFacebook() {

    this.socialSharing.shareViaFacebook("[ Shared from VIFI app ] ", this.imageToShare, this.urlToShare)
      .then((success) => {
        // this.presentToastForLike("Your message shared",'toast-success');
      })
      .catch((err) => {
        // this.presentToastForLike("Video/Image Allowed not Prefilled Message",'toast-danger');
      });
  }
  shareviaInstagram() {

    this.socialSharing.shareViaInstagram(this.textToShare, this.imageToShare)
      .then((success) => {
        //this.presentToastForLike("Your message shared",'toast-success');
      })
      .catch(() => {
        // this.presentToastForLike("Video/Image Allowed not Prefilled Message",'toast-danger');
      });
  }
  shareviaTwitter() {

    this.socialSharing.shareViaTwitter(this.textToShare, null, this.urlToShare)
      .then((success) => {
        // this.presentToastForLike("Your message shared",'toast-success');
      })
      .catch((err) => {
        // this.presentToastForLike("Could not share information",'toast-danger');       
      });
  }
  async postYourActivities() {

    const modal = await this.modalController.create({
      component: PostActivitiesPage,
      componentProps: {
        "paramID": null,
        "paramTitle": "Test Title"
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {

      }
    });
    return await modal.present();
  }

  async presentFilter() {
    if ((this.localnotifyCount + this.vifiLocalCount + this.whatsNotificationCount) == 0) {
      this.presentToast('There are no notifications to display', 'toast-danger');
      return;
    }
    const modal = await this.modalController.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      if (data['clearNotify'] == true) {
        this.notify = [];
      }
      this.excludeTracks = data;
      //this.updateSchedule();
    }
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
  //Google ads iplementation starts
  showBannerAd() {
    let bannerConfig: AdMobFreeBannerConfig = {
      isTesting: true, // Remove in production
      autoShow: true,
      id: this.bannerUnitId
      //id: "ca-app-pub-7771494690888171/4926625794"
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare().then(() => {
    }).catch(e => console.log(e));
  }



  showInterstitialAds() {
    let interstitialConfig: AdMobFreeInterstitialConfig = {
      isTesting: true, // Remove in production
      autoShow: true,
      id: this.interstitialUnitId
      //id: "ca-app-pub-7771494690888171/6978074061"
    };
    this.admobFree.interstitial.config(interstitialConfig);
    this.admobFree.interstitial.prepare().then(() => {
    }).catch(e => console.log(e));
  }

  showRewardVideoAds() {
    let RewardVideoConfig: AdMobFreeRewardVideoConfig = {
      isTesting: true, // Remove in production
      autoShow: true,
      id: this.rewardUnitId
      //id: "ca-app-pub-7771494690888171/2380353503"
    };
    this.admobFree.rewardVideo.config(RewardVideoConfig);
    this.admobFree.rewardVideo.prepare().then(() => {
    }).catch(e => console.log(e));
  }

  /** doInfinite(event) {
    console.log("eventing.....",event)
    this.getActivities(true, event);
  } */
  loadData(event) {
    this.activitiesPaginationInitVal = this.activitiesPaginationInitVal + 5;
    console.log("this.lastInResponse.....", this.lastInResponse);
    this.getActivities(true, event, this.lastInResponse);
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  async createThumbnail(videoUrl, id, index) {
    const options = {
      fileUri: videoUrl,
      outputFileName: `thumbnail-${id}`
    };
    const thumbnail = await this.videoEditor.createThumbnail(options);
    // const thumbnail = 'C:/Users/narendran.venkataiah/Desktop';
    this.activities[index].videoThumbnail = thumbnail;
    console.log('thumbnail image url ======>', thumbnail);
  }
}


