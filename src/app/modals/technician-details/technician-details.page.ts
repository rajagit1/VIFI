import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams, IonReorderGroup, ToastController, LoadingController } from '@ionic/angular';
import { UserData } from '../../providers/user-data';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { CallNumber } from '@ionic-native/call-number/ngx';


@Component({
  selector: 'app-technician-details',
  templateUrl: './technician-details.page.html',
  styleUrls: ['./technician-details.page.scss'],
})
export class TechnicianDetailsPage implements OnInit {

  notifyList: any = [];
  username: string;
  actorId:any;
  duplicateClickCount:number=1;
  mobNoRequested: boolean = false;
  postData: any;
  isCastPage:boolean = false;
  actor_displayName:string ="";
  actor_img:string ="";
  actor_skills:string ="";
  actor_age:string ="";
  actor_experience:string ="";

  actress_displayName:string ="";
  actress_img:string ="";
  actress_skills:string ="";
  actress_age:string ="";
  actress_experience:string ="";

  music_male_displayName:string ="";
  music_male_img:string ="";
  music_male_skills:string ="";
  music_male_age:string ="";
  music_male_experience:string ="";

  music_female_displayName:string ="";
  music_female_img:string ="";
  music_female_skills:string ="";
  music_female_age:string ="";
  music_female_experience:string ="";

  maleSinger_displayName:string ="";
  maleSinger_img:string ="";
  maleSinger_skills:string ="";
  maleSinger_age:string ="";
  maleSinger_experience:string ="";

  femaleSinger_displayName:string ="";
  femaleSinger_img:string ="";
  femaleSinger_skills:string ="";
  femaleSinger_age:string ="";
  femaleSinger_experience:string ="";

  assistantDirectorName:string="";
  assistantDirector_img:string="";
  assistantDirector_mobile:string="";
  assistantDirector_skills:string="";

  scriptWriterName:string="";
  scriptWriter_img:string="";
  scriptWriter_mobile:string="";
  scriptWriter_skills:string="";

  dopName:string ="";
  dop_mobile:string ="";
  dop_img:string ="";
  dop_skills:string ="";

  editorName:string ="";
  editor_mobile:string ="";
  editor_img:string ="";
  editor_skills:string ="";

  supportingActorMaleName:string ="";
  supportingActorMale_mobile:string ="";
  supportingActorMale_img:string ="";
  supportingActorMale_skills:string ="";

  supportingActorFemaleName:string ="";
  supportingActorFemale_mobile:string ="";
  supportingActorFemale_img:string ="";
  supportingActorFemale_skills:string ="";

  dubbingMaleName:string ="";
  dubbingMale_img:string ="";
  dubbingMale_mobile:string ="";
  dubbingMale_skills:string ="";

  dubbingFemaleName:string ="";
  dubbingFemale_img:string ="";
  dubbingFemale_mobile:string ="";
  dubbingFemale_skills:string ="";

  choreographerName:string ="";
  choreographer_img:string ="";
  choreographer_mobile:string ="";
  choreographer_skills:string ="";

  studioName:string ="";
  studio_img:string ="";
  studio_mobile:string ="";
  studio_skills:string ="";

  equipmentName:string ="";
  equipment_img:string ="";
  equipment_mobile:string ="";
  equipment_skills:string ="";

  technician_or_cast_title ="";

  constructor(private navParams: NavParams,public router: Router,private callNumber: CallNumber,public userData: UserData,
    private modalController: ModalController,private toastCtrl: ToastController,public fireBaseService: FireBaseService,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.postData = this.navParams.data.techieObj;
    if(this.postData.length !== undefined){
      this.isCastPage = true;
      this.technician_or_cast_title = "Mapped Cast Details";
      this.postData.forEach(element => {        
            if(element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3] == 'M' ){
              this.actor_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.actor_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.actor_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
              this.actor_age = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[5];  
              this.actor_experience = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[6];     
            }
            if(element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3] == 'F' ){
              this.actress_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.actress_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.actress_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
              this.actress_skills = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4]; 
              this.actress_age = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[5];  
              this.actress_experience = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[6];     
            }
            if(element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3] == 'Singer_F' ){
              this.femaleSinger_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.femaleSinger_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.femaleSinger_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
              this.femaleSinger_skills = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4]; 
              this.femaleSinger_age = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[5];  
              this.femaleSinger_experience = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[6];     
            }
            if(element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3] == 'Singer_M' ){
              this.maleSinger_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.maleSinger_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.maleSinger_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
              this.maleSinger_skills = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
              this.maleSinger_age = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[5];  
              this.maleSinger_experience = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[6];       
            }
            if(element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3] == 'Music_F' ){
              this.music_female_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.music_female_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.music_female_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
              this.music_female_skills = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4]; 
              this.music_female_age = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[5];  
              this.music_female_experience = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[6];     
            }
            if(element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3] == 'Music_M' ){
              this.music_male_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.music_male_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.music_male_displayName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
              this.music_male_skills = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4]; 
              this.music_male_age = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[5];  
              this.music_male_experience = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[6];     
            }
      });   
    }else{  
            this.isCastPage = false;
            this.technician_or_cast_title = "Mapped Technician Details";
            if(this.postData.dop){
              this.dopName = this.postData.dop[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.dop_img = this.postData.dop[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.dop_skills = this.postData.dop[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
              this.dop_mobile = this.postData.dop[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];      
            }

            if(this.postData.editor){
              this.editorName = this.postData.editor[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.editor_img = this.postData.editor[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.editor_skills = this.postData.editor[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
              this.editor_mobile = this.postData.editor[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];      
            }

            if(this.postData.assistantDirector){
              this.assistantDirectorName = this.postData.assistantDirector[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.assistantDirector_img = this.postData.assistantDirector[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.assistantDirector_skills = this.postData.assistantDirector[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
              this.assistantDirector_mobile = this.postData.assistantDirector[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];      
            }
            if(this.postData.scriptWriter){
              this.scriptWriterName = this.postData.scriptWriter[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.scriptWriter_img = this.postData.scriptWriter[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.scriptWriter_skills = this.postData.scriptWriter[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
              this.scriptWriter_mobile = this.postData.scriptWriter[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];      
            }
            if(this.postData.supportingActorMale){
              this.supportingActorMaleName = this.postData.supportingActorMale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.supportingActorMale_img = this.postData.supportingActorMale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.supportingActorMale_skills = this.postData.supportingActorMale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
              this.supportingActorMale_mobile = this.postData.supportingActorMale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];      
            }
            if(this.postData.supportingActorFemale){
              this.supportingActorFemaleName = this.postData.supportingActorFemale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.supportingActorFemale_img = this.postData.supportingActorFemale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.supportingActorFemale_skills = this.postData.supportingActorFemale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
              this.supportingActorFemale_mobile = this.postData.supportingActorFemale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];      
            }
            if(this.postData.choreographer){
              this.choreographerName = this.postData.choreographer[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.choreographer_img = this.postData.choreographer[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.choreographer_skills = this.postData.choreographer[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
              this.choreographer_mobile = this.postData.choreographer[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];      
            }
            if(this.postData.studio){
              this.studioName = this.postData.studio[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.studio_img = this.postData.studio[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.studio_skills = this.postData.studio[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
              this.studio_mobile = this.postData.studio[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];      
            }
            if(this.postData.equipment){
              this.equipmentName = this.postData.equipment[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.equipment_img = this.postData.equipment[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.equipment_skills = this.postData.equipment[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
              this.equipment_mobile = this.postData.equipment[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];      
            }
            if(this.postData.dubbingArtistMale){
              this.dubbingMaleName = this.postData.dubbingArtistMale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.dubbingMale_img = this.postData.dubbingArtistMale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.dubbingMale_skills = this.postData.dubbingArtistMale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
              this.dubbingMale_mobile = this.postData.dubbingArtistMale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];      
            }
            if(this.postData.dubbingArtistFemale){
              this.dubbingFemaleName = this.postData.dubbingArtistFemale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
              this.dubbingFemale_img = this.postData.dubbingArtistFemale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
              this.dubbingFemale_skills = this.postData.dubbingArtistFemale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
              this.dubbingFemale_mobile = this.postData.dubbingArtistFemale[0].split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];      
            }
      }      
  }
  ionViewDidEnter() {    
    this.getUserName();    
  }
  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(this.postData);
  }
  closeModal2() {
    const onClosedData: string = "Wrapped Up!";
    this.modalController.dismiss({
      'isEdited': false
    });
  }
  editMapping(){    
    this.modalController.dismiss({
      'isEdited': true
    });
  }
  getUserName() {    
    if(this.userData.userName){
          this.getRequestedNotify(this.userData.userName);
      }else{
        this.loginCheck();
      }
   /** this.userData.getUsername().then((username) => {
     // this.ngFireAuth.onAuthStateChanged((obj)=>{
        if(username){
            //this.username = obj.email.split('@')[0];
            this.username = username;
            this.getRequestedNotify(this.username);
        }else{
          this.loginCheck();
        }
      
    }); */
  }
  getRequestedNotify(actor) {
    this.fireBaseService.getWhatappNoRequestedDetails(actor).subscribe((res: any) => {
      this.notifyList = res;      
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
  async showdialer(actor,mobile,duplicateClickCount) {
        this.fireBaseService.filterActorByName(this.userData.userName).then(element => {
      if(!(_.isEmpty(element['docs'][0].data().actorName))){        
        this.actorId = element['docs'][0].id;
      }
    });
    if (this.duplicateClickCount == 1){
              const loading = await this.loadingCtrl.create({
                message: 'Sending Request...',
                duration:1000
              });
              await loading.present(); 
              loading.onWillDismiss();           
        }   
    
    if(this.showStatus(actor,mobile) == 'Rejected'){
      this.duplicateClickCount = duplicateClickCount+1;
      this.presentToast('Your request already rejected', 'toast-danger');
      return;
    }
    else if(this.showStatus(actor,mobile) == 'Request Sent'){
      this.duplicateClickCount = duplicateClickCount+1;
      this.presentToast('Your request already sent', 'toast-danger');
      return;
    }
    else if(!(this.numberOnlyValidation(this.showStatus(actor,mobile)))){
      this.duplicateClickCount = duplicateClickCount+1;
      this.presentToast('You cannot send request', 'toast-danger');
      return;
    }
    else if(this.duplicateClickCount == 1){
    
                    let status=this.showStatus(actor,mobile);
                    if(!isNaN(_.toNumber(status))){
                      this.callNumber.callNumber(status, true)
                      .then(res => console.log('Launched dialer!', res))
                      .catch(err => console.log('Error launching dialer', err));
                    }else if(status == 'Contact'){                      
                      const reqObj = {
                        requestedUserEmail: this.userData.userName,
                        actorDocId: this.actorId,
                        status: 'P',
                        actorName: actor,
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
                                                  'body':`${this.userData.userName} has requested to view your WhatsApp number!`,
                                                  'title':"VIFI"
                                            }
                                          }
                                          this.fireBaseService.sendNotificationToSingleDevice(notificationReqObj).subscribe(res => {
                                            console.log('Like notification response ------->', res);
                                          });
                                        }
                                      });
                                    }
                                  });
                                    
                                }
                             }     
         this.duplicateClickCount = this.duplicateClickCount+1;
         
        }else{
          this.duplicateClickCount = 1;
        }
            
  }
  showStatus(actorName,mobile) {
    let retval = "Contact";
    this.notifyList.forEach(element => {
       if(actorName === element.actorName && this.userData.userName.indexOf(element.requestedUserEmail)>=0){
        if (element.status === "A") {
           
          retval = mobile;
           
  
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
  numberOnlyValidation(modifiedBudget) {
    const pattern = /^[0-9]+$/;
    //let inputChar = String.fromCharCode(event.charCode);
    if (!modifiedBudget.match(pattern)) {      
      //event.preventDefault();
      return true;
    }
  }
}
