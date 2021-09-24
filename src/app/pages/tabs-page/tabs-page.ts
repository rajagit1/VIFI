 
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { ToastController } from '@ionic/angular';
@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  role: string;

  constructor(public router: Router,public userData:UserData,public toastController: ToastController
 
  ) {

  }
  ngOnInit(){
   this.userData.getRole().then((role) => {
      this.role = role;
      console.log(this.role);
    });
  }
  ionViewDidEnter(){
    let networkStatus = (window.navigator.onLine ? 'on' : 'off') + 'line'
    if(networkStatus == 'offline' ){
      this.presentToast('No Internet Connection:Please turn on your network connection!', 'toast-danger');
      return;
    }
//document.getElementById('statusCheck').addEventListener('click', () => console.log('window.navigator.onLine is ' + window.navigator.onLine));
    this.userData.getRole().then((role) => {
      this.role = role;
      console.log(this.role);
    });
    
  }
  createPost(){
    this.router.navigateByUrl('/create-post');
  }
  async presentToast(msg, type) {
    const toast = await this.toastController.create({
      header: msg,
      duration: 2500,
      cssClass: type,
      position:'middle',
      buttons: [{
        text: 'Close',
        role: 'cancel'
      }]
    });
    toast.present();
  }

} 
