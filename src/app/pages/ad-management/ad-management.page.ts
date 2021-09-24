import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FireBaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ad-management',
  templateUrl: './ad-management.page.html',
  styleUrls: ['./ad-management.page.scss'],
})
export class AdManagementPage implements OnInit {

  //Ad Management properties
  screenName :any="";
  isBannerRequired:boolean= false;
  isInterstitialRequired:boolean =false;
  isRewardVideoRequired:boolean=false;
  typeofAd:any;
  unitId:any;
  constructor(public fireBase: FireBaseService,public router: Router, public modalCtrl: ModalController,public toastController: ToastController) { }

  ngOnInit() {
  }
  updateAdUnit(){
    let obj ={};
    obj['typeofAd'] =this.typeofAd;
    obj['unitId'] =this.unitId;
    if(this.typeofAd == 'banner'){
      this.fireBase.updateAdsUnit('3qEDu2xSrLLXUFHBIhvq',obj);
      this.presentToast('Updated!', 'toast-success');
  
    }
    if(this.typeofAd == 'rewardVideo'){
      this.fireBase.updateAdsUnit('8tmSNCfpgunlx55yHhYd',obj);
      this.presentToast('Updated!', 'toast-success');
    }
    if(this.typeofAd == 'interstitial'){
      this.fireBase.updateAdsUnit('GSOKDHO1JGRdpstDNu4Q',obj);
      this.presentToast('Updated!', 'toast-success');
    }
  }
  updateAdManagement(){
    let obj ={};
    obj['isBannerAdsRequired'] =this.isBannerRequired;
    obj['isInterstitialAdsRequired'] =this.isInterstitialRequired;
    obj['isRewardVideoAdsRequired'] =this.isRewardVideoRequired;
    obj['screenName'] =this.screenName;
    if(this.screenName == 'dailyActivities'){
      this.fireBase.updateAdManagement('9N5QQBUrfDiIWvWBsMU0',obj);
      this.presentToast('Updated!', 'toast-success');
  
    }
    if(this.screenName == 'trending'){
      this.fireBase.updateAdManagement('H5Qjz16l6TimIQ8KRbUr',obj);
      this.presentToast('Updated!', 'toast-success');
    }
    if(this.screenName == 'profile'){
      this.fireBase.updateAdManagement('lyi3oxXKOR88tYX9szic',obj);
      this.presentToast('Updated!', 'toast-success');
    }
  }
  screenChange(obj){
    this.screenName = obj.target.value; 
}
isBannerRequiredChange(obj){
  if(obj.target.value == "yes"){
    this.isBannerRequired = true;
  }else{
    this.isBannerRequired = false;
  }
}
isInterstitialRequiredChange(obj){
  if(obj.target.value == "yes"){
    this.isInterstitialRequired = true;
  }else{
    this.isInterstitialRequired = false;
  }
}
isRewardVideoRequiredChange(obj){
  if(obj.target.value == "yes"){
  this.isRewardVideoRequired = true
  }else{
    this.isRewardVideoRequired = false;
  }
}
dismiss() { 
  //this.router.navigateByUrl('/app/tabs/about');
  this.modalCtrl.dismiss();
}
async presentToast(msg, type) {
  const toast = await this.toastController.create({
    message: msg,
    cssClass: type,
    duration: 1000,
    position: 'middle'
  });
  toast.present();
}
}
