import { Component, OnInit } from '@angular/core';

import { PopoverController, ToastController,ModalController,LoadingController } from '@ionic/angular';

import { PopoverPage } from '../about-popover/about-popover';
import { UserData } from '../../providers/user-data';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import { ConferenceData } from '../../providers/conference-data';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AdMobFree,AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { AdManagementPage } from '../ad-management/ad-management.page';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage implements OnInit{
  location = 'madison';
  conferenceDate = '2047-05-17';

  username: string;
  displayName:string;
  posts: any = {};
  email: string;
  actors: any = {};
  storiescount: number = 0;
  postsFilterd: any = [];
  color:any="";
  language:any="";
  height:any="";
  weight:any="";
  actor_img: string = "";
  actress_img: any = "";
  actorName: any = "";
  gender:any ="";
  paidOption:any="";
  actressName: any = "";
  userId: any = "";
  userprofileyoutubeVideo: string;
  totalUsersCount: number =0;
  isYouTubeLinkRequired: boolean = false;
  userType = "";
  p_bar_value: number;
  bannerUnitId:string;
  rewardUnitId:string;
  interstitialUnitId:string;

  constructor(public popoverCtrl: PopoverController, private confData: ConferenceData,private callNumber: CallNumber,
    public userData: UserData, public toastController: ToastController,public loadingCtrl: LoadingController,
    public fireBase: FireBaseService, public router: Router,public modalController : ModalController, private admobFree: AdMobFree,public ngFireAuth: AngularFireAuth) { }

  loginCheck() {
    if (_.isEmpty(this.username)) {
      this.router.navigateByUrl('/signUp');
      return false;
    } else {
      return true;
    }
  }
  navigatetoProfile() {
    this.userData.isFromAbout = true;
    this.userData.aboutData={};
    this.userData.aboutData['gender'] = this.gender;
    this.userData.aboutData['userName']=this.actorName;
    this.userData.aboutData['userImage']=this.actor_img;

    this.userData.aboutData['paidOption'] = this.paidOption;
    this.userData.aboutData['color']=this.color;
    this.userData.aboutData['language']=this.language;
    this.userData.aboutData['weight']=this.weight;
    this.userData.aboutData['height']=this.height;

    this.router.navigateByUrl('/create-actor');
  }
  ngOnInit() {    
        
      this.fireBase.readAdsUnit().subscribe(data => {
        data.map(e => {
          let docData = e.payload.doc.data();
          if(docData['typeofAd'] == 'banner'){
            this.bannerUnitId = docData['unitId'];
          }
          if(docData['typeofAd'] == 'interstitial'){
            this.interstitialUnitId = docData['unitId'];
          }
          if(docData['typeofAd'] == 'rewardVideo'){
            this.rewardUnitId = docData['unitId'];
          }
        });
      });

    this.fireBase.readAdManagement().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        if(docData['screenName']  == 'profile'){
          if(docData['isBannerAdsRequired']){            
            this.showBannerAd();
          }
          if(docData['isInterstitialAdsRequired']){            
          this.showInterstitialAds();
          }
          if(docData['isRewardVideoAdsRequired']){           
          this.showRewardVideoAds(); 
          }
        }
      });
      
    });
  }
  ionViewDidEnter() {    
    this.totalUsersCount =0;
    this.fireBase.getUsersCount().subscribe(data => {
      this.totalUsersCount = data.length;
      /**data.map(e => {   
        console.log(e.payload.doc) ;
      });*/
    });
    
    let networkStatus = (window.navigator.onLine ? 'on' : 'off') + 'line'
    if (networkStatus == 'offline') {
      this.presentToast('No Internet Connection:Please turn on your network connection!', 'toast-danger');
      return;
    }
    this.ngFireAuth.onAuthStateChanged((obj) => {
      if (_.isEmpty(obj)) {
        this.presentToast('Please login/signup to see more!', 'toast-success');
        this.router.navigateByUrl('/signUp');
        return;
      }
    });
    this.confData.isFromPage = "";
    this.actor_img = "";
    this.storiescount = 0;
    this.userData.getRole().then((userType) => {
      this.userData.userType = userType;
    });
    this.userData.getIsVifi().then((isVifi) => {
      this.userData.isVifi = isVifi;
    });
    this.userData.getIsCertified().then((isCertifiedFlag) => {
      this.userData.isCertified = isCertifiedFlag;
    });
    this.postsFilterd = [];
    setTimeout(() => {

      this.userData.getUsername().then((username) => {
        // this.ngFireAuth.onAuthStateChanged((obj)=>{
        if (username) {
          //this.userData.userName = obj.email.split('@')[0]; 
          this.userData.userName = username;
          if(_.isEmpty(this.fireBase.postData)){
           // setTimeout(() => {
                  this.fireBase.readPosts().subscribe(data => {
                    data.map(e => {
                      this.posts.push(e.payload.doc.data()); 
                    });
                  });  
           // }, 200);  
          }else{
            this.posts = this.fireBase.postData; 
          }
          this.posts = _.uniqBy(this.posts, 'title');
          this.actors = this.fireBase.actorRef;
          this.postsFilterd = _.filter(this.posts, { 'uploadedBy': this.username });
          //let postedcount = 0;
          /**  this.posts.forEach(obj => {
             if (null !== obj['uploadedBy'] &&  
                 obj['uploadedBy'].indexOf(this.username) >= 0) {
               postedcount++;
             }
           }); */
          //this.postsFilterd = postedcount;
          this.email = this.userData.email;
          let likedStroies = 0;
          this.posts.forEach(obj => {
            if (obj['likes'].indexOf(this.username) >= 0) {
              likedStroies++;
            }
          });
          this.storiescount = likedStroies;
        } else {
          this.presentToast('Please login/signup to see more!', 'toast-success');
          this.router.navigateByUrl('/signUp');
        }
      });
    }, 200);
    this.getUserAndActorDetails();
    this.username = this.userData.userName;    
    this.fireBase.filterActorByName(this.username).then(element => {
      this.confData.actorData = {};
      this.confData.actorData = element['docs'][0].data();
      this.displayName = this.confData.actorData.displayName;
      const totalRequiredFieldsForCast : number = 8;
      const countOfRequiredFields : any = this.getCountOfRequiredFields(element['docs'][0].data());
      let p = (100 * countOfRequiredFields) / totalRequiredFieldsForCast;
      this.userData.profilecompletionPercentage = p/100;
    });
    
  }
  getCountOfRequiredFields(obj){
    let totalRequiredFieldsCount : number = 0;
    if(obj.age){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.color){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.displayName){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.height){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.weight){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.language){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.paidOption){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.experience){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    return totalRequiredFieldsCount;
  }
  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event
    });
    await popover.present();
  }
  navigationPostedStoriesPage() {
    this.confData.isFromPage = "profile"
    this.router.navigateByUrl('/app/tabs/speakers');
  }
  navigationFavourtiesPage() {
    this.confData.isFromPage = "profile"
    this.router.navigateByUrl('/app/tabs/map');
  }
  logout() {
    return this.ngFireAuth.signOut().then(() => {
      //this.userData.logout().then(() => {
      this.userData.email = "";
      this.userData.userType = "";
      this.userData.userName = "";
      this.actor_img = "";
      this.actress_img = "";
      this.userId = "";
      this.postsFilterd = [];
      this.isYouTubeLinkRequired = false;
      this.userData.setUsername('');
      this.userData.setDisplayName('');
      this.userData.setIsVifi(false);
      this.userData.setIsCertified(false);
      this.confData.actorData={};
      localStorage.clear();
      sessionStorage.clear();
      return this.router.navigateByUrl('/signUp');
    });
   
  }

  isyoutubeLinkReq() {
    this.isYouTubeLinkRequired = true;
  }
  updateYoutueVideo() {
    let usrObj = {};
    const yotubeLink = this.parseVideo(this.userprofileyoutubeVideo);
    if (yotubeLink) {
      usrObj['profiles'] = 'https://www.youtube.com/watch?v=' + yotubeLink;
      this.fireBase.updateYoutubeLink(this.userId, usrObj);
      this.userprofileyoutubeVideo = "";
      this.presentToast('Your video has been updated', 'toast-success');
    } else {
      this.presentToast('Please provide valid youtube url.Example.[https://www.youtube.com/watch?v=zls4a7I_qaM]', 'toast-danger');
      return;
    }


  }
  parseVideo(url) {
    var re = /\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_\-]+)/i;
    var matches = re.exec(url);
    return matches && matches[1];
  }

  async presentToast(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: type,
      duration: 1500,
      position: 'middle'
    });
    toast.present();
  }
  getUserAndActorDetails() {
    this.userData.getUsername().then((username) => {
      //this.ngFireAuth.onAuthStateChanged((obj)=>{
      if (username) {
        //this.username = obj.email.split('@')[0];
        this.username = username;
        if (this.username !== "") {
          setTimeout(() => {
            this.readActors();
          }, 200);
        }
      } else {
        this.loginCheck();
      }

    });

  }
  readActors() {
    this.fireBase.readActors().subscribe(data => {
      data.map((e: any) => {
        let docData = e.payload.doc.data();

        docData['id'] = e.payload.doc.id;
        if (this.userData.userName !== undefined && docData['actorName'] === this.userData.userName) {
         
          this.paidOption = docData['paidOption'];
          this.color = docData['color'];
          this.language = docData['language'];
          this.height = docData['height'];
          this.weight = docData['weight'];

          this.userType = docData['userType'];
          this.actor_img = docData['image'];
          this.actorName = docData['actorName'];
          this.gender = docData['gender'];
          this.userId = e.payload.doc.id;
        } else {
          if (this.userData.userName == undefined || this.actor_img == "")
            this.actor_img = '../../assets/icons/profile.png';
        }
      });
    });
  }
  async goToVifiNotification() {
    this.router.navigateByUrl('vifi');
  }
  async navigationMapTechniciansPage(obj) {
    this.confData.routingData = this.posts;
    this.confData.isFromPage = "profile"
    this.router.navigateByUrl('mapTechnicians');
  }
  
  async callNow(mobNum) {
    let userInfo = [];
    const loading = await this.loadingCtrl.create({
      message: 'Connecting...',
      duration: 2000
    });
    await loading.present();              
    this.showdialer('+91 '+mobNum);
    loading.onWillDismiss(); 
  }
  showdialer(data) {
    this.callNumber.callNumber(data, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  showDetail() {
     if(this.userData.userName){          
          this.router.navigateByUrl('/actor-details');
        }else{
          this.presentToast('Please login/signup to see more!','toast-success');
          this.router.navigateByUrl('/signUp'); 
        }
  }
  runDeterminateProgress(val) {

    for (let index = 0; index <= val; index++) {
      this.setPercentBar(+index);
    }
  }
  setPercentBar(i) {
    setTimeout(() => {
      let apc = (i / 100)
      this.p_bar_value = apc;

    }, 140 * i);
  }
   //Google ads iplementation starts
   showBannerAd() {
    let bannerConfig: AdMobFreeBannerConfig = {
        isTesting: true, // Remove in production
        autoShow: true,
        id : this.bannerUnitId
        //id: "ca-app-pub-7771494690888171/4926625794"
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare().then(() => {          
    }).catch(e => console.log(e));
}



showInterstitialAds(){
    let interstitialConfig: AdMobFreeInterstitialConfig = {
        isTesting: true, // Remove in production
        autoShow: true,
        id:this.interstitialUnitId
        //id: "ca-app-pub-7771494690888171/6978074061"
    };
    this.admobFree.interstitial.config(interstitialConfig);
    this.admobFree.interstitial.prepare().then(() => {        
    }).catch(e => console.log(e));
}

showRewardVideoAds(){
    let RewardVideoConfig: AdMobFreeRewardVideoConfig = {
        isTesting: true, // Remove in production
        autoShow: true,
        id:this.rewardUnitId
        //id: "ca-app-pub-7771494690888171/2380353503"
    };
    this.admobFree.rewardVideo.config(RewardVideoConfig);
    this.admobFree.rewardVideo.prepare().then(() => {       
    }).catch(e => console.log(e));
} 

async goToAdMgmt(){
  const modal = await this.modalController.create({
    component: AdManagementPage,
    componentProps: {
      "paramID": "",
      "paramTitle": "Test Title"
    }
  });
  modal.onDidDismiss().then((dataReturned) => {
    if (dataReturned !== null) {
      
    }
  });
  return await modal.present();
  //this.router.navigateByUrl('/ad-management');
}

}
