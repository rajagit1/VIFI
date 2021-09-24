import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { MenuController, NavController,AlertController, ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { FireBaseService } from '../../services/firebase.service';
import { UserData } from '../../providers/user-data';
import { ConferenceData } from '../../providers/conference-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import * as _ from "lodash";
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgot-password.html',
  styleUrls: ['./signup.scss'],
})
export class ForgotPasswordPage {
  loginName: string;
  dbUsers: any[];
  mobile_s: any;
  email_s:string="";
  defaultHref = "/signUp";
  constructor(private menu: MenuController,
    public loadingCtrl: LoadingController,
    private navController: NavController,
    private localNotifications: LocalNotifications,
    private fireBaseService: FireBaseService, private router: Router,
    public toastController: ToastController,
    private http: HttpClient,
    public alertCtrl: AlertController,
    public userData: UserData, public loading: LoadingController
    , public actionSheetController: ActionSheetController, public confData: ConferenceData,public ngFireAuth: AngularFireAuth) { }
    
   async forgotPassword(){
     if(_.isEmpty(this.email_s)){
      this.presentToast('Email id cannot be blank', 'toast-danger');
      return;
     }
     
     if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email_s)))
     {
       this.presentToast('Invalid email address..!', 'toast-danger');
       return;
     }
    const loading = await this.loadingCtrl.create({
      message: 'Verifying Mail...',
      duration: 3000
    });
    await loading.present();
    //this.ngFireAuth.onAuthStateChanged((obj)=>{
      
      if( !(_.isEmpty(this.email_s)) && this.email_s !== undefined
       && this.email_s !== ''){
                const requestedUserName = this.email_s.split("@")[0];
                //let userInfo = [];
             /** this.fireBaseService.filterUsers(requestedUserName).get().subscribe( (querySnapshot) =>{
                querySnapshot.forEach(function (doc) {
                  userInfo.push(doc.data());      
                });*/
                //The below method written forr get whatsappnumber but here also required the same
                //method to retrive the user information so reused the same method
                this.fireBaseService.getwhatsAppNumber(requestedUserName.split('_')[0]).then(element => {
                  if(!(_.isEmpty(element['password']))){
                          setTimeout(() => {            
                                let emailUrl = "https://us-central1-app-quick-direct.cloudfunctions.net/sendMail?dest=" + this.email_s;
                                emailUrl = emailUrl + '&body=Hi '+requestedUserName.charAt(0).toUpperCase()+requestedUserName.slice(1)+',<br>'+'A request has been received to send the password of your account.Please fnd the password below,'
                                +'<br>'+'Your password : <b>' + element['password'] + '</b>';
                                this.callService(emailUrl);      
                                loading.dismiss();         
                          }, 1500);
                        }else{                          
                          loading.dismiss(); 
                          this.presentToast('User not exist..!', 'toast-danger');
                          return;
                        }
              }).catch(error => {                 
                loading.dismiss();
                this.presentToast(error.message, 'toast-danger');
                return;             
              })
        }
     // });
  }
  async callService(emailUrl) {
    
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    this.localNotifications.schedule([{
      id: 2,
      title: 'Forgot Password Mail',
      text: 'You have received your password..!',
      icon: '../../../assets/icons/Black And Red.png'
    }]);
    this.http.get(emailUrl, { headers: headers, responseType: "text" }).subscribe(async data => {
      const alert = await this.alertCtrl.create({
        header: 'Forgot Password Mail',
        message: data,
        buttons: ['OK']
      });
      await alert.present();
    }, err => {
      console.error('Oops:', err.message);
    });
  }
  
  async resetPassword(){
    if(_.isEmpty(this.email_s)){
      this.presentToast('Email id cannot be blank', 'toast-danger');
      return;
     }else{
        const loading = await this.loadingCtrl.create({
          message: 'Sending Mail...',
          duration: 3000
        });
        await loading.present();
            this.ngFireAuth.sendPasswordResetEmail(this.email_s).then(
              () => {
                  loading.dismiss(); 
                  this.presentToast('Reset passwod link sent to your mail id!', 'toast-danger');
                  return;        
              },
              err => {
                loading.dismiss(); 
                this.presentToast('User not exist..!', 'toast-danger');
                  return;    
              }
            );
          } 
  }
  async presentToast(msg, type) {
    const toast = await this.toastController.create({
      header: msg,
      duration: 1500,
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