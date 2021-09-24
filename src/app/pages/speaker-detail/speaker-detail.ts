import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ConferenceData } from '../../providers/conference-data';
import { ActionSheetController, LoadingController, ToastController, IonButton, AlertController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as moment from 'moment';
import { FireBaseService } from '../../services/firebase.service';
import { UserData } from '../../providers/user-data';
import { ModalController } from '@ionic/angular';
import { ActorAddPage } from '../../modals/actor-add/actor-add.page';
import * as _ from "lodash";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GoogleChartInterface } from 'ng2-google-charts';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { TechnicianDetailsPage } from '../../modals/technician-details/technician-details.page';
@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'speaker-detail.html',
  styleUrls: ['./speaker-detail.scss'],
})
export class SpeakerDetailPage {
  speaker: any;
  @ViewChild('ref', { static: false }) pRef: IonButton;
  @ViewChild('ref2', { static: false }) pRef1: IonButton;
  @ViewChild('synopsisPara', {static: false}) synopsisPara;

  myData = [
    ['London', 8136000],
    ['New York', 8538000],
    ['Paris', 2244000],
    ['Berlin', 3470000],
    ['Kairo', 19500000]
  ];
  isSubscribed:boolean=false;
  subsctionCount:number =0;
  postData: any;
  showPost: boolean = false;
  showfull: boolean = true;
  defaultHref: string = "/app/tabs/speakers";
  p_bar_value1: number;
  p_bar_value2: number;
  liked: boolean = false;
  mode: string = "story";
  heartClass: string;
  username: string;
  showActor: string;
  hasActor: boolean = false;
  isSynopsisEdit:boolean = false;
  dataReturned: any;
  userExist: boolean = false;
  showprice: boolean = false;
  actor_img: string = "";
  actress_img: any = "";
  actorName:any="";
  actressName:any="";
  maleSingerName='';
  maleSingerImg='';
  femaleSingerName='';
  femaleSingerImg='';
  musicdirectorName:any="";
  music_dir_img: any = "";
  male_singer_img:any="";
  female_singer_img:any="";
  isLoaded: boolean = false;
  budget: number = 0;
  postUploadedBy: any = "";
  isBlinkRequired:boolean=false;
  isSingleFundedByVisible:boolean=true;
  isEditRequired:boolean=false;
  isSaveRequired:boolean=false;
  isMapped: boolean = false;
  querySnapshotStatus:boolean = false;
  postedStories:any=[];  
  totalActorsList:any=[];
  subscriptionId:any="";
  storyStatus:string="waitingForFund";
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

  fundType: any;
  showFundDetails: boolean = false;
  userType: string;
  showFinalPriceonSave: boolean = false;
  totalFund: number;

  roundoff: number;



  constructor(
    private dataProvider: ConferenceData,
    private route: ActivatedRoute,
    public router: Router,
    public toastController: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public confData: ConferenceData,
    public inAppBrowser: InAppBrowser,
    public userData: UserData,
    public firebaseService: FireBaseService,
    public modalController: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private http: HttpClient,
    private callNumber: CallNumber,
    public ngFireAuth: AngularFireAuth,
    private localNotifications: LocalNotifications
  ) {

  }
  segmentChanged(obj) {

  }
  showSkeltonLoading() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 1400);
  }
  getUserName() {
    this.userData.getUsername().then((username) => {
      //this.ngFireAuth.onAuthStateChanged((obj)=>{
        if(username){
          //this.username = obj.email.split('@')[0];
              this.username =  username;
              if (this.username == undefined) {
                this.username = this.userData.userName;
              }
      }else{  
         this.loginCheck();
      }
    });

  }
  
  callService(storyId) {

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
    this.fetchTicketGenerated(storyId);
  }
  fetchTicketGenerated(storyId) {
    let alreadyBooked = [];
      this.firebaseService.filterTicket(this.username).get().subscribe(async function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (storyId == doc.data()['storyId']) {
            alreadyBooked.push(doc.data());
          }
          sessionStorage.setItem('alreadyBooked', JSON.stringify(alreadyBooked));

        });
      });

  }
  showPriceField() {
    this.showprice = true;
  }
  async choiceSavedpresentToast(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: type,
      duration: 1500,
      position: 'middle'
    });
    toast.present();
  }
  async presentToastForContribution(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: type,
      duration: 1000,
      position: 'middle'
    });
    toast.present();
  }
  async presentToast(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: type,
      duration: 3500,
      position: 'middle'
    });
    toast.present();
  }
  async updatePrice() {  
    
    let alreadyFunded = false;
    if(this.budget !== 0  && this.budget !== null && this.budget !== undefined){
          this.postData['fundedBy'].forEach(element => {
            if (element.split('_')[0] === this.username) {
              this.presentToast('Already Funded..', 'toast-danger');
              alreadyFunded = true;
              return false;
            }
          });
          if (alreadyFunded) {
            return false;
          }
        }else{
          this.presentToast('Please enter valid amount', 'toast-danger');          
          return;
        }
    const loading = await this.loadingCtrl.create({
          message: 'Updating Budget...',
          duration: 3000
        });
        await loading.present();
    let temPostDataSingleFund = this.postData;
    if (this.postData['fundType'] == 1) {
      if (this.postData['budget'] <= this.budget) {        
        this.postData['fundedBy'].push(this.username + '_' + this.budget);
        let totalSingleFund = 0;
        this.isSingleFundedByVisible=true;
        this.pRef['el']['hidden'] = true;
        this.showFinalPriceonSave = true;
        //this.showprice = false;
        this.postData['storyStatus']="pendingWithDirector";
        //temPostDataSingleFund['shooting'] = true;
        this.postData['fundedBy'].push(this.username + '_' + this.budget);        
        this.postData['fundedBy'] = _.uniqBy(this.postData['fundedBy'],'fundedBy');
        this.firebaseService.updatePost(this.postData['id'], temPostDataSingleFund);
        //loading.onWillDismiss();   
        loading.dismiss();     
        this.presentToast('Fund limit reached', 'toast-success');
      }else{
        this.postData['storyStatus']="waitingForFund";
        this.isSingleFundedByVisible=false; this.pRef['el']['hidden'] = false;
        this.showFinalPriceonSave = false;
        this.showprice = true;
        temPostDataSingleFund['shooting'] = false; 
        //loading.onWillDismiss();
        loading.dismiss(); 
        this.presentToast('This is single fund film.so you cannot enter partial amount', 'toast-danger');
        return ;
      }
     
    }
    let temPostData = this.postData;
    //this.postData['fundedBy'].push(this.username + '_' + this.budget);
   
    if (this.postData['fundType'] == 2) {      
      let totalCrowdFund = 0;
      this.postData['fundedBy'].forEach(element => {
        if (element.split('_')[1] != undefined) {
          totalCrowdFund += Number(element.split('_')[1]);
        }
      });
      temPostData['shooting'] = false;
      if((Number(totalCrowdFund) + Number(this.budget)) > this.postData['budget']) {
        this.choiceSavedpresentToast('Cannot enter exceed amount', 'toast-danger');
        loading.dismiss();
        return;
      }else{
        totalCrowdFund +=this.budget;
        this.postData['fundedBy'].push(this.username + '_' + this.budget);
      }
      if (this.postData['budget'] <= totalCrowdFund) {  
        this.isBlinkRequired = false; 
        //Temporarily mail processing is on hold
        //if (this.username != '') {
        //  let emailUrl = "https://us-central1-app-direct-a02bf.cloudfunctions.net/sendMail?dest=" + this.postUploadedBy;
        //  emailUrl = emailUrl + '&body=<b>' + this.username + '</b> shown interest on your story. <br> Story is moved to <b>READY TO SHOOT</b> Queue.<br> For more details Contact<br> Email -' + this.userData.email + ' Mobile # -' + this.userData.userMob
        //  this.callService(emailUrl);
       // }
        this.pRef['el']['hidden'] = true;
        this.showFinalPriceonSave = true;
        //this.showprice = false;
        this.postData['storyStatus']="pendingWithDirector";
        //temPostData['shooting'] = true;
        //this.postData['fundedBy'].push(this.username + '_' + this.budget);
        //this.postData['fundedBy'] = _.uniqBy(this.postData,'fundedBy');
        this.firebaseService.updatePost(this.postData['id'], temPostData);
        //loading.onWillDismiss();
        loading.dismiss();
        this.presentToast('Fund limit reached', 'toast-success');
        return ;                
      } else if (this.postData['budget'] >= totalCrowdFund) {
        this.postData['storyStatus']="waitingForFund";
        this.isBlinkRequired = true;
        this.showprice = true;
        //this.postData['fundedBy'].push(this.username + '_' + this.budget);
        this.firebaseService.updatePost(this.postData['id'], temPostData);
        //loading.onWillDismiss();
        loading.dismiss();
        if(totalCrowdFund !== 0){
          this.presentToastForContribution('Your contribution added successfully', 'toast-success');
          this.showprice = false;
        }
        this.showPopupForRemainigAmount(totalCrowdFund);        
      }
    }
    this.firebaseService.updatePost(this.postData['id'], this.postData);
    let notify = {};
    notify['uploadedBy'] = this.username;
    notify['updateOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
    notify['title'] = this.postData['title'];
    notify['type'] = 'shooting';
    notify['msg'] = this.postData['title'] + "is Moved to READY TO SHOOT" + " " + "By " + this, this.username;
    this.pRef['el']['hidden'] = true;
    this.showFinalPriceonSave = true;
    //this.showprice = false;
    this.budget = 0;
    //loading.onWillDismiss();
    loading.dismiss();
    //this.presentToast('Fund Details Updated', 'toast-success');

  }
  async showPopupForRemainigAmount(total) {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      //message: 'Your contribution added.   ' + Number(this.postData['budget'] - total),
      message: 'Your contribution added.',
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary',
          handler: async () => {
            this.totalFund = total;
            if(this.totalFund !== 0){
              this.showprice = false;
              //The below lines commented since progress disable for timing.
                let p = total / this.postData['budget'];
                this.roundoff = p * 100;
                this.roundoff = Math.floor(this.roundoff);
                this.runDeterminateProgress(this.roundoff);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  getStatus(obj) {
    if (obj['likes'].indexOf(this.username) >= 0) {
      return true;
    } else {
      return false;
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
      this.p_bar_value1 = apc;

    }, 140 * i);
  }

  changeClass(obj) {
    
    let notify = {};
    if (obj['likes'] && obj['likes'].indexOf(this.username) < 0) {
      obj['likes'].push(this.username);
      this.heartClass = "heart-cls-red";
      notify['type'] = 'liked';
    }
    //Disliked functionality temporarily commented & whenever required we can uncomment the below
    /**else if (obj['likes'] && obj['likes'].indexOf(this.username) >= 0) {
      let idx = obj['likes'].indexOf(this.username);
      obj['likes'].splice(idx, 1);
      this.heartClass = "heart-cls-white";
      notify['type'] = 'disliked';
    }  **/
    if (obj['likes'].indexOf(undefined) >= 0) {
      obj['likes'].splice(obj['likes'].indexOf(undefined), 1);
    }
    this.firebaseService.updatePost(obj['id'], obj);



    notify['uploadedBy'] = this.username;
    notify['updateOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
    notify['title'] = obj['title'];
    notify['particularUserId'] = this.username;
    notify['storyId'] = obj['id'];
    notify['storyUploadedBy'] = obj['uploadedBy'];
    notify['msg'] = this.postData['title'] + " is " + notify['type'] + " " + "By " + this.username;
    notify['notified']=false;
    this.firebaseService.createNotify(notify).then(creationResponse => {
      if (creationResponse != null) {

      }
    })
      .catch(error => this.presentToast('Network/Server may slow.Please try after sometime...!', 'toast-danger'));
  }
  setClass(obj) {
    if (obj['likes'] && obj['likes'].indexOf(this.username) >= 0) {
      this.heartClass = "heart-cls-red";
    } else if (obj['likes'] && obj['likes'].indexOf(this.username) < 0) {
      this.heartClass = "heart-cls-white";
    }
  }
  checkActor(data) {

    if (data['actors'] && data['actress'] && data['actors'].length == 0 && data['actress'].length == 0) {
      this.hasActor = false;
    } else {
      this.userExist = false;
      if (data['actors'] && data['actress']) {
        data['actors'].forEach(element => {
          //if (element && element.split('_')[1] && element.split('_')[1].indexOf(this.username) >= 0) {
            //IF user already exist you have done mapping messae will be shown
            if (element && element.split('_')[1] && element.split('_')[1].indexOf(this.username) == 0) {
            
            this.userExist = true;
          }
        });
      }
      this.hasActor = true;
      
    }
  }
  checkActorAssociations(arg) {
    if(arg['actors'] !== undefined){
      arg['actors'].forEach(element => {
        if (element && element.split('_')[1] == this.userData.userName) { 
          this.firebaseService.filterActorById(element.split('_')[0]).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){       
                 
                    this.actor_img = element['docs'][0].data().image;
                    this.totalActorsList.push(element['docs'][0].data().image+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().displayName+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().gender+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().age+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().experience);
                  
                   }
              
              });  
        }
      });
  }
  if(arg['actress'] !== undefined){
    arg['actress'].forEach(element => {
      if (element && element.split('_')[1] == this.userData.userName) { 
        this.firebaseService.filterActorById(element.split('_')[0]).then(element => {
          if(!(_.isEmpty(element['docs'][0].data().actorName))){       
               
                  this.actor_img = element['docs'][0].data().image;
                  this.totalActorsList.push(element['docs'][0].data().image+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().displayName+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().gender+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().age+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().experience);
                
                 }
            
            });  
      }
    });
}
if(arg['music'] !== undefined){
  arg['music'].forEach(element => {
    if (element && element.split('_')[1] == this.userData.userName) { 
      this.firebaseService.filterActorById(element.split('_')[0]).then(element => {
        if(!(_.isEmpty(element['docs'][0].data().actorName))){       
             
                this.actor_img = element['docs'][0].data().image;
                this.totalActorsList.push(element['docs'][0].data().image+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().displayName+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().gender+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().age+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().experience);
              
               }
          
          });  
    }
  });
}

if(arg['femaleSinger'] !== undefined){
  arg['femaleSinger'].forEach(element => {
    if (element && element.split('_')[1] == this.userData.userName) { 
      this.firebaseService.filterActorById(element.split('_')[0]).then(element => {
        if(!(_.isEmpty(element['docs'][0].data().actorName))){       
             
                this.actor_img = element['docs'][0].data().image;
                this.totalActorsList.push(element['docs'][0].data().image+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().displayName+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().gender+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().age+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().experience);
              
               }
          
          });  
    }
  });
}
if(arg['maleSinger'] !== undefined){
  arg['maleSinger'].forEach(element => {
    if (element && element.split('_')[1] == this.userData.userName) { 
      this.firebaseService.filterActorById(element.split('_')[0]).then(element => {
        if(!(_.isEmpty(element['docs'][0].data().actorName))){       
             
                this.actor_img = element['docs'][0].data().image;
                this.totalActorsList.push(element['docs'][0].data().image+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().displayName+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().gender+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().age+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().experience);
              
               }
          
          });  
    }
  });
}
    /** this.totalActorsList = [];
    let ass_actorList = [];
    let ass_actressList = [];
    let ass_music = [];
    let femaleSinger_list = [];
    let maleSinger_list = [];
    if(arg['actors'] !== undefined){
      arg['actors'].forEach(element => {
        if (element && element.split('_')[0]) {        
          ass_actorList.push(element.split('_')[0]);
        }
      });
  }
    if(arg['actress'] !== undefined){
      arg['actress'].forEach(element => {
        if (element && element.split('_')[0]) {
          ass_actressList.push(element.split('_')[0]);
        }
      });
  }
    if(arg['music'] !== undefined){
      arg['music'].forEach(element => {
        if (element && element.split('_')[0]) {
          ass_music.push(element.split('_')[0]);
        }
      });
  }
    if(arg['femaleSinger'] !== undefined){
      arg['femaleSinger'].forEach(element => {
        if (element && element.split('_')[0]) {
          femaleSinger_list.push(element.split('_')[0]);
        }
      });
   }
   if(arg['maleSinger'] !== undefined){
    arg['maleSinger'].forEach(element => {
      if (element && element.split('_')[0]) {
        maleSinger_list.push(element.split('_')[0]);
      }
    });
  }
    let actorCount = this.confData.compressArray(ass_actorList);
    let actressCount = this.confData.compressArray(ass_actressList);
    let musicCount = this.confData.compressArray(ass_music);
    let maleSingerCount = this.confData.compressArray(maleSinger_list);
    let femaleSingercount = this.confData.compressArray(femaleSinger_list);
    let actorId;
    let actressId;
    let musicId;
    let maleSingerId;
    let femaleSingerId;
    actorId = _.maxBy(actorCount, function (o) { return o.count; });
    actressId = _.maxBy(actressCount, function (o) { return o.count; });
    musicId = _.maxBy(musicCount, function (o) { return o.count; });
    maleSingerId = _.maxBy(maleSingerCount, function (o) { return o.count; });
    femaleSingerId = _.maxBy(femaleSingercount, function (o) { return o.count; });
    this.firebaseService.readActors().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        if (actorId && docData['id'] === actorId.value) {
          this.actor_img = docData['image'];
          this.totalActorsList.push(docData['image']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['displayName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['gender']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['skills']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['age']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['experience']);
         
        }
        if (actressId && docData['id'] === actressId.value) {
          this.actress_img = docData['image'];
          this.totalActorsList.push(docData['image']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['displayName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['gender']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['skills']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['age']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['experience']);
          
        }
        if (musicId && docData['id'] === musicId.value) {
          this.music_dir_img = docData['image'];
          this.totalActorsList.push(docData['image']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['displayName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['gender']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['skills']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['age']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['experience']);
          
        }
        if (maleSingerId && docData['id'] === maleSingerId.value) {
          this.male_singer_img = docData['image'];
          this.totalActorsList.push(docData['image']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['displayName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['gender']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['skills']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['age']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['experience']);
         
        }
        if (femaleSingerId && docData['id'] === femaleSingerId.value) {
          this.female_singer_img = docData['image'];
          this.totalActorsList.push(docData['image']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['displayName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['gender']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['skills']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['age']+'***@@@shirdi&&&saibaba@@@^^^!!!'+docData['experience']);
         
        }
        
      });
    });  */
   
  }
  showdialer(data) {
    this.callNumber.callNumber(data, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  /**callNow(userName) {
    let userInfo = [];
    this.firebaseService.filterUsers(userName.split('_')[0]).get().subscribe(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        userInfo.push(doc.data());

      });
    });
    setTimeout(() => {
      if (userInfo.length >= 0) {
        this.showdialer(userInfo[0]['mobile']);
      }
    }, 1000);

  }*/
  async callNow(userName) {
    let userInfo = [];
    const loading = await this.loadingCtrl.create({
      message: 'Connecting...',
      duration: 3000
    });
    await loading.present();    
    this.firebaseService.getwhatsAppNumber(userName.split('_')[0]).then(element => {
     if(!(_.isEmpty(element['mobile']))){ 
            setTimeout(() => {              
                this.showdialer(element['mobile']);  
                loading.onWillDismiss();           
            }, 1000);  
          }   
    });
    

  }
  async addActor(data) {

    const modal = await this.modalController.create({
      component: ActorAddPage,
      componentProps: {
        "paramID": this.postData,
        "paramTitle": "Test Title"
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        this.checkActor(this.dataReturned);
        this.actorName ='';
        this.actor_img='';
        this.actressName='';
        this.actress_img ='';
        this.maleSingerName='';
        this.maleSingerImg='';
        this.femaleSingerName='';
        this.femaleSingerImg='';
        this.musicdirectorName ='';
        this.music_dir_img ='';
        this.userData.mappedCrews.forEach(element => {
          if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'actor'){
           this.actorName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
            this.actor_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
          }
          else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'actress'){
            this.actressName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.actress_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }
           else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'maleSinger'){
            this.maleSingerName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.maleSingerImg = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }
           else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'femaleSinger'){
            this.femaleSingerName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.femaleSingerImg = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }
           else{
            this.musicdirectorName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
            this.music_dir_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }
       });
       
        /** this.actor_img = this.userData.mappedCrews[0];//Actor img
        this.actorName = this.userData.mappedCrews[1];//Actor name
        this.actress_img =this.userData.mappedCrews[2];//Actress img
        this.actressName = this.userData.mappedCrews[3];//Actress name
        this.music_dir_img = this.userData.mappedCrews[4];//Music director img
        this.musicdirectorName = this.userData.mappedCrews[5];//Music director name */
        //this.actor_img = this.userData.actor_img != '' ? this.userData.actor_img : '';        
        //this.actress_img = this.userData.actoress_img != '' ? this.userData.actoress_img : '';
        //this.music_dir_img = this.userData.musicDir_img != '' ? this.userData.musicDir_img : '';
        //Need to implment when we want to show mapped acrew setup again agian when user login
        //this.users.forEach(e => {
        //if (this.selectedActor == e['id']) {
        //  this.userData.actor_img = e['image'];
        //  e['associatedStories'].push(this.postData['id']);
        //  this.postData['actors'].push(e['id'] + '_' + this.username);
        //  this.firebaseService.updateActros(e['id'], e);
       // }
        //if (this.selectedActress == e['id']) {
        //  this.userData.actoress_img = e['image'];
         // e['associatedStories'].push(this.postData['id']);
         // this.postData['actress'].push(e['id'] + '_' + this.username);
         // this.firebaseService.updateActros(e['id'], e);
        //}
        //if(this.selectedMusic == e['id']){
        //  this.userData.musicDir_img = e['image'];
        //  e['associatedStories'].push(this.postData['id']);
        //  this.postData['music'].push(e['id'] + '_' + this.username);
        //  this.firebaseService.updateActros(e['id'], e);
        //}
 
      //});
        this.userExist =false;
        this.isMapped =true;
        this.choiceSavedpresentToast('Your choices are saved..!', 'toast-success');
      }
    });

    return await modal.present();
  }
  loginCheck() {
    if (_.isEmpty(this.username)) {
      this.router.navigateByUrl('/signUp');
      return false;
    } else {
      return true;
    }
  }
  ionViewWillEnter(arg?) {
    this.totalActorsList = [];
    this.subsctionCount=0;
    this.isSubscribed = false;
    this.isEditRequired =false;
    this.isSynopsisEdit =false;
    this.isSaveRequired=false;
    if(this.synopsisPara !== undefined){
        this.synopsisPara.nativeElement.contentEditable = false;
    }
   
    this.ngFireAuth.onAuthStateChanged((obj)=>{
      if(_.isEmpty(obj)){
        this.presentToast('Please login/signup to see more!','toast-success');
        this.router.navigateByUrl('/signUp');
        return;
      }
    });
    this.isMapped=false;
    this.hasActor = false;
    this.userExist = false;
    this.saveDataToSession();
    if (arg == null && this.confData.isFromPage == '') {
      this.router.navigateByUrl("/app/tabs/speakers");
    }
    this.showFinalPriceonSave = false;
    //this.showFundDetails = true;
    this.showSkeltonLoading();
    this.getUserName();
    this.username = this.confData.loginUser;
    this.userType = this.userData.userType;
    this.postData = this.confData.routingData;    
    this.isSubscribeDone(this.postData,'ionView');
    if(!(_.isEmpty(this.postData)) && this.postData.uploadedBy == this.userData.userName){
      this.isEditRequired = true;
    }
    this.totalFund = 0;
    let uploadedUser = []
    this.postUploadedBy ="";
    setTimeout(() => {
      this.firebaseService.filterUsers(this.postData['uploadedBy']).get().subscribe(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          uploadedUser.push(doc.data());
          // if (uploadedUser.length > 0) {
           // console.log('error username' + uploadedUser[0]['emailId']);
            //this.postUploadedBy = uploadedUser[0]['userName'];
          //} 
        });
      });
    }, 2000);


    this.postData['fundedBy'].forEach(element => {
      if (element.split('_')[0] !== this.username) {
        this.showFundDetails = true;
        this.storyStatus = this.postData.storyStatus;        
        this.budget = this.postData.budget;
        this.showFinalPriceonSave = true;
      }
      if (element.split('_')[1] != null) {
        this.totalFund += Number(element.split('_')[1]);
      }

    });
    if (this.totalFund > 0) {
      let p = this.totalFund / this.postData['budget'];
      this.roundoff = p * 100;
      this.roundoff = Math.floor(this.roundoff);
      this.runDeterminateProgress(this.roundoff);
    }

    this.setClass(this.postData);
    this.checkActor(this.postData);
    this.fundType = this.postData.fundType;
    this.checkActorAssociations(this.postData);
    this.showPost = true;
    let isFrom = this.confData.isFromPage;
    if (isFrom == 'dashboard') {
      this.defaultHref = '/app/tabs/schedule';
    } 
    else if(isFrom =='profile_fav' || isFrom =='map'){
      this.defaultHref = "/app/tabs/map";
    }
    else if(isFrom =='actor-details' || isFrom =='map'){
      this.defaultHref = "/actor-details";
    }
    else {
      this.defaultHref = "/app/tabs/speakers";
    }
    this.confData.routingData = {};

  }


  ionViewDidLeave() {
    this.isMapped=false;
    this.pRef['el']['hidden'] = false;
  }
  ngAfterViewInit() {
  }
  back() {

  }
  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  async goToDetails(requestuserName) { 
    this.confData.isDirectorLabelClicked =true;
    const loading = await this.loadingCtrl.create({
      message: 'Fetching Director Details...',
      duration: 2000
    });
    await loading.present(); 
    this.loadingCtrl.dismiss();
    //Empty the previous values
    if(this.confData.actorData["associatedStories"] || this.confData.actorData["associatedStories"] == undefined || this.confData.actorData["associatedStories"].length>=0){
       this.confData.actorData["associatedStories"]=[];
    }
    const requestedUserName = requestuserName;
    this.firebaseService.filterActors(requestedUserName).get().subscribe( (querySnapshot) =>{
     querySnapshot.forEach( (doc)=> {
       
      // this.userDetailsData.push(doc.data()); how to handle more than one approvals,so need to concentrate
      this.confData.actorData["image"] =doc.data().image;
      this.confData.actorData["skills"] =doc.data().skills;
      this.confData.actorData["profiles"] =doc.data().profiles;
       //if(this.confData.actorData.userType == 'D'){
        
         this.firebaseService.filterPosts(requestedUserName).get().subscribe( (querySnapshot) =>{
           querySnapshot.forEach( (doc)=> {
             this.postedStories =[]              
             this.postedStories["title"] =doc.data().title;              
             this.postedStories["image"] =doc.data().image;
             this.postedStories["synopsis"] =doc.data().synopsis;
             this.postedStories["likes"] =doc.data().likes;
             this.postedStories["views"] = doc.data().views;
             this.confData.actorData["associatedStories"].push(this.postedStories);
             });               
           });
           if(this.confData.actorData['associatedStories'].length >= 0 ){            
            this.confData.isFromPage = 'speakerDetails';
            this.confData.loginUser = this.username;           
            this.router.navigateByUrl('/prod-direct-details');
          }
      // }else {
        // this.presentToast('No data avilable for this user', 'toast-danger');
      // }
      });
     });    
   }
  openExternalUrl(url: string) {
    this.inAppBrowser.create(
      url,
      '_blank'
    );
  }

  async openSpeakerShare(speaker: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log(
              'Copy link clicked on https://twitter.com/' + speaker.twitter
            );
            if (
              (window as any).cordova &&
              (window as any).cordova.plugins.clipboard
            ) {
              (window as any).cordova.plugins.clipboard.copy(
                'https://twitter.com/' + speaker.twitter
              );
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async openContact(speaker: any) {
    const mode = 'ios'; // this.config.get('mode');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }
   saveDataToSession(){
      this.firebaseService.filterUsers(this.confData.loginUser).get().subscribe(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          sessionStorage.setItem('userEmail', doc.data()['emailId']);
        });
      });
  }
  //Subscribe
  async getSubscriptionStatus(obj,isFrom,actorDocId) {
          this.getUserName();
          this.subscriptionId =''
          let subscribedBy = [];
          this.querySnapshotStatus = false;
          let docId;
          this.firebaseService.filterSubscription1(obj.title).then(element => {
            if(element){
                docId = element['docs'][0].id;
                if(!(_.isEmpty(element['docs'][0].data().storyTitle))){
                  subscribedBy = element['docs'][0].data().subscribedBy; 
                  subscribedBy = _.uniqBy(subscribedBy);      
                  //this.subsctionCount = subscribedBy.length;
                  if(obj.title == element['docs'][0].data().storyTitle){
                    this.updateSubscription(subscribedBy,docId,isFrom,actorDocId);
                  }else{
                    this.createSubscription(obj,actorDocId,isFrom);
                  }
                } 
            }
          }).catch(error => {      
            if(error.message == 'Title not found' ){
              this.createSubscription(obj,actorDocId,isFrom);
            }
         });
          
    }
    async createSubscription(obj,actorDocId,isFrom){
      if(obj.subscribedBy !== undefined && obj.subscribedBy.length > 0){
                  this.isSubscribed = true;
                  let createSubObj ={};
                  this.subsctionCount = this.subsctionCount+1;
                  // setTimeout(() => { 
                  createSubObj['uploadedBy'] =obj.uploadedBy;
                  createSubObj['storyTitle'] =obj.title;
                  createSubObj['subscribedBy'] =[];
                  createSubObj['subscribedBy'].push(this.userData.userName+'_'+true);
                  createSubObj['subscribedOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
                  this.firebaseService.createSubscription(createSubObj);
                  //} , 1000);  
                let subscriptioncountObj={};
                subscriptioncountObj['subscriptioncount'] = this.subsctionCount;
                this.firebaseService.updateActros(actorDocId,subscriptioncountObj);
              }else{
                if(isFrom == 'ionView'){ 
                  this.isSubscribed = false;
                  return;
                }
                let createSubObj ={};                  
                  // setTimeout(() => { 
                    this.isSubscribed = true;
                  this.subsctionCount = this.subsctionCount+1;
                  createSubObj['uploadedBy'] =obj.uploadedBy;
                  createSubObj['storyTitle'] =obj.title;
                  createSubObj['subscribedBy'] =[];
                  createSubObj['subscribedBy'].push(this.userData.userName+'_'+true);
                  createSubObj['subscribedOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
                  this.firebaseService.createSubscription(createSubObj);
                  //} , 1000);  
              }       
    }
  async updateSubscription(subscribedBy,docId,isFrom,actorDocId){ 
    let obj ={};    
    this.subsctionCount = subscribedBy !== undefined ? subscribedBy.length : 0;
        if(isFrom =='newSubscription'){ 
          this.subsctionCount = this.subsctionCount+1;
        }
          if(subscribedBy.length>0){
            
                    subscribedBy.forEach(element1 => {
                      if(element1 == this.userData.userName+'_'+true){
                        this.isSubscribed = true;
                        return;                      
                      }else{                  
                        subscribedBy.push(this.userData.userName+'_true');
                        subscribedBy = _.uniqBy(subscribedBy);
                        obj['subscribedBy'] =subscribedBy;
                        obj['subscribedOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
                        if(isFrom =='newSubscription'){                    
                          this.isSubscribed = true;
                          this.firebaseService.updateSubscription(docId,obj);
                        }
                        
                      }
                });
        }else{
                        subscribedBy.push(this.userData.userName+'_true');
                        subscribedBy = _.uniqBy(subscribedBy);
                        obj['subscribedBy'] =subscribedBy;
                        obj['subscribedOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
                        if(isFrom =='newSubscription'){                    
                          this.isSubscribed = true;
                          this.firebaseService.updateSubscription(docId,obj);
                        }
        }
        let subscriptioncountObj ={};
        subscriptioncountObj['subscriptioncount'] = this.subsctionCount;
        this.firebaseService.updateActros(actorDocId,subscriptioncountObj);
  }
  async isSubscribeDone(post,isFrom) {
      this.firebaseService.filterActorByName(post.uploadedBy).then(element => {
        this.getSubscriptionStatus(post,isFrom,element['docs'][0].id); 
      });
    
     
  }
//Ticket booking
async showTicketNumber(post) {
  
  let alreadyBooked = JSON.parse(sessionStorage.getItem('alreadyBooked'));
  if (!(_.isEmpty(alreadyBooked))) {
    this.isSubscribed = true;
    let i = 0;
    let Found: boolean = false;
    let foundTicket='';
    alreadyBooked.forEach(async element => {

      if (post['id'].indexOf(element['storyId']) >= 0) {
        Found = false;
        foundTicket=element['ticketId']
        return;
      }
      if (i == alreadyBooked.length - 1 && Found == false) {
        this.callElsePart(post);
      }
      i++;
    });
    if(foundTicket!=''){
      const alert = await this.alertCtrl.create({
        header: 'Ticket Update',
          
        message: `You already holding a ticket`+`<br><br> <b>&nbsp;&nbsp; <img src="../../../assets/icons/ticket.png"> ` +`&nbsp;<big class='big-tkt'>`+foundTicket,
        buttons: [
          {
            cssClass:'btn-modal',
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
  sessionStorage.setItem('genTicket',ticket['ticketId']);

  this.firebaseService.createTicket(ticket).then(async creationResponse => {
    if (creationResponse != null) {

      const alert = await this.alertCtrl.create({
        header: 'Interested to generate Ticket number ?',

        message: 'Click to Proceed',
        cssClass: 'my-header',
        buttons: [{
          text: 'Proceed',
          cssClass: 'my-btn',
          handler: () => {
            this.alertCtrl.create({
              header: 'Ticket Generated',
              subHeader: ticket['ticketId'],
              message: 'Keep this ticket number for future reference',
              buttons: [
                {
                  text: 'OK',
                  cssClass:'btn-modal',
                  handler: async () => {
                    let emailUrl = "https://us-central1-app-direct-a02bf.cloudfunctions.net/sendMail?dest=" + sessionStorage.getItem('userEmail')
                    emailUrl = emailUrl + '&body=<b> Greeting from Vi-Fi Team </b> <br> ' + post['title'] + ' ticket has been generated.<br><b>  ' + sessionStorage.getItem('genTicket') + '</b>    Keep this as reference.<br> Email - viabilityfilm@gmail.com';
                    this.callService(ticket['storyId']);

                  }
                },
                {
                  text: 'Cancel',
                  cssClass:'btn-modal',
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
  async editSynopsis(postData){
    if(postData.uploadedBy == this.userData.userName){
      this.isSynopsisEdit = true;
      this.synopsisPara.nativeElement.contentEditable  = true;
      this.isEditRequired = false;
      this.isSaveRequired =true;
    }
  }
  async updateSynopsis(postData){
   //let val = this.dynamicRef.nativeElement.innerHTML; 
    if(postData !==undefined && this.userData !== undefined && postData.uploadedBy == this.userData.userName){  
      if(this.synopsisPara.nativeElement.innerHTML == ''){
        //Resused the toast since less time required
        this.choiceSavedpresentToast('Synopsis Cannot be empty', 'toast-danger'); 
      return;
      }else{   
          let obj = {'synopsis':this.synopsisPara.nativeElement.innerHTML}; 
          this.firebaseService.updateSynopsis(postData.id,obj);  
          this.isEditRequired = true;
          this.isSaveRequired =false;     
          this.synopsisPara.nativeElement.contentEditable  = false;  
          //Resused the toast since less time required   
          this.choiceSavedpresentToast('Synopsis updated successfully', 'toast-success');
      }
    }else{
      this.presentToast('Network Slow/You dont have access', 'toast-danger'); 
      return;
    }
  }
  async openModal(techieObj) {
   
    const modal = await this.modalController.create({
    component: TechnicianDetailsPage,
    componentProps: { techieObj: this.totalActorsList }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data['isEdited'] == true) {
        this.isMapped = false;
        this.userExist = false;
      }
    });
    return await modal.present();
   }
   dismiss() {
    this.modalController.dismiss();
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