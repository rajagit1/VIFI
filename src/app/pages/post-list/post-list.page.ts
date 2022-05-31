import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { FireBaseService } from '../../services/firebase.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from "lodash";
import { window } from 'rxjs/operators';
import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.page.html',
  styleUrls: ['./post-list.page.scss'],
})
export class PostListPage implements OnInit {
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;
  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  isApproveStoriesAvailable:boolean = false;
  confDate: string;
  showSearchbar: boolean;
  posts: any;
  username: string;
  defaultHref = '/app/tabs/schedule';
  constructor(private router: Router, public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private http: HttpClient,
    public firebaseService: FireBaseService,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    private localNotifications: LocalNotifications,
    public config: Config) { }

  ngOnInit() {

  }
  callCloudFunction(obj) {
    let userDetails = [];

    let userArray = [this.username, obj.uploadedBy];
    for (let i = 0; i < userArray.length; i++) {
      this.firebaseService.filterUsers(userArray[i]).get().subscribe(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          userDetails.push(doc.data());
        });
      });
      setTimeout(() => {
        if (i == 1) {
          if (userDetails.length > 0) {
            let emailUrl = "https://us-central1-app-direct-a02bf.cloudfunctions.net/sendMail?dest=" + userDetails[1].emailId;
            emailUrl = emailUrl + '&body=<b>' + this.username + '</b> shown interest on your story. <br> Story is moved to <b>READY TO SHOOT</b> Queue.<br> For more details Contact<br> Email -' + userDetails[0].emailId + ' Mobile # -' + userDetails[0].mobile
            this.callService(emailUrl);
          }
        }
      }, 1500);
    }

  }
  callService(emailUrl) {

    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    this.localNotifications.schedule([{
      id: 2,
      title: 'ViFi Direct - Update',
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
    });
  }
  getUserName() {
    setTimeout(() => {
      this.user.getUsername().then((username) => {
        this.username = username;

      });
    }, 200);
  }
  async ionViewDidEnter() {
    this.getUserName();
    let approvalQueue = [];
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      duration: 2000
    });

    await loading.present();
    this.posts = [];

    this.firebaseService.readPosts().subscribe(data => {
      data.map((e: any) => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        docData['totalFundedBy'] = e.payload.doc.data()['fundedBy'];
        let fundAmt = 0;
        docData['totalFundedBy'].forEach(element => {
          if (element.split('_')[1] != null) {
            fundAmt += Number(element.split('_')[1]);
          }
        });
        docData['totalFundReceived'] = fundAmt;
        this.posts.push(docData);
      });
      this.posts.reverse();

      this.posts = _.filter(this.posts, { 'uploadedBy': this.username, 'shooting': false,'storyStatus':'pendingWithDirector' });      
      this.posts.forEach(element => {
        if (element['budget'] <= element['totalFundReceived']) {
          approvalQueue.push(element);
        }
      });
      this.posts = [...approvalQueue];
      this.posts = _.uniqBy(this.posts,'title'); 
      loading.onWillDismiss();
      this.updateSchedule();
    });
    //this.routeToHome();---Morning check

  }
  returnKValue(number: number, args?: any): any {
    if (isNaN(number)) return null; // will only work value is a number
    if (number === null) return null;
    if (number === 0) return null;
    let abs = Math.abs(number);
    const rounder = Math.pow(10, 1);
    const isNegative = number < 0; // will also work for Negetive numbers
    let key = '';

    const powers = [
      { key: 'Q', value: Math.pow(10, 15) },
      { key: 'T', value: Math.pow(10, 12) },
      { key: 'B', value: Math.pow(10, 9) },
      { key: 'M', value: Math.pow(10, 6) },
      { key: 'K', value: 1000 }
    ];

    for (let i = 0; i < powers.length; i++) {
      let reduced = abs / powers[i].value;
      reduced = Math.round(reduced * rounder) / rounder;
      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }
    return (isNegative ? '-' : '') + abs + key;
  }
  logout() {
    this.router.navigateByUrl('/app/tabs/schedule');

  }


  async updateSchedule() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 2000
    });

    await loading.present();

    loading.onWillDismiss();
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.groups = [];
    let categoryObj = {};
    categoryObj['category'] = "Drama";
    categoryObj['icon'] = "../../../assets/icons/theater.svg";
    this.posts = _.uniqBy(this.posts,'title');  
    categoryObj['posts'] = _.filter(this.posts, { 'generType': 'DRAMA', 'shooting': false,'storyStatus':'pendingWithDirector' });     
    if (categoryObj['posts'].length > 0) {
      this.groups.push(categoryObj);
    }
    //this.groups = _.uniqBy(this.groups,'title');   

    categoryObj = {};
    categoryObj['category'] = "Adventure";
    categoryObj['icon'] = "../../../assets/icons/mountain.svg";
    categoryObj['posts'] = _.filter(this.posts, { 'generType': 'ADVENTURE', 'shooting': false,'storyStatus':'pendingWithDirector' });
    if (categoryObj['posts'].length > 0) {
      this.groups.push(categoryObj);
    }
    //this.groups = _.uniqBy(this.groups,'title');
    categoryObj = {};
    categoryObj['category'] = "Crime";
    categoryObj['icon'] = "../../../assets/icons/theater.svg";
    categoryObj['posts'] = _.filter(this.posts, { 'generType': 'CRIME', 'shooting': false,'storyStatus':'pendingWithDirector' });    
    if (categoryObj['posts'].length > 0) {
      this.groups.push(categoryObj);
    }
    //this.groups = _.uniqBy(this.groups,'title');
    categoryObj = {};
    categoryObj['category'] = "Comedy";
    categoryObj['icon'] = "../../../assets/icons/fun.svg";
    categoryObj['posts'] = _.filter(this.posts, { 'generType': 'COMEDY', 'shooting': false,'storyStatus':'pendingWithDirector' });
    if (categoryObj['posts'].length > 0) {
      this.groups.push(categoryObj);
    }
    //this.groups = _.uniqBy(this.groups,'title');  
    if(this.groups[0] != undefined || this.groups[0].group.posts.length > 0){
      this.isApproveStoriesAvailable = true;
    }
  }
  async presentToast(msg, type) {
    const toast = await this.toastCtrl.create({
      message: msg,
      cssClass: type,
      duration: 2000,
      position: 'middle'
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
  async approve(obj) {
    console.log(this.groups.length);
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure want to lock this story?',
      buttons: [
        {
          text: 'Yes',
          cssClass: 'primary',
          handler: async () => {
            console.log('Story moving to shootmode');
            obj['shooting'] = true;
            obj['storyStatus'] = 'shootingmode';
            obj['shootingStartedDate'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
            this.firebaseService.updatePost(obj['id'], obj);
            const loading = await this.loadingCtrl.create({
              message: 'Updating story...',
              duration: 2000
            });

            await loading.present();

            loading.onWillDismiss();
            this.presentToast('Story moving to shoot mode', 'toast-success');
            let notify = {};
            notify['uploadedBy'] = this.username;
            notify['updateOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
            notify['title'] = obj['title'];
            notify['type'] = 'shooting';
            notify['storyId'] = obj['id'];
            notify['storyUploadedBy'] = obj['uploadedBy'];

            notify['particularUserId'] = this.username;
            notify['msg'] = obj['title'] + " is approved & moved to shoot mode";
            //+ " " + "By " + this, this.username; Its temporarily commented.
            notify['notified']=false;
            this.firebaseService.createNotify(notify).then(creationResponse => {
              if (creationResponse != null) {                
              }              
            });            
             // .catch(error => this.presentToast('Something went Wrong..!', 'toast-danger'));
            //this.callCloudFunction(obj); Mail sending commented for now
            this.ionViewDidEnter();


          }
        },
        {
          text: 'Cancel',
          cssClass: 'danger',
          handler: () => {

            console.log('Cancel');
          }
        }
      ]
    });
    
    // now present the alert on top of all other content
    await alert.present();
    //this.routeToHome();
  }
  async routeToHome(){
    if(this.groups.length == 0){     
        this.router.navigateByUrl('/app/tabs/schedule');                    
    }
  }
  
  async reject(obj) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Still you can modify budget or may be reject this story?',
      buttons: [
        {
          text: 'ModifyBudget & Approve',
          handler: async () => {

            const alert1 = await this.alertCtrl.create({
              inputs: [
                {
                  label: 'Proposed Budget',
                  value: obj.budget,
                  name: 'proposedBudget',
                  type: 'text'
                }],
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                    this.presentToast('Declined for shooting..', 'toast-danger');
                  }
                }, {
                  text: 'Save',
                  handler: async (alertData) => { //takes the data 
                    obj['shooting'] = false;
                    obj['storyStatus']='waitingForFund';
                    if(this.numberOnlyValidation(alertData.proposedBudget)){
                      this.presentToast('Only numbers allowed', 'toast-danger');
                      return;
                    }
                    if(alertData.proposedBudget <= obj.budget){
                      this.presentToast('Cannot enter less than or equal of estimated budget', 'toast-danger');
                      return;
                    }
                    obj['budget'] = alertData.proposedBudget;
                    this.firebaseService.updatePost(obj['id'], obj);                      
                    const loading = await this.loadingCtrl.create({
                      message: 'Updating Fund...',
                      duration: 2000
                    });

                    await loading.present();

                    loading.onWillDismiss();
                    this.presentToast('Story moved to public to get more fund', 'toast-success');
                    this.updateSchedule();
                    //this.ionViewDidEnter();
                  }
                }
              ]
            });
            await alert1.present();
          }
        },
        {
          text: 'I will Check Later',
          handler: () => {
            this.presentToast('Story remains here untill get your approval', 'toast-success');
            console.log('REJECT_YES');
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }


}
