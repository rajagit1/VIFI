import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, ToastController, ActionSheetController, AlertController, ModalController, IonInput } from '@ionic/angular';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { FireBaseService } from '../../services/firebase.service';
import { Post, Actor } from '../../interfaces/user-options';
import { UserData } from '../../providers/user-data';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { finalize, mergeMap, switchMap, tap } from 'rxjs/operators';
import _ from 'lodash';
import { ConferenceData } from '../../providers/conference-data';

import { AngularFireAuth } from '@angular/fire/auth';
//image
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { firestore } from 'firebase';
import * as firebase from 'firebase';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UploadMorePage } from '../../upload-more/upload-more.page';

export interface ActorData {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-create-actor',
  templateUrl: './create-actor.page.html',
  styleUrls: ['./create-actor.page.scss'],
  providers: [AngularFirestore]
})
export class CreateActorPage implements OnInit {
  isAudioLoaded: boolean = false;
  isVideoLoaded: boolean = false;
  defaultBanner: boolean = true;
  isMultipleImgLoaded:boolean = false;
  mediaFileType: string;
  finalizedFileurl: string = "";
  //Audio
  ref: AngularFireStorageReference;

  uploadedFileName: string = "";
  name: string = "";
  email: string = "";
  gender: string = "";
  paidOption: string = "";
  language: string = "";
  height: string = "";
  weight: string = "";
  color: string = "";
  mobile: string = "";
  skills: string = "";
  url: string = "";
  profiles = "";
  password = "";
  userFlag = "";
  displayName = "";
  age:any;
  experience: number = 0;
  isImagefinalized: boolean = false;
  isYoutubeRequired: boolean = true;
  youtubeLinkCount: number = 0;
  task: AngularFireUploadTask;


  percentage: Observable<number>;


  snapshot: Observable<any>;


  UploadedFileURL: Observable<string>;


  images: Observable<ActorData[]>;
  imageArray : any[];
  fileName: string;
  fileSize: number;

  requredUserTypes = ['A','SA'];
  isUploading: boolean;
  isUploaded: boolean;
  UploadedFilePath: string = "../../../assets/icons/actor-color.svg";
  private imageCollection: AngularFirestoreCollection<ActorData>;
  loadingProgress: HTMLIonLoadingElement;
  defaultHref: string = '';
  userType: string = "";
  profilesArray:any[];
  //image
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isImageCropped: boolean = false;
  isImageCropperShown: boolean = false;
  isImageCropperShown2: boolean = false;
  finalizedImageUrl: string = "";
  isUserCreated = false;

  disableButton = false;
  pageHeader: string;
  isFromAbout: boolean = false;
  showPreview: boolean = true
  docId: string;
  userImageToUpdate: string;

  public myForm: FormGroup;
  private playerCount: number = 1;

  constructor(private formBuilder: FormBuilder, public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router, public confData: ConferenceData,
    private fireBaseService: FireBaseService, public userData: UserData,
    public actionSheetController: ActionSheetController, private storage: AngularFireStorage,
    private database: AngularFirestore, public ngFireAuth: AngularFireAuth
  ) {

    this.imageCollection = database.collection<ActorData>('actorThumbnails');
    this.images = this.imageCollection.valueChanges();

    this.myForm = formBuilder.group({
      player1: ['', Validators.required]
    });
  }

  addControl() {
    this.playerCount++;
    this.myForm.addControl('player' + this.playerCount, new FormControl('', Validators.required));
  }
  removeControl(control) {
    this.myForm.removeControl(control.key);
  }
  /**
   * Upload page
   * @param activityObj 
   */
  //async showModal(activityObj) {
    async showModal() {
      
    const modal = await this.modalCtrl.create({
      component: UploadMorePage,
      componentProps: {
         
        "mobile": this.mobile,
        "name": this.isFromAbout == true ? this.userData.aboutData['userName'] :  this.confData.signUpUserData['userName'],
        "email": this.confData.signUpUserData['emailId'],
        "userType": this.confData.signUpUserData['userType'],
        "password": this.confData.signUpUserData['password'],
        "userFlag": this.confData.signUpUserData['userFlag'],
        "docId":this.docId
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.mobile = dataReturned.data['mobile'];
         
        this.name = dataReturned.data['name'];
        this.email = dataReturned.data['email'];
        this.userType = dataReturned.data['userType'];
       
        this.password = dataReturned.data['password'];
        this.userFlag = dataReturned.data['userFlag'];
        this.imageArray = dataReturned.data['imageArray'];
        if(this.imageArray.length > 0){
           this.isMultipleImgLoaded =  true;
        }
      }
    });
    return await modal.present();
  }

  onChange(val) {

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
  logout() {
    this.profilesArray = [];
    this.uploadedFileName = '';
    this.isYoutubeRequired = true;
    this.isUserCreated = true;
    this.isImagefinalized = false;
    this.finalizedImageUrl = "";
    this.router.navigateByUrl('/app/tabs/schedule');
  }

  ionViewDidEnter() {
    this.isImagefinalized = false;
    if (this.confData.signUpUserData['userType'] == 'P') {
      this.isYoutubeRequired = false;
    }
    this.mobile = this.confData.signUpUserData['mobile'];
    this.name = this.confData.signUpUserData['userName'];
    this.email = this.confData.signUpUserData['emailId'];
    this.userType = this.confData.signUpUserData['userType'];
    //User data
    this.password = this.confData.signUpUserData['password'];
    this.userFlag = this.confData.signUpUserData['userFlag'];
    //userObj['userName'] = this.email_s.split('@')[0];
    //userObj['mobile']=this.mobile_s;
    //userObj['userFlag'] = userType;


    if (!_.isEmpty(this.confData.signUpUserData) && this.confData.signUpUserData['userName'] != '') {
      this.defaultHref = "/signUp";
      this.pageHeader = "Create Profile";
      //this.confData.signUpUserData['userName'] = '';
    }
    else {
      this.defaultHref = `/app/tabs/schedule`;
      this.pageHeader = "Create Profile";
    }

    if (this.userData.isFromAbout == true) {
      let updateUserId, updateImage, age, experience, displayName,paidOption,color,language,weight,height;
      this.isFromAbout = true;
      if (!_.isEmpty(this.userData.aboutData)) {
        paidOption = this.userData.aboutData['paidOption'];
        color = this.userData.aboutData['color'];
        language = this.userData.aboutData['language'];
        weight = this.userData.aboutData['weight'];
        height = this.userData.aboutData['height'];

        age = this.userData.aboutData['age'];
        displayName = this.userData.aboutData['displayName'];
        experience = this.userData.aboutData['experience'];
        updateUserId = this.userData.aboutData['userName'];
        updateImage = this.userData.aboutData['userImage'];
        this.age = age;
        this.experience = experience;
        this.name = updateUserId;
        this.finalizedImageUrl = updateImage;

        this.paidOption = paidOption;
        this.color = color;
        this.language = language;
        this.weight = weight;
        this.height = height;
      }

      this.userData.isFromAbout = false;
      this.defaultHref = `/app/tabs/about`;
      this.pageHeader = "Update Profile";

      this.fireBaseService.filterActors(updateUserId).get().subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.docId = doc.id;
          this.age = doc.data().age;
          this.experience = doc.data().experience;
          this.displayName = doc.data().displayName;
          // this.userDetailsData.push(doc.data()); how to handle more than one approvals,so need to concentrate
          this.skills = doc.data().skills;
          this.profiles = doc.data().profiles;
          this.gender = doc.data().gender.toLowerCase();
          this.mobile = doc.data().mobile;
          this.userType = doc.data().userType;
          this.userImageToUpdate = doc.data().image;
          this.profilesArray = doc.data().profilesArray;
          this.imageArray = doc.data().imageArray;

        });
      });
    }
  }

  ngOnInit() {
  }
  /***
     * uploadFile
     */
  /**async uploadFile(event: FileList) {



    const file = event.item(0)


    if (file.type.split('/')[0] !== 'image') {
      this.presentToast('Upsupported image type..!', 'toast-danger');
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Uploading Thumbnail..',
      duration: 11000
    });
    await this.loadingProgress.present();
    this.fileName = file.name;

    // The storage path
    const path = `actorThumbnails/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'app-direct' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });
    this.task.percentageChanges().subscribe(res => {
      
      if (res === 100) {
        this.presentToast('Thumbnail uploaded..!', 'toast-success');
        this.isUploaded = true;
        this.loadingProgress.onWillDismiss();
        this.UploadedFileURL = fileRef.getDownloadURL();
        this.UploadedFileURL.subscribe(resp => {
          this.UploadedFilePath = resp;

          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
        });
      }
    });
    // Get file progress percentage
    this.percentage = this.task.percentageChanges();

  }

  addImagetoDB(image: ActorData) {
    //Create an ID for document
    const id = this.database.createId();

    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }
   **/
  addImagetoDB(image: ActorData) {
    //Create an ID for document
    const id = this.database.createId();
    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {

    }).catch(error => {
      console.log("error " + error);
    });
  }
  fileChangeEventForVideoAudio(fileEvent: any): void {
    this.uploadedFileName = '';
    const file = fileEvent.target.files[0];
    if(file.type == "" || file.type == undefined){
      this.presentToast("Recommended .mp3/mp4 format","toast-danger");
      return;
    }
    const sizeInMB = parseInt((file.size / (1024 * 1024)).toFixed(0));
    console.log('size', sizeInMB);
    console.log('type', file.type);
    if (sizeInMB <= 50) {
      if (file.type.split('/')[0] == 'audio') {
        console.log("inside Audio....");
        this.mediaFileType = "audio";
        this.saveAudioToFireStore(fileEvent);
      }
      if (file.type.split('/')[0] == 'video') {
        console.log("inside video....");
        this.mediaFileType = "video";
        this.saveVideoToFireStore(fileEvent);
      }
    } else { 
      this.presentToast("Maximum 50MB allowed","toast-danger");
      return;
      //To do -Must do it
      //this.saveTrimmedVideo(fileEvent);
    }
  }
  fileChangeEvent(event: any): void {
    this.isImageCropperShown = true;
    this.imageChangedEvent = event;
    this.fileName = event.target.files[0].name;
    this.fileSize = event.target.files[0].size;
    if (this.isFromAbout == true) {
      this.isImageCropperShown2 = true;
    }
    // this.uploadFile(this.croppedImage,this.fileName);
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.isImageCropped = true;
    this.approveCroppedImage(this.croppedImage, this.fileName);
    if (this.isFromAbout == true) {
      this.showPreview = false;
    }
  }
  async approveCroppedImage(croppedImage, fileName) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure to fix this image?',
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            this.uploadFile(croppedImage, fileName);
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log('REJECT_YES');
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }
  imageLoaded(image: HTMLImageElement) {
    //this.presentToast('image is loaded..!','toast-success');
  }
  cropperReady(event: any) {
    this.isImageCropped = true;
    //this.presentToast('Cropping is done..!','toast-success');     

  }
  loadImageFailed() {
    this.presentToast('Invalid Image. Please select right one!', 'toast-danger');
  }
  hideCropImage() {
    console.log("hideCropImage");
  }


  loading = false;
  async uploadFile(event, file) {
    this.loading = true;
    const path = `actorThumbnails/${new Date().getTime()}_${file}`;
    const storageRef = this.storage.ref(path);
    const base64Response = await fetch(event);
    const blob_file = await base64Response.blob();
    const task = this.storage.upload(path, blob_file);

    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Croping your image...please wait',
      duration: 5000
    });

    await this.loadingProgress.present();
    return from(task).pipe(
      switchMap(() => storageRef.getDownloadURL()),
      tap(url => {
        this.finalizedImageUrl = url;       
        this.isImagefinalized = true;


      }),

      finalize(() => this.loading = false)
    ).subscribe((resp) => {     
      if (resp == undefined) {
        this.presentToast('You have selected invalid image!', 'toast-danger');
        this.loadingProgress.onWillDismiss();
        return;
      }
      this.UploadedFileURL = resp;
      this.UploadedFilePath = resp;
      this.addImagetoDB({
        name: file,
        filepath: resp,
        size: this.fileSize
      });
      this.isUploaded = true;
      this.loadingProgress.onWillDismiss();
      this.presentToast('Image cropped successfully', 'toast-success');
      if (this.isFromAbout == true) {
        this.showPreview = true;
      }
    }, error => {     
      this.presentToast('You have selected invalid image!', 'toast-danger');
      this.isUploaded = false;
    });
  }
  async createActor() {

    if (this.isFromAbout == true) {
      let actorObj = {};
      if(this.name !== undefined){
      actorObj['actorName'] = this.name;
      }
      if(this.age !== undefined){
      actorObj['age'] = parseInt(this.age,10);
      }
      if(this.experience !== undefined){
      actorObj['experience'] = this.experience;
      }
      if(this.paidOption !== undefined){
      actorObj['paidOption'] = this.paidOption;
      }
      if(this.color !== undefined){
       actorObj['color'] = this.color;
      }
      if(this.language !== undefined){
      actorObj['language'] = this.language;
      }
      if(this.weight !== undefined){
      actorObj['weight'] = this.weight;
      }
      if(this.height !== undefined){
      actorObj['height'] = this.height;
      }
      
      if(this.displayName !== ''){
       actorObj['displayName'] = this.displayName;
      }else{
        this.presentToast("Please provide DisplayName","toast-danger");
        return;
      }

      if(this.imageArray !== undefined ){
        actorObj['imageArray'] = this.imageArray;
      }else{
        actorObj['imageArray'] =[];
      } 
      //New Code for avoid displaying the music director names in map actor/actress/music director page
      if (this.userType == 'MD') {
        actorObj['gender'] = this.gender === 'f' ? 'Music_F' : 'Music_M';
      } else if (this.userType == 'P') {
        actorObj['gender'] = this.gender === 'f' ? 'Producer_F' : 'Producer_M';
      }
      else if (this.userType == 'D') {
        actorObj['gender'] = this.gender === 'f' ? 'Director_F' : 'Director_M';
      }
      else if (this.userType == 'V') {
        actorObj['gender'] = this.gender === 'f' ? 'Viewer_F' : 'Viewer_M';
      }
      else if (this.userType == 'S') {
        actorObj['gender'] = this.gender === 'f' ? 'Singer_F' : 'Singer_M';
      } else if (this.userType == 'ETR') {
        actorObj['gender'] = this.gender === 'f' ? 'Editor_F' : 'Editor_M';
      } else if (this.userType == 'DOP') {
        actorObj['gender'] = this.gender === 'f' ? 'DOP_F' : 'DOP_M';
      } else if (this.userType == 'AD') {
        actorObj['gender'] = this.gender === 'f' ? 'AD_F' : 'AD_M';
      } else if (this.userType == 'SW') {
        actorObj['gender'] = this.gender === 'f' ? 'SW_F' : 'SW_M';
      } else if (this.userType == 'SA') {
        actorObj['gender'] = this.gender === 'f' ? 'SA_F' : 'SA_M';
      } else if (this.userType == 'CHORGR') {
        actorObj['gender'] = this.gender === 'f' ? 'CHORGR_F' : 'CHORGR_M';
      } else if (this.userType == 'EQMT') {
        actorObj['gender'] = this.gender === 'f' ? 'EQMT_F' : 'EQMT_M';
      } else if (this.userType == 'STUD') {
        actorObj['gender'] = this.gender === 'f' ? 'STUD_F' : 'STUD_M';
      } else if (this.userType == 'DUB') {
        actorObj['gender'] = this.gender === 'f' ? 'DUB_F' : 'DUB_M';
      } else {
        actorObj['gender'] = this.gender === 'f' ? 'F' : 'M';
      }

      actorObj['skills'] = this.skills;
      actorObj['image'] = !this.isImageCropperShown2 ? this.userImageToUpdate : this.UploadedFilePath;
      if (this.finalizedFileurl !== undefined && this.finalizedFileurl !== '') {
        actorObj['mediaFile'] = this.finalizedFileurl;
      } else {
        actorObj['mediaFile'] = "";
      }
      actorObj['mobile'] = this.mobile;

      const mapped = Object.keys(this.myForm.value).map(key => ({ type: key, value: this.myForm.value[key] }));
      if(this.profilesArray !== undefined){
      actorObj['profilesArray'] = this.profilesArray;
      }else{
        actorObj['profilesArray'] = [];
      }
      mapped.forEach((element) => {
        const yotubeLink = this.parseVideo(element.value);
        if (yotubeLink) {
          actorObj['profilesArray'].push('https://www.youtube.com/watch?v=' + yotubeLink);
        } else {
          if (Number(this.experience) !== 0) {
            this.presentToast('Please provide valid youtube url.Example.[https://www.youtube.com/watch?v=zls4a7I_qaM]', 'toast-danger');
            return;
          }
        }
      });
      this.fireBaseService.updateActros(this.docId, actorObj);
      const totalRequiredFieldsForCast : number = 8;
      const countOfRequiredFields : any = this.getCountOfRequiredFields(actorObj);
      let p = (100 * countOfRequiredFields) / totalRequiredFieldsForCast;
      this.userData.profilecompletionPercentage = p/100;
      this.presentToast('Profile Updated !', 'toast-success');
      this.isFromAbout = false;
      this.router.navigateByUrl(`/app/tabs/about`);
      return;
    } else {
      if (this.userType == 'V') {
        this.skills = "I came here to view the stories and map correct face to right story";//Dummy data to avoid validation error for view
      }
      if (this.userType !== 'V' && _.isEmpty(this.name) || _.isEmpty(this.skills)) {
        this.presentToast('Please provide valid input..!', 'toast-danger');
        return true;
      }
      if (this.userType !== 'V' && this.isUploaded == undefined || this.isUploaded == false) {
        this.presentToast('Please upload your photo...!', 'toast-danger');
        return true;
      }
      if (this.gender == undefined || this.gender == 'select' || this.gender == "" || _.isEmpty(this.gender) || this.gender == '') {
        this.presentToast('Please select gender...!', 'toast-danger');
        return true;
      }


      let actorObj = {};
      if(this.displayName !== ''){
        actorObj['displayName'] = this.displayName;
       }else{
         this.presentToast("Please provide DisplayName","toast-danger");
         return;
       }      
      actorObj['age'] = parseInt(this.age,10);
      actorObj['experience'] = this.experience;
      actorObj['actorName'] = this.name;
      actorObj['userType'] = this.userType;
      //New Code for avoid displaying the music director names in map actor/actress/music director page
      if (this.userType == 'MD') {
        actorObj['gender'] = this.gender === 'f' ? 'Music_F' : 'Music_M';
      } else if (this.userType == 'P') {
        actorObj['gender'] = this.gender === 'f' ? 'Producer_F' : 'Producer_M';
      }
      else if (this.userType == 'D') {
        actorObj['gender'] = this.gender === 'f' ? 'Director_F' : 'Director_M';
      }
      else if (this.userType == 'V') {
        actorObj['gender'] = this.gender === 'f' ? 'Viewer_F' : 'Viewer_M';
      } else if (this.userType == 'S') {
        actorObj['gender'] = this.gender === 'f' ? 'Singer_F' : 'Singer_M';
      } else if (this.userType == 'ETR') {
        actorObj['gender'] = this.gender === 'f' ? 'Editor_F' : 'Editor_M';
      } else if (this.userType == 'DOP') {
        actorObj['gender'] = this.gender === 'f' ? 'DOP_F' : 'DOP_M';
      } else if (this.userType == 'AD') {
        actorObj['gender'] = this.gender === 'f' ? 'AD_F' : 'AD_M';
      } else if (this.userType == 'SW') {
        actorObj['gender'] = this.gender === 'f' ? 'SW_F' : 'SW_M';
      } else if (this.userType == 'SA') {
        actorObj['gender'] = this.gender === 'f' ? 'SA_F' : 'SA_M';
      } else if (this.userType == 'CHORGR') {
        actorObj['gender'] = this.gender === 'f' ? 'CHORGR_F' : 'CHORGR_M';
      } else if (this.userType == 'EQMT') {
        actorObj['gender'] = this.gender === 'f' ? 'EQMT_F' : 'EQMT_M';
      } else if (this.userType == 'STUD') {
        actorObj['gender'] = this.gender === 'f' ? 'STUD_F' : 'STUD_M';
      } else if (this.userType == 'DUB') {
        actorObj['gender'] = this.gender === 'f' ? 'DUB_F' : 'DUB_M';
      } else {
        actorObj['gender'] = this.gender === 'f' ? 'F' : 'M';
      }
      //actorObj['gender'] = this.gender === 'f' ? 'F' : 'M'; old code
      actorObj['createdOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
      actorObj['skills'] = this.skills;
      actorObj['image'] = this.UploadedFilePath;
      actorObj['associatedStories'] = [];      
      actorObj['likes'] = [];
      actorObj['visitors'] = [];
      actorObj['visitorsName'] = [];
      actorObj['mobile'] = this.mobile;
      
      if(this.imageArray !== undefined){
        actorObj['imageArray'] = this.imageArray;
      }else{
        actorObj['imageArray'] =[];
      }

      if (this.finalizedFileurl !== undefined && this.finalizedFileurl !== '') {
        actorObj['mediaFile'] = this.finalizedFileurl;
      } else {
        actorObj['mediaFile'] = "";
      }
      if (this.isYoutubeRequired && this.userType !== 'V') {
        //To do
        //this.myForm.value
        const mapped = Object.keys(this.myForm.value).map(key => ({ type: key, value: this.myForm.value[key] }));
        actorObj['profilesArray'] = [];
        mapped.forEach((element) => {
          const yotubeLink = this.parseVideo(element.value);
          if (yotubeLink) {
            actorObj['profilesArray'].push('https://www.youtube.com/watch?v=' + yotubeLink);
          } else {
            if (Number(this.experience) !== 0) {
              this.presentToast('Please provide valid youtube url.Example.[https://www.youtube.com/watch?v=zls4a7I_qaM]', 'toast-danger');
              return;
            }
          }
        });

      }
      this.loadingProgress = await this.loadingCtrl.create({

        message: 'Creating..',
        duration: 2500
      });
      let actorType;
      await this.loadingProgress.present();
      let userObj = {};
      const uid = JSON.parse(localStorage.getItem('user'));
      userObj['emailId'] = this.email;
      userObj['password'] = this.password;
      userObj['userName'] = this.name;
      userObj['mobile'] = this.mobile;
      userObj['userFlag'] = this.userFlag;
      this.disableButton = true;

      this.fireBaseService.registerUser(userObj['emailId'], userObj['password'])
        .then((res) => {
          userObj['uid'] = res.user.uid;
          this.fireBaseService.createUsers(userObj).then(creationResponse => {
            if (creationResponse != null) {
              this.fireBaseService.createActors(actorObj).then(creationResponse => {
                if (creationResponse != null) {
                  if (this.gender == 'm') actorType = 'Actor'; else actorType = 'Actress';
                  this.presentToast(' User Created successfully!', 'toast-success');
                  this.isUserCreated = true;
                  this.loadingProgress.onWillDismiss();
                  this.clearValues();
                  if (this.defaultHref.indexOf("/signUp") >= 0) {
                    this.router.navigateByUrl('/signUp');
                  } else {
                    this.router.navigateByUrl('/app/tabs/schedule');
                  }

                }
              })
                .catch(error => this.presentToast('Network/Server may slow.Please try after sometime...!', 'toast-danger'));
            }
          }).catch(error => this.presentToast('Network/Server may slow.Please try after sometime...!', 'toast-danger'));
        }).catch((error) => {
          this.presentToast(error.message, 'toast-danger');
          this.disableButton = false;
        });

      //this.userData.uid = user.uid;
      //localStorage.setItem('user', JSON.stringify(this.userData.uid));
      // JSON.parse(localStorage.getItem('user'));


    }


  }
  clearValues() {
    this.name = '';
    this.skills = '';
    this.profiles = '';
    this.UploadedFilePath = '../../../assets/icons/actor-color.svg';
    this.mobile = '';

  }
  getCountOfRequiredFields(obj){
    let totalRequiredFieldsCount : number = 0;
    if(obj.age){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.color){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.displayName){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.height){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.weight){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.language){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.paidOption){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    if(obj.experience){
      totalRequiredFieldsCount = totalRequiredFieldsCount +1;
    }
    return totalRequiredFieldsCount;
  }
  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  parseVideo(url) {
    var re = /\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_\-]+)/i;
    var matches = re.exec(url);
    return matches && matches[1];
  }
  async saveVideoToFireStore(fileEvent) {
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Uploading Video..',
      duration: 13500
    });
    await this.loadingProgress.present();
    const file = fileEvent.target.files[0];
    const videoBlob: any = new Blob([file], { type: 'video/mp4,flv,mkv,wmv,mov,mpg,rm,3g2' });
    const id = Math.random().toString(36).substring(2);
    this.ref = this.storage.ref(id);
    let metadata = {
      contentType: 'video/mp4,flv,mkv,wmv,mov,mpg,rm,3g2',
    };
    const storageRef = firebase.storage().ref();
    const uploadAudio = storageRef.child(`users_videos/${file.name}`)
      .put(videoBlob, metadata).then((sus) => {
        sus.ref.getDownloadURL().then((url) => {
          if (url !== '') {
            this.defaultBanner = false;
            this.isAudioLoaded = false;
            this.isVideoLoaded = true;
            this.finalizedFileurl = url;
            this.uploadedFileName = file.name;
            this.presentToast(this.uploadedFileName+" File uploaded","toast-success");
            this.loadingProgress.onWillDismiss();
          }

        }).catch((er) => {
          console.log('Error:', er)
          // this.utils.presentToastSimple('Error al obtener ruta del audio: ' + er, 5000);
        });
      }).catch((error) => {
        console.log('Error al guardar la imagen: ', error);
      });

  }

  async saveAudioToFireStore(fileEvent) {
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Uploading Audio..',
      duration: 12000
    });
    await this.loadingProgress.present();
    const file = fileEvent.target.files[0];
    const audioBlob: any = new Blob([file], { type: 'audio/mp3,m4a,flac,mp4,wav,wma,aac' });    
    const id = Math.random().toString(36).substring(2);
    this.ref = this.storage.ref(id);
    let metadata = {
      contentType: 'audio/mp3',
    };
    const storageRef = firebase.storage().ref();
    const uploadAudio = storageRef.child(`users_audios/${file.name}`)
      .put(audioBlob, metadata).then((sus) => {
        sus.ref.getDownloadURL().then((url) => {
          if (url !== '') {
            this.defaultBanner = false;
            this.isAudioLoaded = true;
            this.isVideoLoaded = false;            
            this.finalizedFileurl = url;
            this.uploadedFileName = file.name;
            this.presentToast(this.uploadedFileName+" File uploaded","toast-success");
            this.loadingProgress.onWillDismiss();
          }
        }).catch((er) => {
          console.log('Error:', er)
          // this.utils.presentToastSimple('Error al obtener ruta del audio: ' + er, 5000);
        });
      }).catch((error) => {
        console.log('Error al guardar la imagen: ', error);
      });

  }
}
