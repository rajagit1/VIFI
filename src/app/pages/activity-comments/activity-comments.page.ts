import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, IonReorderGroup, ToastController, LoadingController,ActionSheetController } from '@ionic/angular';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { FireBaseService } from '../../services/firebase.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-activity-comments',
  templateUrl: './activity-comments.page.html',
  styleUrls: ['./activity-comments.page.scss'],
})
export class ActivityCommentsPage implements OnInit {
  
  heartClass: string;
  postComment:any;
  commentsObj: any;
  defaultHref = 'app/tabs/daily-activities';
  isPosted:boolean = false;
  //social sharing test
  textToShare:string;
  urlToShare:string;
  imageToShare:string;

  dummyData = [
    {
      activityComment: "Test_comment1"      
    },
    {
      activityComment: "Test_comment2"
    },
    {
      activityComment: "Test_comment3"
    }
  ]
  constructor(private loadingCtrl: LoadingController,public toastCtrl: ToastController,private navParams: NavParams,public ngFireAuth: AngularFireAuth,public actionSheetController: ActionSheetController,
    private confData: ConferenceData,public toastController: ToastController,private socialSharing: SocialSharing,
    public modalCtrl: ModalController,public router: Router,private fireBaseService: FireBaseService,public userData: UserData) { }

  ngOnInit() {
    this.commentsObj = this.navParams.data.paramID;
  }
  async ionViewDidEnter() {
    this.ngFireAuth.onAuthStateChanged(async (obj)=>{
      if(obj){
                  this.textToShare = "";
                  this.urlToShare= "";
                  this.imageToShare = null;
                this.fireBaseService.filterActorByName(this.userData.userName).then(element => {
                  if(!(_.isEmpty(element['docs'][0].data().actorName))){
                  this.confData.actorData = {};
                  this.confData.actorData = element['docs'][0].data();
                  }else{
                    this.presentToastForLike("Not Registered.","danger");
                    this.router.navigateByUrl('/signUp');
                  }
                });
                const loading = await this.loadingCtrl.create({
                  message: 'Loading...',
                  duration: 2000
                });
        } else{
          this.presentToast('Please login/signup to see more!','toast-success');
          this.router.navigateByUrl('/signUp'); 
        }
      });
  }
  dismiss(data?: any) {    
    this.modalCtrl.dismiss(data);
  }
  async saveComments(commentsObj){
    this.isPosted =true;
    
    let commentObj ={};
    if(this.postComment !== "" && this.postComment !== undefined){
    commentObj['id'] = commentsObj.id;
    commentObj['likes'] =commentsObj.likes;
    commentObj['activityComment'] =commentsObj.activityComment;
    commentObj['activityComment'].push(this.postComment+'***@@@shirdi&&&saibaba@@@^^^!!!'+ this.confData.actorData.displayName+'***@@@shirdi&&&saibaba@@@^^^!!!'+this.confData.actorData.image+'***@@@shirdi&&&saibaba@@@^^^!!!'+this.confData.actorData.actorName);
    
    this.fireBaseService.addOrupdateActivityComment(commentObj);
    this.postComment ="";
    this.isPosted =false;
    }else{
      this.presentToastForLike("Cannot be blank.","danger");
      return;
    }
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
changeClass(obj) {
    
  let activity = {};
  activity['id'] = obj['id']
   activity['likes'] =obj.likes;
    activity['likes'].push(this.userData.userName);
    this.heartClass = "heart-cls-red";
  this.fireBaseService.addOrupdateActivityComment(activity);
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
  async presentActionSheet(message,url) {
    this.urlToShare = "";
    this.imageToShare="";
    this.textToShare="";
    this.textToShare = message;
    if(url.split('activities_image')[1] !== undefined){
      const firstSpilit_img = url.split('activities_image')[1];
      const secondSpilit_img = firstSpilit_img.split('?')[0];
      this.urlToShare = 'https://storage.googleapis.com/app-quick-direct.appspot.com/activities_image'+ secondSpilit_img.replaceAll('%2F','/');
      this.imageToShare =  'https://storage.googleapis.com/app-quick-direct.appspot.com/activities_image'+ secondSpilit_img.replaceAll('%2F','/');
    }
    if(url.split('activities_video')[1] !== undefined){
      const firstSpilit_video = url.split('activities_video')[1];
      const secondSpilit_video = firstSpilit_video.split('?')[0];
      this.urlToShare = 'https://storage.googleapis.com/app-quick-direct.appspot.com/activities_video'+ secondSpilit_video.replaceAll('%2F','/');
      this.imageToShare =  'https://storage.googleapis.com/app-quick-direct.appspot.com/activities_video'+ secondSpilit_video.replaceAll('%2F','/');
    }
    if(this.textToShare !== '' || this.textToShare !== undefined){
      this.textToShare = this.textToShare + " [ Shared from VIFI app : "+ " https://play.google.com/store/apps/details?id=com.vifi_01 ]";
    }else{
      this.textToShare = "- "+" [ Shared from VIFI app : "+"https://play.google.com/store/apps/details?id=com.vifi_01 ]"
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
      },{
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
      }    ]
    });
    await actionSheet.present(); 
  }
    shareviaWhatsapp(){
         
          this.socialSharing.shareViaWhatsApp(this.textToShare, this.imageToShare)
            .then((success) =>{
              //this.presentToastForLike("Your message shared",'toast-success');
            })
              .catch(()=>{
                //this.presentToastForLike("Could not share information",'toast-danger');
              });
    }
     shareviaFacebook(){
      
      this.socialSharing.shareViaFacebook(this.textToShare, this.imageToShare, this.urlToShare)
        .then((success) =>{
         // this.presentToastForLike("Your message shared",'toast-success');
        })
        .catch((err)=>{
          //this.presentToastForLike("Video/Image Allowed not Prefilled Message",'toast-danger');
          });
    }
     shareviaInstagram(){
      
      this.socialSharing.shareViaInstagram(this.textToShare, this.imageToShare)
        .then((success) =>{
          //this.presentToastForLike("Your message shared",'toast-success');
          })
          .catch(()=>{
            //this.presentToastForLike("Video/Image Allowed not Prefilled Message",'toast-danger');
          });
    }
     shareviaTwitter(){
      
      this.socialSharing.shareViaTwitter(this.textToShare, null, this.urlToShare)
      .then((success) =>{
       // this.presentToastForLike("Your message shared",'toast-success');
          })
          .catch((err)=>{
           // this.presentToastForLike("Could not share information",'toast-danger');       
             });
    } 
    
    async showDetail(posterOwner) {
      const loading = await this.loadingCtrl.create({
        message: 'Please wait...',
        duration: 500
      });
      await loading.present();
      let postedOwnerName = posterOwner.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
      if(this.userData.userName){
              this.fireBaseService.filterActorByName(postedOwnerName).then(element => {
                      if(!(_.isEmpty( element['docs'][0].data()))){ 
                        setTimeout(() => {              
                          this.confData.actorData = {};
                          this.confData.actorData = element['docs'][0].data(); 
                          this.confData.isFromPage = "activity-comments";
                          loading.dismiss();
                          this.router.navigateByUrl('/actor-details');
                          this.dismiss(this.confData.actorData);
                        }, 1000);  
                      } 
                    }); 
              
          }else{
            loading.dismiss();
            this.router.navigateByUrl('/signUp'); 
          }
    }
    async presentToast(msg,type) {
      const toast = await this.toastCtrl.create({
        message: msg,
        animated:true,
        cssClass:type,
        position: 'middle',
        duration: 2000
      });
      toast.present();
    }
}
