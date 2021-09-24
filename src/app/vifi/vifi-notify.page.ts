import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, ToastController, ActionSheetController, AlertController, ModalController, IonInput, IonSlides } from '@ionic/angular';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { FireBaseService } from '../services/firebase.service';
import { Post } from '../interfaces/user-options';
import { UserData } from '../providers/user-data';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { finalize, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
//image
import { ImageCroppedEvent } from 'ngx-image-cropper';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}


@Component({
  
  selector: 'app-create-post1',
  templateUrl: './vifi-notify.page.html',
  styleUrls: ['../vifi/vifi-notify.page.scss'],
  providers: [AngularFirestore]
})

export class VifiNotifyPage implements OnInit {
  selectOptions = {
    header: 'Select a range'
  };
  text: string = "";
  image: string;
  vifinotifyDescription: string = "";
  videoLink:string = "";
  loadingProgress;
  isPosted:boolean=false;
  isFullscreen:boolean=false;
  //image
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isImageCropped:boolean=false;
  isImageCropperShown: boolean = true ; 
  finalizedImageUrl:string="";
  isImagefinalized:boolean=false;
  task: AngularFireUploadTask;

   
  percentage: Observable<number>;

   
  snapshot: Observable<any>;

   
  UploadedFileURL: Observable<string>;

   
  images: Observable<MyData[]>;

   
  fileName: string;
  fileSize: number;

   
  isUploading: boolean;
  isUploaded: boolean;
  fundingType:number=0;
  private imageCollection: AngularFirestoreCollection<MyData>;
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;

  @ViewChild('ref', { static: false }) pRef: IonInput;
  UploadedFilePath: string;
  userType: string;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  filmType: number=1;
  constructor(public navCtrl: NavController,

    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router,
    public ngFireAuth: AngularFireAuth,
    private fireBaseService: FireBaseService, public userData: UserData,
    public actionSheetController: ActionSheetController, private storage: AngularFireStorage, private database: AngularFirestore
  ) {
    this.isUploading = false;
    this.isUploaded = false;

    this.imageCollection = database.collection<MyData>('storyThumnails');
    this.images = this.imageCollection.valueChanges()
  }

  ngAfterViewInit() {
    

  }
  ionViewDidEnter(){
    this.UploadedFilePath="";
    this.isUploaded=false;
    this.isImageCropped=false;
    this.isImageCropperShown=false;
    this.isImagefinalized=false;
    this.finalizedImageUrl="";
    this.isImageCropped=false;
    this.isImageCropperShown=false;    
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  
  ngOnInit() {

  }

  async presentToast(msg,type) {
    const toast = await this.toastCtrl.create({
      message: msg,
      animated:true,
      cssClass:type,
      position: 'middle',
      duration: 1000
    });
    toast.present();
  }
  clearValues() {
    this.vifinotifyDescription = "";
    this.videoLink ="";
    this.isFullscreen =false;
    this.isUploaded=false;
  }
  logout() {
    this.router.navigateByUrl('/app/tabs/schedule');
    this.isImageCropped=false;
    this.isImageCropperShown = false;
    this.isImagefinalized=false;
    this.isPosted=false;
    this.finalizedImageUrl="";
  }
  parseVideo(url) {
    var re = /\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_\-]+)/i; 
    var matches = re.exec(url);
    return matches && matches[1];
  }
  async post() {
    //this.ngFireAuth.onAuthStateChanged(async (obj)=>{
      //if(obj){
                    this.isPosted=false;
                    //Youtube link & image is optional so which ever option you want utilize you can
                    /** if (this.vifinotifyDescription == '' ) {
                      this.presentToast('Please provide notification..!','toast-danger');
                      return true;
                    }
                   if(this.UploadedFileURL===undefined){
                      this.presentToast('Please upload thumbnail..!','toast-danger');
                      return true;
                    } */
                    if(this.vifinotifyDescription =='' && this.videoLink ==''){
                      this.presentToast('Notify Message & Video Link both cannot be blank..!','toast-danger');
                      return;
                    }
                    
                    let postObj={};                    
                    postObj['uid'] = Math.floor(Math.random() * Date.now());
                    postObj['vifi-notify-msg'] = this.vifinotifyDescription;
                    postObj['uploadedBy'] = 'VIFI Team';
                    postObj['uploadedOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
                    postObj['image']=this.UploadedFilePath;
                    const yotubeLink = this.parseVideo(this.videoLink);
                    if(yotubeLink){         
                      postObj['video-link']='https://www.youtube.com/watch?v='+yotubeLink; 
                    }else{
                    this.presentToast('Please provide valid youtube url.Example.[https://www.youtube.com/watch?v=zls4a7I_qaM]', 'toast-danger');
                    return;
                  }
                    
                    postObj['deletedBy'] = [];
                    postObj['isDeleted'] = 'false';
                    postObj['imageNotified'] =[];
                    if(postObj['image'] !=='' && postObj['image'] !== undefined &&
                    this.userData.userName !=='' &&  this.userData.userName !== undefined){
                    postObj['imageNotified'].push('false_'+ this.userData.userName);
                    }
                    postObj['isFullScreen'] = this.isFullscreen === true ? 'Yes' : 'No';   
                    this.loadingProgress = await this.loadingCtrl.create({
                      message: 'Uploading your notification..',
                      duration: 1000
                    });
                    await this.loadingProgress.present();
                   /**  this.ngFireAuth.onAuthStateChanged(async (obj)=>{
                      if(obj){ */
                                    this.fireBaseService.createVifiNotifications(postObj).then(creationResponse => {
                                      if (creationResponse != null) {
                                        this.presentToast('Notification Posted successfully!','toast-success');
                                        this.isPosted=true;
                                        this.loadingProgress.onWillDismiss();
                                        this.clearValues();
                                        //this.router.navigateByUrl('/app/tabs/schedule');
                                     /**  }
                                    })
                                      .catch(error => 
                                        this.presentToast(error,'toast-danger')
                                        
                                        );*/

                    }
                  });
                
  }
  

  /***
   * uploadFile
   */
  
  

  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();
    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {      
      
    }).catch(error => {
      console.log("error " + error);
    });
  }

  
  
  
  fileChangeEvent(event: any): void {
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
    const path = `vifiNotificationThumnails/${new Date().getTime()}_${file}`;
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
  
}
