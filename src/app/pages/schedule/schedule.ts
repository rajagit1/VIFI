import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config, PopoverController, IonSlides } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { LoginPopover } from './login-popup/login-popover';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ShortNumberPipe } from '../../pipes/short-number.pipe';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NavigationStart, Event as NavigationEvent } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FilterListPage } from '../filter-list/filter-list.page';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})
export class SchedulePage implements OnInit {
  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  ios: boolean;
  defaultHref: string = "/app/tabs/daily-activities";
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
  posts: any[];
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
  localnotifyCount: number = 0;
  vifiLocalCount: number = 0;
  whatsNotificationCount: number = 0;
  noRecords = { title: "No Records Found", image: '' };
  notifiedImg: any;
  bannerUnitId: string;
  rewardUnitId: string;
  interstitialUnitId: string;
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
  constructor(
    public popoverCtrl: PopoverController,
    public userData: UserData, public modalController: ModalController,
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public config: Config,
    public fireBaseService: FireBaseService,
    public platForm: Platform,
    private http: HttpClient,
    public ngFireAuth: AngularFireAuth,
    private admobFree: AdMobFree,
    private localNotifications: LocalNotifications
  ) {
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
    this.platForm.backButton.subscribeWithPriority(0, async () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/app/tabs/schedule') {
        navigator['app'].exitApp();
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Confirm',
          message: 'Do you really want to exit?',
          buttons: [
            {
              text: 'No',
              handler: () => {


              }
            },
            {
              text: 'Yes',
              handler: () => {
                // they want to remove this session from their favorites
                navigator['app'].exitApp();
              }
            }
          ]
        });
      }
    });


    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {
            this.getUserName();
            this.queryText = '';
            this.showSearchbar = false;
            this.items = [];
            this.posts = [];
            this.topBudget = [];
            this.topBudgetDirectorPostedStories = [];
            this.topBudgetToProducer = [];
            this.topViewed = [];
            this.topViewedToProducer = [];
            this.topViewedDirectorPostedStories = [];
            this.shootingYes = [];
            if (event.url === '/app/tabs/schedule') {
              this.getPosts();
            }
          }
        });
  }
  async showTicketNumber(post) {
    let alreadyBooked = JSON.parse(sessionStorage.getItem('alreadyBooked'));
    if (!(_.isEmpty(alreadyBooked))) {
      let i = 0;
      let Found: boolean = false;
      let foundTicket = '';
      alreadyBooked.forEach(async element => {

        if (post['id'].indexOf(element['storyId']) >= 0) {
          Found = false;
          foundTicket = element['ticketId']
          return;
        }
        if (i == alreadyBooked.length - 1 && Found == false) {
          this.callElsePart(post);
        }
        i++;
      });
      if (foundTicket != '') {
        const alert = await this.alertCtrl.create({
          header: 'Ticket Update',

          message: `You already holding a ticket` + `<br><br> <b>&nbsp;&nbsp; <img src="../../../assets/icons/ticket.png"> ` + `&nbsp;<big class='big-tkt'>` + foundTicket,
          buttons: [
            {
              cssClass: 'btn-modal',
              text: 'Close',
              handler: () => {


              }
            }]
        });
        await alert.present();
      }
    }

    else {
      this.callElsePart(post);
    }


  }
  callElsePart(post) {
    let ticket = {};

    ticket['storyId'] = post['id'];
    ticket['ticketId'] = makeid(6);
    ticket['updatedOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
    ticket['updatedBy'] = this.username;
    sessionStorage.setItem('genTicket', ticket['ticketId']);

    this.fireBaseService.createTicket(ticket).then(async creationResponse => {
      if (creationResponse != null) {

        const alert = await this.alertCtrl.create({
          header: 'Interested to generate Ticket # ?',

          message: 'Click to Proceed',
          cssClass: 'my-header',
          buttons: [{
            text: 'Proceed',
            cssClass: 'my-btn',
            handler: () => {
              this.alertCtrl.create({
                header: 'Ticket Generated',
                subHeader: ticket['ticketId'],
                message: 'Keep this ticket# for future reference',
                buttons: [
                  {
                    text: 'OK',
                    cssClass: 'btn-modal',
                    handler: async () => {
                      let emailUrl = "https://us-central1-app-direct-a02bf.cloudfunctions.net/sendMail?dest=" + sessionStorage.getItem('userEmail')
                      emailUrl = emailUrl + '&body=<b> Greeting from Vi-Fi Team </b> <br> ' + post['title'] + ' ticket has been generated.<br><b>  ' + sessionStorage.getItem('genTicket') + '</b>    Keep this as reference.<br> Email - viabilityfilm@gmail.com';
                      this.callService(emailUrl);

                    }
                  },
                  {
                    text: 'Cancel',
                    cssClass: 'btn-modal',
                    handler: () => {
                      console.log('Let me think');
                    }
                  },

                ]
              }).then(res => {
                res.present();
              });
            }
          }]
        });

        await alert.present();


      }

    })
      .catch(error => console.log('error'));




  }


  callService(emailUrl) {

    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    /**  this.localNotifications.schedule([{
       id: 2,
       title: 'ViFi Team - Update',
       text: 'Story moved for Shooting..!',
       icon: '../../../assets/icons/Black And Red.png'
     }]);
     this.http.get(emailUrl, { headers: headers, responseType: "text" }).subscribe(async data => {
       const alert = await this.alertCtrl.create({
         header: 'Mail Update',
         message: data,
         buttons: ['OK']
       });
       await alert.present();
     }, err => {
       console.error('Oops:', err.message);
     }); */
    //this.fetchTicketGenerated();
  }
  doRefresh(obj) {
    this.getPosts();
    setTimeout(() => {

      obj.target.complete();
    }, 300);
  }

  ionViewDidEnter() {
    let networkStatus = (window.navigator.onLine ? 'on' : 'off') + 'line'
    if (networkStatus == 'offline') {
      this.presentToast('No Internet Connection:Please turn on your network connection!', 'toast-danger');
      return;
    }
    this.getPosts();
    //Everybody can see the post but hen click on detail of story or crew need to login
    this.ngFireAuth.onAuthStateChanged((obj) => {
      if (obj) {
        this.getUserName();
        //this.getNotificationCount(this.userData.userName);
      }
    });
    this.confData.isFromPage = "";

    this.showSkeltonLoading();

    this.queryText = '';
    this.showSearchbar = false;
    this.items = [];
    this.posts = [];
    this.topBudget = [];
    this.topBudgetDirectorPostedStories = [];
    this.topBudgetToProducer = [];
    this.topViewed = [];
    this.topViewedToProducer = [];
    this.topViewedDirectorPostedStories = [];
    this.shootingYes = [];

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
    //     if (docData['screenName'] == 'trending') {
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
    this.notifyPopup();
    this.updateSchedule();
    this.ios = this.config.get('mode') === 'ios';
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
  showDetail(data) {
    setTimeout(() => {
      this.userData.getUsername().then((username) => {
        this.userData.userName = username;
      });
    });
    this.confData.actorData = data;
    if (this.userData.userName) {
      this.router.navigateByUrl('/actor-details');
    } else {
      this.presentToast('Please login/signup to see more!', 'toast-success');
      this.router.navigateByUrl('/signUp');
    }
  }
  /**async getNotificationCount(username){
    this.notify =[];
    this.vifiNotificationList = [];
    this.notify=[];
    //this.getwhatsAppNotifications();
    //this.getVifiNotifications();
      this.fireBaseService.readNoify().subscribe(data => {
            data.map(e => {
              let docData = e.payload.doc.data();
              
              this.notify.push(docData);
            });
            
            this.notify.reverse();
            this.notify = [...this.notify];
            this.notify = _.orderBy(this.notify, ['updateOn'], ['desc']);
            this.notify = _.filter(this.notify, { 'storyUploadedBy': username,'notified':false }); 
           this.localnotifyCount = this.notify.length;
          });
  }**/

  ngOnInit() {
  }
  updateViewCount(obj) {
    if (obj['views'] != undefined) {
      obj['views'] = obj['views'] + 1;
    }
    this.fireBaseService.updatePost(obj['id'], obj);
  }
  goToDetail(arg) {
    if (arg !== null) {
      this.isItemAvailable = false;
      this.updateViewCount(arg);
      this.confData.routingData = arg;
      this.confData.isFromPage = 'dashboard';
      this.confData.loginUser = this.username;
      setTimeout(() => {
        this.userData.getUsername().then((username) => {
          //this.ngFireAuth.onAuthStateChanged((obj)=>{
          if (username) {
            //this.userData.userName = obj.email.split('@')[0];
            this.userData.userName = username;
          }
        });
      });
      if (this.loginCheck()) {
        //this.ngFireAuth.onAuthStateChanged((obj)=>{
        //if(obj){  
        //this.userData.userName = obj.email.split('@')[0];
        this.router.navigateByUrl('/app/tabs/speakers/speaker-details');
      } else {
        this.presentToast('Please login/signup to see more!', 'toast-success');
        this.router.navigateByUrl('/signUp');
      }
      //});
      // }
    }
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
  async getPosts() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading Stories...',
      duration: 2000
    });

    await loading.present();
    this.posts = [];
    this.topBudget = [];
    this.topBudgetDirectorPostedStories = [];
    this.topBudgetToProducer = [];
    this.topViewed = [];
    this.topViewedToProducer = [];
    this.topViewedDirectorPostedStories = [];
    this.shootingYes = [];
    this.fireBaseService.readPosts().subscribe(data => {
      data.map((e: any) => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        this.posts.push(docData);
      });
      this.posts.reverse();
      this.posts = [...this.posts];

      //NonFeature film stories visible only to certified producer starts
      this.topBudgetToProducer = _.filter(this.posts, function (o) { return o.filmType !== 1 && o.storyVisibility == 'Certified'; });
      //The below lines are commnted because we don't want only 20 records we need all records in home page
      //this.topBudgetToProducer = this.topBudgetToProducer ? this.topBudgetToProducer.splice(0, 20) : this.topBudgetToProducer;
      this.topBudgetToProducer = _.orderBy(this.topBudgetToProducer, ['views'], ['desc']);
      this.topBudgetToProducer = _.uniqBy(this.topBudgetToProducer, 'title');
      //NonFeature film stories visible only to certified producer ends.Non feature films types can be collected
      //if filmType!=1 rest all non feature films
      if (this.userType == 'D') {
        this.topBudgetDirectorPostedStories = _.filter(this.posts, function (o) {
          return o.filmType != 1 && o.storyVisibility == 'Certified';
        });
        this.topBudgetDirectorPostedStories = _.filter(this.topBudgetDirectorPostedStories, { 'uploadedBy': this.username });
      }
      this.topBudget = _.filter(this.posts, function (o) { return o.filmType != 1 && o.storyVisibility == 'Public'; });
      if (this.topBudgetDirectorPostedStories.length > 0) {
        this.topBudgetDirectorPostedStories.forEach(item => this.topBudget.push(item));
      }
      //The below lines are commnted because we don't want only 20 records we need all records in home page
      //this.topBudget = this.topBudget ? this.topBudget.splice(0, 20) : this.topBudget;
      this.topBudget = _.orderBy(this.topBudget, ['views'], ['desc']);
      this.topBudget = _.uniqBy(this.topBudget, 'title');

      //Feature film stories visible only to certified producer starts
      this.topViewedToProducer = _.filter(this.posts, { 'filmType': 1, 'storyVisibility': "Certified" });
      //The below lines are commnted because we don't want only 20 records we need all records in home page
      //this.topViewedToProducer = this.topViewedToProducer ? this.topViewedToProducer.splice(0, 20) : this.topViewedToProducer;
      this.topViewedToProducer = _.orderBy(this.topViewedToProducer, ['views'], ['desc']);
      this.topViewedToProducer = _.uniqBy(this.topViewedToProducer, 'title');
      //Feature film stories visible only to certified producer ends
      if (this.userType == 'D') {
        this.topViewedDirectorPostedStories = _.filter(this.posts, { 'filmType': 1, 'storyVisibility': "Certified", 'uploadedBy': this.username });
      }
      this.topViewed = _.filter(this.posts, { 'filmType': 1, 'storyVisibility': "Public" });
      if (this.topViewedDirectorPostedStories.length > 0) {
        this.topViewedDirectorPostedStories.forEach(item => this.topViewed.push(item));
      }
      //The below lines are commnted because we don't want only 20 records we need all records in home page
      //this.topViewed = this.topViewed ? this.topViewed.splice(0, 20) : this.topViewed;
      this.topViewed = _.orderBy(this.topViewed, ['views'], ['desc']);
      this.topViewed = _.uniqBy(this.topViewed, 'title');

      this.shootingYes = _.filter(this.posts, { 'shooting': true });
      this.shootingYes = _.orderBy(this.shootingYes, ['shootingStartedDate'], ['desc']);
      //Top 20 Shooting mode films will display & rest of the movies will order by descending
      this.shootingYes = this.shootingYes ? this.shootingYes.splice(0, 20) : this.shootingYes;
      this.shootingYes = _.uniqBy(this.shootingYes, 'title');
      let emptyArr = []
      sessionStorage.setItem('alreadyBooked', null);
      this.fireBaseService.postData = this.posts;
      //this.fetchTicketGenerated();
      loading.dismiss();
    });

    this.actors = [];
    this.topActors = [];
    this.topActress = [];
    this.topMusic = [];
    this.topSingers = [];
    this.topDOPList = [];
    this.topEditors = [];
    this.topDirectors = [];
    this.users = [];
    this.q3 = [];
    this.q1 = [];
    this.fireBaseService.readActors().subscribe(data => {
      data.map((e: any) => {
        let docData = e.payload.doc.data();
        if (e.payload.doc.data()['image'] !== '') {
          docData['image'] = e.payload.doc.data()['image'];
        }
        docData['id'] = e.payload.doc.id;
        docData['storyCount'] = e.payload.doc.data()['associatedStories'].length;
        this.users.push(docData);
      });

      this.q3 = _.filter(this.users, { 'gender': 'M', 'userType': 'A' });
      this.q3 = _.orderBy(this.q3, ['storyCount'], ['desc']);
      this.topActors = _.filter(this.users, { 'gender': 'M', 'userType': 'A' });
      this.topActors = _.orderBy(this.topActors, ['storyCount'], ['desc']);
      this.q1 = _.filter(this.users, { 'gender': 'F', 'actorType': 'A' });
      this.q1 = _.orderBy(this.q1, ['storyCount'], ['desc']);
      this.topActors = _.uniqBy(this.topActors, 'actorName');
      this.topActress = _.filter(this.users, { 'gender': 'F', 'userType': 'A' });
      this.topActress = _.orderBy(this.topActress, ['storyCount'], ['desc']);
      this.topActress = _.uniqBy(this.topActress, 'actorName');
      this.topMusic = _.filter(this.users, { 'userType': 'MD' });
      this.topMusic = _.orderBy(this.topMusic, ['storyCount'], ['desc']);
      this.topMusic = _.uniqBy(this.topMusic, 'actorName');
      //Top Singers
      this.topSingers = _.filter(this.users, { 'userType': 'S' });
      this.topSingers = _.orderBy(this.topSingers, ['storyCount'], ['desc']);
      this.topSingers = _.uniqBy(this.topSingers, 'actorName');
      //Top DOP
      this.topDOPList = _.filter(this.users, { 'userType': 'DOP' });
      this.topDOPList = _.orderBy(this.topDOPList, ['storyCount'], ['desc']);
      this.topDOPList = _.uniqBy(this.topDOPList, 'actorName');
      //Top Editors
      this.topEditors = _.filter(this.users, { 'userType': 'ETR' });
      this.topEditors = _.orderBy(this.topEditors, ['storyCount'], ['desc']);
      this.topEditors = _.uniqBy(this.topEditors, 'actorName');
      //Top Directors
      this.topDirectors = _.filter(this.users, { 'userType': 'D' });
      this.topDirectors = _.orderBy(this.topDirectors, ['subscriptioncount'], ['desc']);
      this.topDirectors = _.uniqBy(this.topDirectors, 'actorName');
      loading.onWillDismiss();
    });
  }
  useFilter(arg) {
    return this.posts.filter(item => {
      return item.title.toLowerCase().indexOf(arg.toLowerCase()) > -1;
    });
  }
  setFilteredItems() {
    this.directorPostedStoryList = [];
    this.producerVisibilityStoryList = [];
    if (this.queryText != '') {
      this.isItemAvailable = true;
      this.items = this.useFilter(this.queryText);

      if (this.items.length > 0) {
        if (this.userType == 'P' && this.userData.isCertified == true) {
          this.items = _.uniqBy(this.items, 'title', this.items, 'image');
          this.producerVisibilityStoryList = _.filter(this.items, { 'storyVisibility': "Certified" });
          this.items = _.filter(this.items, { 'storyVisibility': "Public" });
          if (this.producerVisibilityStoryList.length > 0) {
            this.producerVisibilityStoryList.forEach(eachObj => this.items.push(eachObj));
          }
          this.items = _.uniqBy(this.items, 'title', this.items, 'image');
        }
        else if (this.userType == 'D') {
          this.items = this.useFilter(this.queryText);
          this.directorPostedStoryList = _.filter(this.items, { 'uploadedBy': this.username });
          this.items = _.filter(this.items, { 'storyVisibility': "Public" });
          if (this.directorPostedStoryList.length > 0) {
            this.directorPostedStoryList.forEach(eachObj => this.items.push(eachObj));
          }
          this.items = _.uniqBy(this.items, 'title', this.items, 'image');
        }
        else {
          this.items = _.filter(this.items, { 'storyVisibility': "Public" });
          this.items = _.uniqBy(this.items, 'title', this.items, 'image');
        }
      } else {
        this.items.push(this.noRecords);
      }
      // this.items1 = this.items.filter((v,i,a)=>a.findIndex(t=>(t.title === v.title && t.image===v.image))===i)
    } else {
      this.items = [];
      this.isItemAvailable = false;

    }


  }
  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;

    });
  }
  loginCheck() {
    if (_.isEmpty(this.userData.userName)) {
      this.router.navigateByUrl('/signUp');
      return false;
    } else {
      return true;
    }
  }
  createPost() {
    setTimeout(() => {
      this.userData.getUsername().then((username) => {
        //this.ngFireAuth.onAuthStateChanged((obj)=>{
        if (username) {
          //this.userData.userName = obj.email.split('@')[0]; 
          this.userData.userName = username;
        } else {
          this.presentToast('Please login/signup to see more!', 'toast-success');
          this.router.navigateByUrl('/signUp');
        }
      });
    });
    if (this.loginCheck()) {
      //this.ngFireAuth.onAuthStateChanged((obj)=>{
      //  if(obj){ 
      this.router.navigateByUrl('/create-post');
    } else {
      this.presentToast('Please login/signup to see more!', 'toast-success');
      this.router.navigateByUrl('/signUp');
    }
    //});    
  }
  openPostList() {

    this.router.navigateByUrl('/post-list');

  }
  createactor(type, fab) {
    this.router.navigateByUrl('/create-actor');
  }
  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: LoginPopover,
      event
    });
    await popover.present();
  }


  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    if (this.userData.hasFavorite(sessionData.name)) {
      // Prompt to remove favorite
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // Add as a favorite
      this.userData.addFavorite(sessionData.name);

      // Close the open item
      slidingItem.close();

      // Create a toast
      const toast = await this.toastCtrl.create({
        header: `${sessionData.name} was successfully added as a favorite.`,
        duration: 3000,
        buttons: [{
          text: 'Close',
          role: 'cancel'
        }]
      });

      // Present the toast at the bottom of the page
      await toast.present();
    }

  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  async removeFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any, title: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.userData.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
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
    this.fireBaseService.listOfApproveRejectStories(username).get().subscribe(function (querySnapshot) {
      let totalFund = [];
      let actualBudgent;
      let sumOfAllfund = [];
      let fundedByArray = [];
      querySnapshot.forEach(function (doc) {

        actualBudgent = (doc.data()['budget']);

        fundedByArray = doc.data()['fundedBy'];
        fundedByArray.forEach(function (doc) {
          sumOfAllfund.push(parseInt(_.split(doc, "_")[1]));
        });

        // totalFund.push(lastItem);
      });

      var sumOfAllfun = sumOfAllfund.reduce((a, b) => a + b);
      if (sumOfAllfun >= actualBudgent) {
        this.rejectOrApproveFlag = true;
      }
      return this.rejectOrApproveFlag;
    });

  }
  calculateHeight() {
    if (this.items.length == 0) {
      return 45;
    }
    else if (this.items.length >= 10) {
      return 250;
    } else if (this.items.length <= 5) {
      return 75;
    } else {
      return 45;
    }
  }
  /**async getVifiNotifications(){    
    let notifiedImgList =[]; 
    //this.ngFireAuth.onAuthStateChanged((obj)=>{
     // if(obj){
      setTimeout(() => {      
            this.userData.getUsername().then((username) => {
                    //this.userData.userName = obj.email.split('@')[0]; 
                    this.userData.userName = username;
            });
      }); **/
  //}
  //});
  /** this.fireBaseService.getVifiNotifications().subscribe(data => {
             if( data !== undefined && data.length >0){           
                       data.map(e => {
                           let docData = e.payload.doc.data();
                                         
                                       if(e.payload.doc.data()['image'] !==''){
                                         docData['image'] = e.payload.doc.data()['image'];
                                         this.notifiedImg = e.payload.doc.data()['image'];
                                       }
                                       docData['id'] = e.payload.doc.id;
                                       docData['vifi-notify-msg'] = e.payload.doc.data()['vifi-notify-msg'];
                                       this.vifiNotificationList.push(docData);
                                 
                         }); 
              }else{
                this.notifiedImg=''
               this.vifiLocalCount=0;
               this.notifyImPopup=false;
                 return;
               } 
               this.vifiNotificationList =_.uniqBy(this.vifiNotificationList, 'uid'); 
                 this.vifiLocalCount = this.vifiNotificationList.length;

                if(this.notifiedImg !== undefined && this.notifiedImg !==''){
                       this.vifiNotificationList.forEach(element => {
                         if(element['imageNotified'] !== undefined){
                                 if (element['imageNotified'].length >0){
                                   element['imageNotified'].forEach(element => {
                                         if(element == 'true_'+this.userData.userName){
                                           notifiedImgList.push(element);
                                         }
                                       });
                                     }
                               }else{
                                 return;
                               }   
                           });
                   }else{
                     return;
                   }   
             if(notifiedImgList.length == 0 ){
               this.notifyImPopup=true;
             }else{
               this.notifyImPopup=false;
             }   
         });
     } **/
  /**async getwhatsAppNotifications(){
    let whatsApparray = [];     
   let pendingStatus = [];
   let approvedOrRejectedStatus = [];
   if(this.userType == 'D'){
           this.fireBaseService.getWhatappNoRequestedDetails(this.userData.userName).subscribe((res:any) =>{        
             whatsApparray = Array.isArray(res)? res: [];
             approvedOrRejectedStatus = _.filter(whatsApparray, function (o) { 
               return o.status !== 'P' &&  o.notified == false; });
             if(approvedOrRejectedStatus){
               this.whatsNotificationCount = approvedOrRejectedStatus.length;
             }
           });
     }else{
       this.fireBaseService.getRequestDetails(this.userData.userName).subscribe((res:any) =>{        
         whatsApparray = Array.isArray(res)? res: [];
         pendingStatus = _.filter(whatsApparray, { 'status': 'P' });
         if(pendingStatus){
           this.whatsNotificationCount = pendingStatus.length;
         }
       });
     }

  }   **/
  notifyPopup() {
    //this.forWardisplay ='none';
    this.popup = true;
    //this.popupActorName = eachObj.actorName.charAt(0).toUpperCase()+eachObj.actorName.slice(1);
    //this.popupActorSkills = eachObj.skills;  
  }
  notifyClosePopup() {
    this.popup = false;
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
  callnotifyImagePopupClose() {
    this.notifyImPopup = false;
    if (this.vifiNotificationList !== undefined && this.vifiNotificationList.length > 0) {
      setTimeout(() => {
        this.vifiNotificationList.forEach(element => {
          // let notifiedImObj ={};
          //notifiedImObj['imageNotified'] = [];
          element['imageNotified'].push('true_' + this.userData.userName);
          this.fireBaseService.updateVifiNotify(element['id'], element);
          return;
        });
      }, 2000);
    }
    this.notifyImPopup = false;
    return;
  }
  async filterList(group) {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 1000
    });
    await loading.present();
    if (group == 'Top Actors') {
      const modal = await this.modalController.create({
        component: FilterListPage,
        componentProps: {
          "paramID": this.topActors,
          "paramTitle": "Test Title"
        }
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {

        }
      });
      return await modal.present();

    }
    if (group == 'Top Actress') {
      const modal = await this.modalController.create({
        component: FilterListPage,
        componentProps: {
          "paramID": this.topActress,
          "paramTitle": "Test Title"
        }
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {

        }
      });
      return await modal.present();

    }
    if (group == 'Top Music Directors') {
      const modal = await this.modalController.create({
        component: FilterListPage,
        componentProps: {
          "paramID": this.topMusic,
          "paramTitle": "Test Title"
        }
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {

        }
      });
      return await modal.present();
    }
    if (group == 'Top Singers') {
      const modal = await this.modalController.create({
        component: FilterListPage,
        componentProps: {
          "paramID": this.topSingers,
          "paramTitle": "Test Title"
        }
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {

        }
      });
      return await modal.present();
    }
    if (group == 'Top DOP') {
      const modal = await this.modalController.create({
        component: FilterListPage,
        componentProps: {
          "paramID": this.topDOPList,
          "paramTitle": "Test Title"
        }
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {

        }
      });
      return await modal.present();
    }
    if (group == 'Top Editor') {
      const modal = await this.modalController.create({
        component: FilterListPage,
        componentProps: {
          "paramID": this.topEditors,
          "paramTitle": "Test Title"
        }
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {

        }
      });
      return await modal.present();
    }
    if (group == 'Top Directors') {
      const modal = await this.modalController.create({
        component: FilterListPage,
        componentProps: {
          "paramID": this.topDirectors,
          "paramTitle": "Test Title"
        }
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {

        }
      });
      return await modal.present();
    }
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
}

export function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
