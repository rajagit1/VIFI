import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, IonReorderGroup, AlertController,ToastController, LoadingController,ActionSheetController } from '@ionic/angular';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { FireBaseService } from '../../services/firebase.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { DomSanitizer } from '@angular/platform-browser';
import { UserdetailschildPopupPage } from '../userdetailschild-popup/userdetailschild-popup.page';

@Component({
  selector: 'app-userdetails-popup',
  templateUrl: './userdetails-popup.page.html',
  styleUrls: ['./userdetails-popup.page.scss'],
})
export class UserdetailsPopupPage implements OnInit {
  actorData: any;
  constructor(private loadingCtrl: LoadingController,private navParams: NavParams,public alertCtrl: AlertController,public actionSheetController: ActionSheetController,
    private confData: ConferenceData,public toastController: ToastController,private socialSharing: SocialSharing,
    public modalCtrl: ModalController,private _sanitizer: DomSanitizer, public router: Router,private fireBaseService: FireBaseService,public userData: UserData) { }
 
  ngOnInit() {
    console.log("inside userDetails Pop");
    this.actorData = this.navParams.data.paramID;
    console.log("actor data:::",this.actorData);
  }
  dismiss(data?: any) {    
    this.modalCtrl.dismiss(data);
  }
  async showActorDetailsPopup(actorName){
    /**  this.fireBaseService.filterActorByName(actorName).then(async element => {
      if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.confData.actorData = element['docs'][0].data();
              this.router.navigateByUrl('userdetailschild-popup');
              this.dismiss(this.confData);
           } 
      }); */
      this.fireBaseService.filterActorByName(actorName).then(async element => {
        if(!(_.isEmpty(element['docs'][0].data().actorName))){
                this.confData.actorData = element['docs'][0].data();
                //this.router.navigateByUrl('actordetails-popup');
                const modal = await this.modalCtrl.create({
                  component: UserdetailschildPopupPage,
                  componentProps: {
                    "paramID": this.confData.actorData,
                    "paramTitle": "Test Title"
                  }
                });
                modal.onDidDismiss().then((dataReturned) => {
                  if (dataReturned !== null) {
                    
                  }
                });
                return await modal.present();
               // this.dismiss(this.confData);
             } 
        }); 
    } 
    

}
