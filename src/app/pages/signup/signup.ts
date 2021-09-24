import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../interfaces/user-options';

import { OnInit } from '@angular/core';
import { MenuController, NavController, ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { FireBaseService } from '../../services/firebase.service';
import { UserData } from '../../providers/user-data';
import { ConferenceData } from '../../providers/conference-data';
import { AngularFireAuth } from '@angular/fire/auth';
import * as _ from "lodash";
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  loginName: string;
  dbUsers: any[];
  mobile_s: any;

  constructor(private menu: MenuController,
    private navController: NavController,
    private movieService: FireBaseService, private router: Router,
    public toastController: ToastController,
    public userData: UserData, public loading: LoadingController
    , public actionSheetController: ActionSheetController, public confData: ConferenceData,public ngFireAuth: AngularFireAuth) { }
  isLogin: boolean = true;
  mode: string = "signIn";
  email: string = "";
  password: string = "";
  userName: string = "";
  email_s: string = "";
  password_s: string = "";
  userName_s: string = "";  
  public type = 'password';
  public showPass = false;
  
  loadingProgress;
  ngOnInit() {
  }
  ionViewDidEnter() {
    console.log(this.ngFireAuth.currentUser);
    this.ngFireAuth.onAuthStateChanged((obj)=>{
      this.getUserName();
      this.readUsers();
      console.log(obj);
      console.log(this.ngFireAuth.currentUser);
    });
    
  }
  getUserName() {
    this.userData.getUsername().then((username) => {
       
    });
  }
  async login() {
    let userObj = new User();
    if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)))
    {
      this.presentToastValidation('Invalid email address..!', 'toast-danger');
      return;
    }
    
    else if (!this.email) {
      this.presentToastValidation('Email id cannot be blank..!', 'toast-danger');
      return;
    }
    else if(!this.password){
      this.presentToastValidation('Password cannot be blank..!', 'toast-danger');
      return;
    }
    
    userObj.emailId = this.email;
    userObj.password = this.password;

    this.checkUser(userObj, "signIn");    
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    if (ev.detail.value === "signUp") {
      this.isLogin = false;
      this.mode = "signUp";
    } else {
      this.isLogin = true;
      this.mode = "signIn";
    }
  }
  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'User Type',
      buttons: [{
        text: 'Director',
        role: 'destructive',
        icon: 'megaphone-outline',
        handler: () => {
          this.createUser('D');
        }
      }, {
        text: 'Producer',
        icon: 'cash-outline',
        handler: () => {
          this.createUser('P');
        }
      }, 
      {
        text: 'Actor/Actress',
        icon: 'people',
        handler: () => {
          this.createUser('A');
        }
      },{
        text: 'Music Director',
        icon: 'musical-notes',
        handler: () => {
          this.createUser('MD');
        }
      },
      {
        text: 'Singer',
        icon: 'mic-circle-outline',
        handler: () => {
          this.createUser('S');
        }
      },
      {
        text: 'Choreographer',
        icon: 'walk-outline',
        handler: () => {
          this.createUser('CHORGR');
        }
      },
      {
        text: 'Cinematography',
        icon: 'camera-outline',
        handler: () => {
          this.createUser('DOP');
        }
      },
      {
        text: 'Editor/DI/Colorist',
        icon: 'create-outline',
        handler: () => {
          this.createUser('ETR');
        }
      },
      {
        text: 'Assistant Director',
        icon: 'megaphone',
        handler: () => {
          this.createUser('AD');
        }
      },{
        text: 'Script Writer',
        icon: 'book-outline',
        handler: () => {
          this.createUser('SW');
        }
      },
      {
        text: 'Supporting Artist',
        icon: 'people',
        handler: () => {
          this.createUser('SA');
        }
      },
      {
        text: 'Dubbing Artists',
        icon: 'person-add',
        handler: () => {
          this.createUser('DUB');
        }
      },
      {
        text: 'Equipment Rentals',
        icon: 'briefcase',
        handler: () => {
          this.createUser('EQMT');
        }
      },
      {
        text: 'Dubbing/SFX Studio',
        icon: 'business-outline',
        handler: () => {
          this.createUser('STUD');
        }
      },
      {
        text: 'Viewer',
        icon: 'chatbubbles-outline',
        handler: () => {
          this.createUser('V');
        }
      }
    ]
    });
    await actionSheet.present();
  }

  async checkUser(userObj: User, methodType) {
    this.userData.userName="";
    this.userData.email="";
    this.userData.userType="";
    this.userData.userMob="";
    this.loadingProgress = await this.loading.create({
      message: 'Logging in..',
      duration: 5000
    });
    await this.loadingProgress.present();
    let validUser:boolean=false;
   //this.movieService.signInFireAuth(userObj.emailId,userObj.password);
    //console.log("Hi");
    this.ngFireAuth.signInWithEmailAndPassword(userObj.emailId,userObj.password).then(()=>{
      console.log('logged in:');
      this.movieService.getCurrentUser().then(element => {
        this.loadingProgress.dismiss();
        this.presentToastWelcomeValidation('Welcome  '+element['userName']+"..!", 'toast-success');
        this.userData.login(element['userName'],element['userFlag'],element['isCertified'],element['isVifi']);
        this.userData.setUsername(element['userName']);
        this.userData.userName=element['userName'];
        this.userData.email=element['emailId'];
        this.userData.userType=element['userFlag'];
        this.userData.isVifi=element['isVifi'];
        this.userData.isCertified=element['isCertified'];
        this.userData.userMob=element['mobile'];
        this.router.navigateByUrl('/app/tabs/daily-activities');
        validUser=true;
        return true;
            }).catch(error => {
              this.presentToastValidation(error.message, 'toast-danger');              
            })
      //return user;
     }).catch(error => {      
        if(error.code == 'auth/network-request-failed'){
          this.loadingProgress.dismiss();
          this.presentToastValidation('No Internet Connection/Server may down:Please check & try again!', 'toast-danger');
        }else{
          this.loadingProgress.dismiss();
          this.presentToastValidation(error.message, 'toast-danger');
          return;
        }
         
         return;
     });

    // this.dbUsers.forEach(element => {
    //   if (element['emailId'] === userObj.emailId
    //     && element['password'] === userObj.password && methodType === "signIn"
    //   ) {
    //     this.presentToast('Welcome  '+element['userName']+"..!", 'toast-success');
    //     this.userData.login(element['userName'],element['userFlag']);
    //     this.userData.setUsername(element['userName']);
    //     this.userData.userName=element['userName'];
    //     this.userData.email=element['emailId'];
    //     this.userData.userType=element['userFlag'];
    //     this.userData.isCertified=element['isCertified'];
    //     this.userData.userMob=element['mobile'];
    //     this.router.navigateByUrl('/app/tabs/schedule');
    //     validUser=true;
    //     return true;
    //   } else if (methodType === "signIn" && validUser === false && ((element['emailId'] !== userObj.emailId) ||
    //     element['password'] !== userObj.password
    //   )) {
    //     this.presentToast('Invalid credentials..!', 'toast-danger');
    //     return true;
    //   }


    // });




  }
  async presentToastWelcomeValidation(msg, type){
    const toast = await this.toastController.create({
      header: msg,
      duration: 500,
      cssClass: type,
      position:'middle',
      buttons: [{
        text: 'Close',
        role: 'cancel'
      }]
    });
    toast.present();
  }
  async presentToastValidation(msg, type) {
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
  async presentToastError(msg, type) {
    const toast = await this.toastController.create({
      header: msg,
      duration: 7500,
      position:'middle',
      buttons: [{
        text: 'Close',
        role: 'cancel'
      }]
    });
    toast.present();
  }
  async presentToast(msg, type) {
    const toast = await this.toastController.create({
      header: msg,
      duration: 2500,
      position:'middle',
      buttons: [{
        text: 'Close',
        role: 'cancel'
      }]
    });
    toast.present();
  }
  clearValues() {
    this.userName = '';
    this.password = '';
    this.email = '';
    this.userName_s = '';
    this.password_s = '';
    this.email_s = '';
    this.mobile_s='';
  }
  disableButton:boolean=false;
  async signUp() {
    this.disableButton=true;
    if (!this.email_s && !this.password_s) {
      this.presentToastValidation('Values missing..!', 'toast-danger');
      return;
    } 
    else if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email_s)))
    {
      this.presentToastValidation('Invalid email address..!', 'toast-danger');
      return ;
    }
    else if (! (/^\d{10}$/.test(this.mobile_s)) || (this.mobile_s == 0))
    {
      this.presentToastValidation('Please provide 10 digit valid mobile number!', 'toast-danger');
      return;
    }
    else if (this.password_s =='')
    {
      this.presentToastValidation('Password cannot be empty!', 'toast-danger');
      return;
    }
    else if(this.password_s.length < 6){
      this.presentToastValidation('Password should be atleast 6 characters..!', 'toast-danger');
      return;
    }
    else {
      this.presentActionSheet();
    }

  }

  readUsers() {
    
    this.dbUsers = [];
    this.movieService.readUsers().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        this.dbUsers.push(docData);
      });
      this.movieService.userData=this.dbUsers;
    });
  }
  showPassword() {
    this.showPass = !this.showPass;
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
 }
  async createUser(userType?) {
    let userObj = {};
    userObj['emailId'] = this.email_s;
    
    let isExist = false;
    this.dbUsers.forEach(e => {
      if (e.emailId.split('@')[0] === this.email_s.split('@')[0]) {
        this.presentToastValidation('User already exist..!', 'toast-danger')
        isExist = true;
      }
      
    })
    if (isExist === false) {
      this.loadingProgress = await this.loading.create({
        message: 'Please wait...',
        duration: 2000
      });
      await this.loadingProgress.present();

     // this.movieService.createUsers(userObj).then(creationResponse => {
       // if (creationResponse != null) {
         
          //if(userType==="A" || userType==="MD" || userType==="D" || userType==="P"){
          this.confData.signUpUserData={};
          //userObj['password'] = this.password_s;
          //userObj['userName'] = this.email_s.split('@')[0];
          //userObj['mobile']=this.mobile_s;
          //console.log(userObj['mobile']);
          //userObj['userFlag'] = userType;
          this.confData.signUpUserData['emailId'] =this.email_s;
          this.confData.signUpUserData['password'] =this.password_s;
          this.confData.signUpUserData['userName'] =this.email_s.split('@')[0];
          this.confData.signUpUserData['mobile'] =this.mobile_s;
          this.confData.signUpUserData['userFlag'] =userType;
          this.confData.signUpUserData['userType']=userType;
          console.log(this.confData.signUpUserData['mobile'])
          this.router.navigateByUrl('/create-actor');
          
         // }else{
         //   this.presentToast('Please provide valid information...!', 'toast-danger');
         //   this.loadingProgress.onWillDismiss();
          //  return ;
            //this.clearValues();
            //this.mode="signIn";
         // }
          
       // }
     // })
      //  .catch(error => this.presentToast('Something went Wrong..!', 'toast-danger'));

    }

  }

  openCustom() {

  }



  // onSignup(form: NgForm) {
  //   this.submitted = true;

  //   if (form.valid) {
  //     this.userData.signup(this.signup.username);
  //     this.router.navigateByUrl('/app/tabs/schedule');
  //   }
  // }
}
