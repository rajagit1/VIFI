import { Component } from '@angular/core';
import { Config,NavController,AlertController, ModalController, NavParams, ToastController, LoadingController,ActionSheetController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { UserData } from '../../providers/user-data';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/auth';
import { from,Observable } from 'rxjs';
import { AngularFireStorage,AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
//image
import { ImageCroppedEvent } from 'ngx-image-cropper';
//Audio
import {Media,MediaObject} from "@ionic-native/media/ngx";
import {File} from "@ionic-native/file/ngx";
import { firestore } from 'firebase';
import * as firebase from 'firebase';
import { finalize, mergeMap, switchMap, tap } from 'rxjs/operators';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-post-activities',
  templateUrl: 'post-activities.page.html',
  styleUrls: ['./post-activities.page.scss'],
})
export class PostActivitiesPage {
   //image property starts
   UploadedFileURL: Observable<string>;
   images: Observable<MyData[]>;
 
    mediaFileType:string;
   fileName: string;
   fileSize: number;
   showPreview: boolean = true;
   storyImageToUpdate: string;
   isUploading: boolean;
   isUploaded: boolean;
   UploadedFilePath: string;
   imageChangedEvent: any = '';
   croppedImage: any = '';
   isImageCropped:boolean=false;
   isImageCropperShown: boolean = true ; 
   finalizedImageUrl:string="";
   isImagefinalized:boolean=false;
   private imageCollection: AngularFirestoreCollection<MyData>;
   //image property ends
   
 
   selectOptions = {
     header: 'Select a range'
   };
   finalizedFileurl:string="";
   userThought:string;
   pageHeader:string;
   username: string;
   loadingProgress;
   isPosted:boolean=false;
   result:string="";
 
   isAudioLoaded:boolean=false;
   isVideoLoaded:boolean=false;
   isImageLoaded:boolean=false;
   defaultBanner:boolean=true;
   //Audio
   ref: AngularFireStorageReference;
   
  constructor(
    public navCtrl: NavController,public media:Media,public fileObj:File,
    private router: Router,private confData: ConferenceData,private loadingCtrl: LoadingController,
    public ngFireAuth: AngularFireAuth,private toastCtrl: ToastController,
    private fireBaseService: FireBaseService, public userData: UserData,
    public actionSheetController: ActionSheetController,private alertCtrl: AlertController, 
    private storage: AngularFireStorage,
    private database: AngularFirestore,public modalCtrl: ModalController
  ) { 

    this.isUploading = false;
    this.isUploaded = false;
    this.imageCollection = database.collection<MyData>('storyThumnails');
    this.images = this.imageCollection.valueChanges()
  }

  ngOnInit() {
    
  }

  async ionViewWillEnter() { 
   this.ngFireAuth.onAuthStateChanged(async (obj)=>{
        if(obj){ 
                this.fireBaseService.filterActorByName(this.userData.userName).then(element => {
                  this.confData.actorData = {};
                  this.confData.actorData = element['docs'][0].data();
                });

                //image propertiesc starts
                this.UploadedFilePath="";
                this.isUploaded=false;
                this.isImageCropped=false;
                this.isImageCropperShown=false;
                this.isImagefinalized=false;
                this.finalizedImageUrl="";
                this.isImageCropped=false;
                this.isImageCropperShown=false;
                //image propertiesc ends

                this.defaultBanner=true;
                this.isAudioLoaded=false;
                this.isVideoLoaded=false;
                this.isImageLoaded=false;
                this.pageHeader="Post Activities";
        } else{
              this.presentToast('Please login/signup to see more!','toast-success');
              this.router.navigateByUrl('/signUp'); 
            }
      })        
  }
  
  fileChangeEvent(fileEvent: any): void {
    const file = fileEvent.target.files[0];
    if(file.type == "" || file.type == undefined){
      this.presentToast("Recommended .mp3/.mp4 format","toast-danger");
      return;
    }
    const sizeInMB = parseInt((file.size / (1024*1024)).toFixed(0));
    console.log('size', sizeInMB);
    console.log('type', file.type);
    if(sizeInMB <= 50){
      if(file.type.split('/')[0] =='audio'){
        console.log("inside Audio....");
        this.mediaFileType ="audio";
        this.saveAudioToFireStore(fileEvent);
      }
      if(file.type.split('/')[0] =='video'){
        console.log("inside video....");
        this.mediaFileType="video";
        this.saveVideoToFireStore(fileEvent);
      }
      if(file.type.split('/')[0] =='image' ){
        console.log("inside image....");
        this.mediaFileType="image";
        this.defaultBanner = false;
        this.imageFileChangeEvent(fileEvent);
      }
    }else{
      this.presentToast("Maximum 50MB allowed","toast-danger");
      return;
      //To do -Must do it
      //this.saveTrimmedVideo(fileEvent);
    } 
  }

  async saveVideoToFireStore(fileEvent){
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Uploading Video..',
      duration: 13500
    });
    await this.loadingProgress.present();
    const file = fileEvent.target.files[0];
    const videoBlob: any = new Blob([file], { type: 'video/mp4,flv,mkv,wmv,mov,mpg,rm,3g2' });
    console.log('videoBlob ' + JSON.stringify(videoBlob));
    const id = Math.random().toString(36).substring(2);
    this.ref = this.storage.ref(id);
    let metadata = {
      contentType: 'video/mp4,flv,mkv,wmv,mov,mpg,rm,3g2',
    };
    const storageRef = firebase.storage().ref();
        const uploadAudio = storageRef.child(`activities_video/${file.name}`)
        .put(videoBlob, metadata).then((sus) => {
          sus.ref.getDownloadURL().then((url) => {
            if(url !==''){
              this.defaultBanner=false;
              this.isAudioLoaded=false;
              this.isVideoLoaded=true;
              this.isImageLoaded=false;
              console.log('url => ' + url);
              this.finalizedFileurl = url;
              this.loadingProgress.onWillDismiss();
            }
            
          }).catch((er) => {
            console.log('Error:',er)
           // this.utils.presentToastSimple('Error al obtener ruta del audio: ' + er, 5000);
          });
        }).catch((error) => {
          console.log('Error al guardar la imagen: ' , error);
        });
          
  }
  
  async saveAudioToFireStore(fileEvent){
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Uploading Audio..',
      duration: 12000
    });
    await this.loadingProgress.present();
    const file = fileEvent.target.files[0];
    const audioBlob: any = new Blob([file], { type: 'audio/mp3,m4a,flac,mp4,wav,wma,aac' });
    console.log('audiBlob ' + JSON.stringify(audioBlob));
    const id = Math.random().toString(36).substring(2);
    this.ref = this.storage.ref(id);
    let metadata = {
      contentType: 'audio/mp3',
    };
    const storageRef = firebase.storage().ref();
        const uploadAudio = storageRef.child(`activities_audio/${file.name}`)
        .put(audioBlob, metadata).then((sus) => {
          sus.ref.getDownloadURL().then((url) => {
            if(url !==''){
              this.defaultBanner=false;
              this.isAudioLoaded=true;
              this.isVideoLoaded=false;
              this.isImageLoaded=false;
              console.log('url => ' + url);
              this.finalizedFileurl = url;             
            }
            this.loadingProgress.onWillDismiss();
          }).catch((er) => {
            console.log('Error:',er)
           // this.utils.presentToastSimple('Error al obtener ruta del audio: ' + er, 5000);
          });
        }).catch((error) => {
          console.log('Error al guardar la imagen: ' , error);
        });
          
  }
  logout() {
    this.isImageCropped=false;
    this.isImageCropperShown = false;
    this.isPosted=false;
    this.isImagefinalized=false;
    //this.router.navigateByUrl('/app/tabs/daily-activities');     
    this.modalCtrl.dismiss();   
  }
  //Image upload functionality starts
  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();
    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {      
      
    }).catch(error => {
      console.log("error " + error);
    });
  }
  imageFileChangeEvent(event: any): void {
    this.isImageCropperShown=true;    
    this.imageChangedEvent = event;
    this.fileName = event.target.files[0].name;
    this.fileSize=event.target.files[0].size;
   // this.uploadFile(this.croppedImage,this.fileName);
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.isImageCropped=true; 
      this.approveCroppedImage(this.croppedImage,this.fileName);  
      
  }
  async approveCroppedImage(croppedImage,fileName) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure to fix this image?',
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            this.uploadFile(croppedImage,fileName); 
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
  cropperReady(event:any) {
    this.isImageCropped=true;
    //this.presentToast('Cropping is done..!','toast-success');     
   
  }
  loadImageFailed() {
    this.presentToast('Invalid Image. Please select right one!','toast-danger');
  }
  hideCropImage(){
    console.log("hi");
  }
  loading = false;
   async uploadFile(event,file) {    
    this.loading = true;
    const path = `activities_image/${new Date().getTime()}_${file}`;
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
                    console.log("downloaded url::"+url);
                    this.finalizedFileurl = url;
                    this.isImagefinalized=true;
                   
                }),  
                  
              finalize(() => this.loading = false)
              ).subscribe((resp) => {
               
                         console.log("response addImageDON::"+resp);
                         if(resp == undefined){
                          this.presentToast('You have selected invalid image!','toast-danger');
                          this.loadingProgress.onWillDismiss();
                          return ;
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
                         this.presentToast('Image cropped successfully','toast-success');
               }, error => {
                       console.log("image not uploaded");
                       this.presentToast('You have selected invalid image!','toast-danger');
                       this.isUploaded = false;
              });
  }
  async saveActivity(){
    if((this.userThought ==undefined || this.userThought =='') && (this.finalizedFileurl == undefined || this.finalizedFileurl == '')){
      this.presentToast('Atleast provide one input','toast-danger');
      return true;
    }
    const loading = await this.loadingCtrl.create({
      message: 'Uploading...',
      duration: 2000
    });
    await loading.present();
    let activityObj = {};
   
    if(this.finalizedFileurl !==undefined && this.finalizedFileurl !==''){
    activityObj['mediaFile'] = this.finalizedFileurl;
    }else{
      activityObj['mediaFile'] = "";
    }
    if(this.userThought !==undefined && this.userThought !==''){
    activityObj['userThought'] = this.userThought;
    }else{
      activityObj['userThought'] = "";
    }
    if(this.confData.actorData.displayName !==undefined && this.confData.actorData.displayName !==''){
      activityObj['uploaderUserName'] = this.confData.actorData.actorName;
    activityObj['uploaderName'] = this.confData.actorData.displayName;
    }else{
      activityObj['uploaderName'] = "";
      activityObj['uploaderUserName'] ="";
    }
    if(this.confData.actorData.image !==undefined && this.confData.actorData.image !==''){
    activityObj['uploaderImg'] = this.confData.actorData.image;
    }else{
      activityObj['uploaderImg'] = "";
    }
    if(this.mediaFileType !==undefined && this.mediaFileType !==''){
    activityObj['mediaFileType'] =this.mediaFileType;
    }else{
      activityObj['mediaFileType'] ="";
    }
    activityObj['activityComment'] =[];
    activityObj['likes'] =[];
    activityObj['seqId'] =Math.floor((Math.random() * 100000000) + 1)+moment().format('YYYY-MM-DD hh:mm:ss A').toString();
    activityObj['uploadedOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
    // this.ngFireAuth.onAuthStateChanged((obj)=>{
     // if(obj){
        this.fireBaseService.createActivity(activityObj);
        loading.dismiss();
        this.userThought ="";
        // activityObj['uploaderImg'] = "";
        // activityObj['mediaFile'] = "";
        this.presentToastForPost('Posted successfully','toast-success');
        this.logout();
     // }
   // });
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
  async presentToastForPost(msg,type) {
    const toast = await this.toastCtrl.create({
      message: msg,
      animated:true,
      cssClass:type,
      position: 'middle',
      duration: 100
    });
    toast.present();
  }

  
   
}