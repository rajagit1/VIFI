import { Component } from '@angular/core';
import { Config, ModalController, NavParams, ToastController, LoadingController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { UserData } from '../../providers/user-data';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html',
  styleUrls: ['./schedule-filter.scss'],
})
export class ScheduleFilterPage {
  ios: boolean;

  tracks: {name: string, icon: string, isChecked: boolean}[] = [];
  notify: any=[];
  whatsappApprovedNotifyList = {};
  vifiNotificationList:any = [];
  username: string;
  pendingStatus: any;
  approvedOrRejectedStatus:any;
  //actor details
   actors = [];
   topActors = [];
   topActress = [];
   topMusic=[];
   users = [];
   userDetailsData : any[];
   shownSessions: any = [];
   dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  isWaitOver:boolean=false;
  isMobNumberReqWaitOver:boolean=false;
  isVifiNotifyWaitOver:boolean=false;
  inWhichBlock:string='';
  safeURL: any;
  postedStories:any=[];
  isUpdatedOnFlag:boolean=false;
  constructor(
    public confData: ConferenceData,
    private config: Config,
    public userData: UserData,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public router: Router,
    public fireBaseService: FireBaseService,
    public toastCtrl: ToastController,
    private _sanitizer: DomSanitizer,
    public ngFireAuth: AngularFireAuth,
    public loadingCtrl: LoadingController
  ) { }
getUserDetailsData(){
  if(this.username !== undefined && this.username !== ''){
      this.fireBaseService.readActors().subscribe(data => {
        data.map((e: any) => {
          let docData = e.payload.doc.data();
          docData['id'] = e.payload.doc.id;
          docData['storyCount'] = e.payload.doc.data()['associatedStories'].length;
          this.users.push(docData);
        });
        this.userDetailsData = _.filter(this.users, { 'actorName': this.username });
        });
  }
}
  ngOnInit() {
    this.getUserDetailsData();  
    this.getVifiNotifications(); 
    this.userData.getIsVifi().then((isVifi) => {
      this.userData.isVifi = isVifi;
    });
    if(this.vifiNotificationList.length == 0){
        this.isUpdatedOnFlag =false;
    } 
    //this.updateSchedule();
    this.ios = this.config.get('mode') === 'ios';
  }

  async ionViewWillEnter() {     
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 3000
    });
    await loading.present();
    this.safeURL ="";    
    this.confData.isNotificationLabelClicked=false;   
    this.getUserName();    
    this.ios = this.config.get('mode') === `ios`;
    this.fireBaseService.whatsAppNoRequestDetails=[];
    
    setTimeout(() => {

      if(this.userData.userType == 'D'){
                  this.fireBaseService.getWhatappNoRequestedDetails(this.username).subscribe((res:any) =>{
                    
                    this.fireBaseService.whatsAppNoRequestDetails = Array.isArray(res)? res: []; 
                    
                    let whatsappApprovedActors = {};
                    this.whatsappApprovedNotifyList = {};
                    this.approvedOrRejectedStatus = _.filter(this.fireBaseService.whatsAppNoRequestDetails, function (o) { 
                      return o.status !== 'P' && o.notified == false; });
                    this.approvedOrRejectedStatus = _.orderBy(this.approvedOrRejectedStatus, ['updateOn'], ['desc']);  
                    loading.dismiss();
                    this.isMobNumberReqWaitOver=true;    
                    this.inWhichBlock='statusLikes';     
                  
                  });      
        } else{
          this.fireBaseService.getRequestDetails(this.username).subscribe((res:any) =>{
                    
            this.fireBaseService.whatsAppNoRequestDetails = Array.isArray(res)? res: []; 
            
            let whatsappApprovedActors = {};
            this.whatsappApprovedNotifyList = {};
            
            this.pendingStatus = _.filter(this.fireBaseService.whatsAppNoRequestDetails, { 'status': 'P' }); 
            this.pendingStatus = _.orderBy(this.pendingStatus, ['updateOn'], ['desc']);  
            loading.dismiss();
            this.isMobNumberReqWaitOver=true;    
            this.inWhichBlock='statusLikes';  
          });
        }
        
      
      this.fireBaseService.readNoify().subscribe(data => {
        data.map((e: any) => {
          let docData = e.payload.doc.data();
          docData['id'] = e.payload.doc.id;
          this.notify.push(docData);
        });
        
         this.notify.reverse();
        this.notify = [...this.notify];
        this.notify = _.orderBy(this.notify, ['updateOn'], ['desc']);
        this.notify = _.filter(this.notify, { 'storyUploadedBy': this.username,'notified':false }); 
        this.notify = _.uniqBy(this.notify,'msg');
        //this.notify = this.notify ? this.notify.splice(0, 5) : this.notify;
        this.isWaitOver =true;
        this.inWhichBlock='whatsAppNotify';
        
        
      });
      this.notify =[];     
    }, 3000);
    
  }
  getVifiNotifications(){
    this.fireBaseService.getVifiNotifications().subscribe(data => {
                data.map((e: any) => {    
                  let docData =e.payload.doc.data();
                  if(e.payload.doc.data()['video-link'] !=="") { 
                     let profile= e.payload.doc.data()['video-link']?e.payload.doc.data()['video-link'].split('=')[1]:e.payload.doc.data()['video-link'];
                     this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+profile);                            
                  }
          docData['id']=e.payload.doc.id;
          if(this.safeURL!==""){
            docData['safeUrl']=this.safeURL;
          }
          docData['vifi-notify-msg']=e.payload.doc.data()['vifi-notify-msg'];          
          if(e.payload.doc.data()['vifi-notify-msg'] =="" && e.payload.doc.data()['video-link'] ==""){
            this.isUpdatedOnFlag = false;
          }
          else if(e.payload.doc.data()['vifi-notify-msg'] !=="" && e.payload.doc.data()['video-link'] !==""){
            this.isUpdatedOnFlag = true;
          }
          else if(e.payload.doc.data()['vifi-notify-msg'] !=="" && e.payload.doc.data()['video-link'] ==""){
            this.isUpdatedOnFlag = true;
          }
          else if(e.payload.doc.data()['vifi-notify-msg'] =="" && e.payload.doc.data()['video-link'] !==""){
            this.isUpdatedOnFlag = true;
          }
          
          this.vifiNotificationList =_.uniqBy(this.vifiNotificationList, 'id');
          this.vifiNotificationList = _.orderBy(this.vifiNotificationList, ['uploadedOn'], ['desc']);
          
          this.vifiNotificationList.push(docData);
                });
                //raja
            this.vifiNotificationList =_.uniqBy(this.vifiNotificationList, 'id');
            this.isVifiNotifyWaitOver=true;              
          });
          //this.vifiNotificationList =_.uniqBy(this.vifiNotificationList, 'id');
      } 
  async presentToast(msg, type) {
    const toast = await this.toastCtrl.create({
      header: msg,
      duration: 1000,
      position:'middle',
      buttons: [{
        text: 'Close',
        role: 'cancel'
      }]
    });
    toast.present();
  }
  async approve(request){
      const loading = await this.loadingCtrl.create({
      message: 'Loading Stories...',
      duration: 500
      });
      this.fireBaseService.updateWhatsAppNoStatus(request["id"],'A');
      this.presentToast('Your number will be visible to '+request['requestedUserEmail'], 'toast-success');
      this.ionViewWillEnter();
      this.dismiss();
  }
  reject(request){
    this.fireBaseService.updateWhatsAppNoStatus(request["id"],'R');
    this.presentToast('Request has been rejected', 'toast-danger');
      
    this.ionViewWillEnter();
    this.dismiss();
  }
  getUserName() {
    this.userData.getUsername().then((username) => {
      //this.ngFireAuth.onAuthStateChanged((obj)=>{
            if(username){
                    //this.username = obj.email.split('@')[0];
                    this.username = username;
                    if(this.username!==undefined && this.username!==''){
                      this.getUserDetailsData();
                  }
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
  /** doRefresh(obj){
    this.ionViewWillEnter();
    setTimeout(() => {
       
      obj.target.complete();
    }, 300);
  } **/

  selectAll(check: boolean) {
    // set all to checked or unchecked
    this.tracks.forEach(track => {
      track.isChecked = check;
    });
  }
  
  applyFilters() {
    // Pass back a new array of track names to exclude
    const excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.name);  
    this.dismiss(excludedTrackNames);    
    this.updateNotifiedStatus();  
  }
  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  //actor details
  
  async goToDetail(requestEmailId) {
    this.confData.isNotificationLabelClicked = true;
    const loading = await this.loadingCtrl.create({
      message: 'Fetching Director Details...',
      duration: 2000
    });
    await loading.present();
     //Empty the previous values
     if(this.confData.actorData["associatedStories"] || this.confData.actorData["associatedStories"] == undefined || this.confData.actorData["associatedStories"].length>=0){
        this.confData.actorData["associatedStories"]=[];
     }
     const requestedUserName = requestEmailId.split("@")[0];
     this.fireBaseService.filterActors(requestedUserName).get().subscribe( (querySnapshot) =>{
      querySnapshot.forEach( (doc)=> {
       // this.userDetailsData.push(doc.data()); how to handle more than one approvals,so need to concentrate
       this.confData.actorData["image"] =doc.data().image;
       this.confData.actorData["skills"] =doc.data().skills;
       this.confData.actorData["profiles"] =doc.data().profiles;
        //if(this.confData.actorData.userType == 'D'){         
          this.fireBaseService.filterPosts(requestedUserName).get().subscribe( (querySnapshot) =>{
            querySnapshot.forEach( (doc)=> {
              this.postedStories =[]              
              this.postedStories["title"] =doc.data().title;              
              this.postedStories["image"] =doc.data().image;
              this.postedStories["synopsis"] =doc.data().synopsis;
              this.postedStories["likes"] =doc.data().likes;
              this.postedStories["views"] = doc.data().views;
              this.confData.actorData["associatedStories"].push(this.postedStories);
              });
                if(this.confData.actorData['associatedStories'].length >= 0 ){ 
                  this.notify =[];
                  this.confData.isFromPage = 'notification';
                  this.confData.loginUser = this.username;
                  this.applyFilters();
                  this.router.navigateByUrl('/prod-direct-details');
                }
            });
            
       // }else {
         // this.presentToast('No data avilable for this user', 'toast-danger');
       // }
         
      });
    });
    
     
    /**this.fireBaseService.readActors().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        docData['storyCount'] = e.payload.doc.data()['associatedStories'].length;
        this.users.push(docData);
      });
      this.userDetailsData = _.filter(this.users, { 'actorName': requestedUserName });
    }); */
    //this.userDetailsData = _.uniqBy(this.userDetailsData,'actorName');
    //this.confData.actorData = this.userDetailsData;
    //this.confData.isFromPage = 'notification';
    //this.confData.loginUser = this.username;
   // if(this.confData.actorData.length !== 0){    
   //   this.router.navigateByUrl('/actor-details');
    //}
    
  } 
  /**updateSchedule() {
    // Close any open sliding items when the schedule updates
    

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;

    });
  }**/
  updateNotifiedStatus(){   
    if(this.approvedOrRejectedStatus !== undefined) {
        this.approvedOrRejectedStatus.forEach(element => {
          let notifiedObj ={};
          notifiedObj['notified'] = true;
          this.fireBaseService.updateWhatsAppNotifiedStatus(element['id'],notifiedObj);
        });
      }
    this.approvedOrRejectedStatus = [];
  }
  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.notify.forEach(element => {
      element['notified']=true;
      this.fireBaseService.updateNoify(element['id'],element);
    });
    this.notify=[];
    this.tracks =[];
    data['clearNotify']=true;
    this.modalCtrl.dismiss(data);
  }
  //####### Delete option temporarily disabled #####
  deleteVifiNotify(recordId){
    this.fireBaseService.deleteVifiNotify(recordId);    
    this.vifiNotificationList = [];
  }
   
}