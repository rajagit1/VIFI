import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ConferenceData } from '../../providers/conference-data';
import { FireBaseService } from '../../services/firebase.service';
import { TitleCasePipe } from '@angular/common';
import * as _ from "lodash";
import * as moment from 'moment';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { UserData } from '../../providers/user-data';
import { ActivityCommentsPage } from '../activity-comments/activity-comments.page';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { ThrowStmt } from '@angular/compiler';
import { UserdetailsPopupPage } from '../userdetails-popup/userdetails-popup.page';
@Component({
  selector: 'app-actordetails-popup',
  templateUrl: './actordetails-popup.page.html',
  styleUrls: ['./actordetails-popup.page.scss'],
})
export class ActordetailsPopupPage implements OnInit {

  
  //safeURL: any;
  slideOptsOne = {
    initialSlide: 0,
    isEndSlide: false,
    slidesPerView: 1,
    isBeginningSlide: false,
    autoplay: false,
    slideShadows: true,
    onlyExternal: true,
    pager: false
  };
  safeURLs = [];
  heartClass: string;
  actorData: any;
  currentUserData:any;
  p_bar_value1: number;
  postData: any = {};
  isLoaded: boolean = false;
  userprofileName: string = ""
  storyCount: number;
  associatedStories = [];
  defaultHref = '/app/tabs/schedule';
  segment = "video";
  disablePrevBtn = true;
  disableNextBtn = false;

  @ViewChild('slideWithNav', { static: false }) ionSlides: IonSlides;

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
    }
  ];
  tabType: string = "video";
  docId: string;
  imageList: any;
  postComment: string = "";
  userName: any;
  currentImageIndex: any;
  loadingProgress: any;
  commentsObj: any[];
  constructor(public router: Router,
    public userData: UserData,
    private youtube: YoutubeVideoPlayer,
    private confData: ConferenceData,
    private firebase: FireBaseService,
    public ngFireAuth: AngularFireAuth,
    public toastController: ToastController,
    private titlecasePipe: TitleCasePipe, public modalController: ModalController,
    private _sanitizer: DomSanitizer, private loadingCtrl: LoadingController, ) {

  }
  ngOnInit() {
    this.loginCheck();
    //this.trackVisitor(this.actorData);
    this.imageList = [];
    this.actorData = this.confData.actorData;
    this.showImages();
    this.commentsObj = [];
    this.tabType = "video";
    setTimeout(() => {
      this.fetchComments(this.actorData['actorName']);
    }, 1000);
  }
  trackVisitor(obj){
    let trackVisitors= {};
    
    //setTimeout(() => {
          this.firebase.filterActorByName(this.userData.userName).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
                const id =this.actorData.id;
                const dispName = element['docs'][0].data().displayName;
                const actorName = element['docs'][0].data().actorName;
                trackVisitors['visitorsName'] = this.actorData.visitorsName;  
                trackVisitors['visitorsName'].push(actorName);           
                //const userType = element['docs'][0].data().gender === 'M'? 'Actor' :element['docs'][0].data().gender === 'F'? 'Actress':element['docs'][0].data().gender === 'CHORGR_M'? 'Male Choreographer':element['docs'][0].data().gender === 'CHORGR_F'? 'Female Choreographer':element['docs'][0].data().gender === 'DOP_F'? 'Cinematography Female':element['docs'][0].data().gender === 'DOP_M'? 'Cinematography Male':element['docs'][0].data().gender === 'Director_F'? 'Director Female':element['docs'][0].data().gender === 'Director_M'? 'Director(Male)':element['docs'][0].data().userType === 'EQMT'? 'Equipment Company':element['docs'][0].data().gender === 'Editor_M'? 'Editor Male':element['docs'][0].data().gender === 'Editor_F'? 'Editor Female':element['docs'][0].data().gender === 'Music_F'? 'MusicDirector Female':element['docs'][0].data().gender === 'Music_M'? 'MusicDirector Male':element['docs'][0].data().gender === 'Producer_F'? 'Producer Female':element['docs'][0].data().gender === 'Producer_M'? 'Producer Male':element['docs'][0].data().gender === 'SA_F'? 'Supporting Artist Female':element['docs'][0].data().gender === 'SA_M'? 'Supporting Artist Male':element['docs'][0].data().userType === 'STUD'? 'Dubbing & SFX Studio':element['docs'][0].data().gender === 'Singer_F'? 'Singer Female':element['docs'][0].data().gender === 'Singer_M'? 'Singer Male':element['docs'][0].data().gender === 'Viewer_F'? 'Viewer Female':element['docs'][0].data().gender === 'Viewer_M'? 'Viewer Male':element['docs'][0].data().gender === "Viewer_F"? 'Viewer Female':'Other';
                const userType = element['docs'][0].data().gender === 'M'? 'Actor' :element['docs'][0].data().gender === 'F'? 'Actress':element['docs'][0].data().gender === 'CHORGR_M'? 'Choreographer(Male)':element['docs'][0].data().gender === 'CHORGR_F'? 'Choreographer(Female)':element['docs'][0].data().gender === 'DOP_F'? 'Cinematography(Female)':element['docs'][0].data().gender === 'DOP_M'? 'Cinematography(Male)':element['docs'][0].data().gender === 'Director_F'? 'Director(Female)':element['docs'][0].data().gender === 'Director_M'? 'Director(Male)':element['docs'][0].data().userType === 'EQMT'? 'Equipment Company':element['docs'][0].data().gender === 'Editor_M'? 'Editor(Male)':element['docs'][0].data().gender === 'Editor_F'? 'Editor(Female)':element['docs'][0].data().gender === 'Music_F'? 'Music Director(Female)':element['docs'][0].data().gender === 'Music_M'? 'Music Director(Male)':element['docs'][0].data().gender === 'Producer_F'? 'Producer(Female)':element['docs'][0].data().gender === 'Producer_M'? 'Producer(Male)':element['docs'][0].data().gender === 'SA_F'? 'Supporting Artist(Female)':element['docs'][0].data().gender === 'SA_M'? 'Supporting Artist(Male)':element['docs'][0].data().userType === 'STUD'? 'Dubbing & SFX Studio':element['docs'][0].data().gender === 'Singer_F'? 'Singer(Female)':element['docs'][0].data().gender === 'Singer_M'? 'Singer(Male)':element['docs'][0].data().gender === 'Viewer_F'? 'Viewer(Female)':element['docs'][0].data().gender === 'Viewer_M'? 'Viewer(Male)':element['docs'][0].data().gender === "DUB_M"? 'Dubbing Artist(Male)':element['docs'][0].data().gender === "DUB_F"? 'Dubbing Artist(Female)':element['docs'][0].data().gender === "AD_M"? 'Assistant Director(Male)':element['docs'][0].data().gender === "AD_F"? 'Assistant Director(Female)':element['docs'][0].data().gender === "SW_F"? 'Script Writer(Female)':element['docs'][0].data().gender === "SW_M"? 'Script Writer(Male)':'Other';
                let val = id+'***@@@shirdi&&&saibaba@@@^^^!!!'+dispName+'***@@@shirdi&&&saibaba@@@^^^!!!'+actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().image+'***@@@shirdi&&&saibaba@@@^^^!!!'+userType;
                  
                  //trackVisitors['visitors'] = [];
                  trackVisitors['visitors'] = this.actorData.visitors;
                  trackVisitors['visitors'].push(val);                 
                  this.firebase.trackVisitors(id,trackVisitors);
            }
          });
      // }, 1000);
    
  }
  ionViewDidEnter() {
    
   let newVisitor :any;
    this.commentsObj = [];
    this.imageList = [];
    this.actorData = this.confData.actorData;
     if(this.actorData['visitorsName'].indexOf(this.userData.userName) <= -1) {
        //newVisitor = this.userData;
        this.trackVisitor(this.userData);
      }
     /**  
     if(newVisitor){
        this.trackVisitor(newVisitor);
     }*/
    //Visitors tracking ends
    this.loginCheck();
    this.showImages();

    this.ngFireAuth.onAuthStateChanged((obj) => {
      if (_.isEmpty(obj)) {
        this.presentToast('Please login/signup to see more!', 'toast-success');
        this.router.navigateByUrl('/signUp');
        return;
      }
    });
    this.firebase.filterActorByName(this.userData.userName).then(element => {
      if(!(_.isEmpty(element['docs'][0].data().actorName))){
      this.currentUserData = {};
      this.currentUserData = element['docs'][0].data();
      }
    });
    
    this.transformName();
    this.postData = this.firebase.postData;
    //let profile=this.actorData.profiles?this.actorData.profiles.split('=')[1]:this.actorData.profiles;
    //this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+profile);
    this.safeURLs = [];
    this.actorData.profilesArray.forEach( (element) => {
      let profile=element?element.split('=')[1]:element;
      this.safeURLs.push(this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+profile));
   });
     this.runDeterminateProgress();
    this.filterStories();
    this.showSkeltonLoading();
    setTimeout(() => {
      this.fetchComments(this.actorData['actorName']);
    }, 1000);
  }
  async saveComments(obj) {
    let postObj = {};
    postObj['actorId'] = this.actorData.actorName;
    //postObj['imagePosition'] = this.currentImageIndex;
    if(!(_.isEmpty(this.postComment))){
         postObj['commentText'] = this.postComment;
    }else{
      this.presentToast("Comment cannot be empty","danger");
      return;
    }
    postObj['uploadedBy'] = this.currentUserData.actorName;
    postObj['uploadedOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
    if(this.currentUserData.image !=='' || this.currentUserData.image !== undefined){
           postObj['thumnail'] = this.currentUserData.image;
    }
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Saving your comments..',
      duration: 200
    });
    await this.loadingProgress.present();
    this.firebase.createActorComment(postObj).then(creationResponse => {
      if (creationResponse != null) {
        this.postComment = "";
        this.fetchComments(this.userName);
      }
    })
      .catch((error) => this.presentToast(error.message, 'toast-danger'));
  }
  fetchComments(userName) {

    this.commentsObj = [];
    let pageIndex = this.currentImageIndex;
    this.firebase.readCommentsActors(this.actorData['actorName']).then(element => {
     /**  this.firebase.readActorsProfileComments().subscribe(data => {
        data.map(e => {
          let docData = e.payload.doc.data();*/
                        if (!_.isEmpty(element['docs'])) {
                          element['docs'].forEach(arg => {
                            this.commentsObj.push(arg.data());
                          });                         
                        }
                      });
            //});  
    /**setTimeout(() => {
      this.commentsObj = _.filter(this.commentsObj, { 'imagePosition': pageIndex });
    }, 1000); */

  }
  showDetail() {
    this.confData.actorData = {};
    this.confData.actorData = this.currentUserData;
    //this.confData.isFromPage = "activity-comments";
    this.router.navigateByUrl('actor-details');
    //this.dismiss(this.confData.actorData); 
  }
  dismiss(data?: any) {   
    this.modalController.dismiss(null); 
    //this.modalController.dismiss(data);
  }
  async showUserDetails(){

    const modal = await this.modalController.create({
      component: UserdetailsPopupPage,
      componentProps: {
        "paramID": this.actorData,
        "paramTitle": "Test Title"
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        
      }
    });
    return await modal.present();
  }
  showImages() {
    this.imageList = [];
    this.firebase.filterActors(this.actorData.actorName).get().subscribe((querySnapshot) => {
      this.imageList = [];
      querySnapshot.forEach((doc) => {
        this.docId = doc.id;
        let actorObj = doc.data();

        if (!_.isEmpty(actorObj['imageArray'])) {

          actorObj['imageArray'].forEach((element, idx) => {
            if (idx < 5) {
              this.imageList.push(element);
            }
          });
        }


      });

    });

  }
  filterStories() {
    this.storyCount = 0;
    this.postData.forEach(element => {
      if (this.actorData['associatedStories'].indexOf(element['id']) >= 0) {
        this.associatedStories.push(element);
      }
    });
    this.storyCount = this.actorData['associatedStories'].length;
    this.associatedStories = _.uniqBy(this.associatedStories, 'title');
  }
  showSkeltonLoading() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 1000);
  }
  runDeterminateProgress() {

    for (let index = 0; index <= 100; index++) {
      this.setPercentBar(+index);
    }
  }

  setPercentBar(i) {
    setTimeout(() => {
      let apc = (i / 100)

      this.p_bar_value1 = apc;

    }, 30 * i);
  }
  async logout() {
    if (this.confData.isFromPage == 'activities') {
      this.router.navigateByUrl('/app/tabs/daily-activities');
      this.actorData = {};
    }
    else if (this.confData.isFromPage == 'activity-comments') {
      //this.modalController.dismiss();
      this.router.navigateByUrl('/app/tabs/daily-activities');
      this.actorData = {};
    }
    else {
      this.router.navigateByUrl('/app/tabs/schedule');
      this.actorData = {};
    }
  }
  transformName() {
    this.userprofileName = this.titlecasePipe.transform(this.actorData.displayName);
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
  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  changeCategory(ev) {
    this.segment = ev.detail.value;
    if(this.segment =='image'){
      this.tabType = 'image';
    }else{
      this.tabType = 'video';
    }
    this.isLoaded = false;
    this.showSkeltonLoading();
    this.showImages();
    setTimeout(() => {
      this.fetchComments(this.actorData['actorName']);
    }, 1000);
  }
  loginCheck() {
    if (_.isEmpty(this.userData.userName)) {

      this.router.navigateByUrl('/signUp');
      return false;
    } else {
      this.userName = this.userData.userName;
      return true;
    }
  }
  goToDetail(arg) {
    if (arg !== null) {
      this.confData.routingData = arg;
      this.confData.isFromPage = 'actor-details';
      setTimeout(() => {
        this.userData.getUsername().then((username) => {
          if (username) {
            this.userData.userName = username;
          }
        });
      });
      if (this.loginCheck()) {
        this.router.navigateByUrl('/app/tabs/speakers/speaker-details');
      } else {
        this.presentToast('Please login/signup to see more!', 'toast-success');
        this.router.navigateByUrl('/signUp');
      }
      //});
      // }
    }
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
    slideView.getActiveIndex().then((val) => {
      this.currentImageIndex = val;
      this.postComment = "";
      this.fetchComments(this.userName);

    });
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
  next() {
    this.ionSlides.slideNext();
  }

  prev() {
    this.ionSlides.slidePrev();
  }
  isAlreadyLiked(obj) {
    if (obj['likes'].indexOf(this.userData.userName) >= 0) {
      this.heartClass = "heart-cls-red";
      this.presentToastForLike("Already Liked",'toast-success');
      return;
    } else {
      this.heartClass = "heart-cls-red";
      this.changeClass(obj);
    } 
}
updateViewCount(obj) {
  if (obj['views'] != undefined) {
    obj['views'] = obj['views'] + 1;
  }
  //this.fireBaseService.updatePost(obj['id'], obj);
}
changeClass(obj) {    
  let likes = {};
  likes['id'] = obj['id']
  likes['likes'] =obj.likes;
  likes['likes'].push(this.userData.userName);
  this.heartClass = "heart-cls-red";
  this.firebase.addLikesForActorProfile(likes);
}
async presentToastForLike(msg, type) {
  const toast = await this.toastController.create({
    message: msg,
    cssClass: type,
    duration: 500,
    position: 'middle'
  });
  toast.present();
}

}
