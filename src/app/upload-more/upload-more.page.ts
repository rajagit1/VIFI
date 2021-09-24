import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, NavParams, IonReorderGroup, ToastController, LoadingController, ActionSheetController, IonSlides } from '@ionic/angular';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import _ from 'lodash';

import { Router } from '@angular/router';
import { FireBaseService } from '../services/firebase.service';
import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
export interface MyData {
  name: string;
  filepath: string;
  size: number;
  actorId: string;

}
@Component({
  selector: 'app-upload-more',
  templateUrl: './upload-more.page.html',
  styleUrls: ['./upload-more.page.scss'],
})
export class UploadMorePage implements OnInit {

  @Input() mobile: string;
  @Input() name: string;
  @Input() email: string;
  @Input() userType: string;
  @Input() password: string;
  @Input() userFlag: string;
  @Input() docId: string;
  // Upload Task 
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  images: Observable<MyData[]>;

  //File details  
  fileName: string;
  fileSize: number;
  slideOptsCards = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    slideShadows: true,
    pager: false
  };
  sliderOne =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 995
        },
        {
          id: 925
        },
        {
          id: 940
        },
        {
          id: 943
        },
        {
          id: 944
        }
      ]
    };


  //Status check 
  isUploading: boolean;
  isUploaded: boolean;
  imageList: any[];
  private imageCollection: AngularFirestoreCollection<MyData>;
  disableMore: boolean=false;
  userName: any;
  constructor(public modalCtrl: ModalController,private toastCtrl: ToastController,
    private router: Router, public confData: ConferenceData,
    private fireBaseService: FireBaseService, public userData: UserData,
    private storage: AngularFireStorage, private database: AngularFirestore) {

    this.isUploading = false;
    this.isUploaded = false;
    //Set collection where our documents/ images info will save
    this.imageCollection = database.collection<MyData>('actor');
    this.images = this.imageCollection.valueChanges();

  }

  ngOnInit() {
    this.imageList = [];
    console.log('Init');
    this.disableMore=false;
    console.log(this.name);
    this.loginCheck();
    this.fireBaseService.filterActors(this.name).get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.docId = doc.id;
        let actorObj = doc.data();
        if (!_.isEmpty(actorObj['imageArray'])) {
          actorObj['imageArray'].forEach((element, idx) => {
            if (idx < 5) {
              this.imageList.push(element);
            }
            if (idx == 4) {
              this.disableMore = true;
            }

          });
        } 


      });

    });
  }
  loginCheck() {
    if (!_.isEmpty(this.userData.userName)) { 
       this.userName=this.userData.userName;
      
    } else {
     this.userName=this.confData.signUpUserData['userName']
    }
  }
  saveMultiplePhotos() {
    if(this.imageList.length > 0){
      this.presentToast(this.imageList.length +"' file(s) saved","toast-success");      
        this.modalCtrl.dismiss({
          'dismissed': true,
          'mobile': this.mobile,
          'name': this.name,
          'email': this.email,
          'userType': this.userType,
          'userFlag': this.userFlag,
          'password': this.password,
          'imageArray':this.imageList


        });
    }else{
      this.presentToast("No files are uploaded","toast-danger");   
    }
  }
  closeModal() {
       
        this.modalCtrl.dismiss({
          'dismissed': true,
          'mobile': this.mobile,
          'name': this.name,
          'email': this.email,
          'userType': this.userType,
          'userFlag': this.userFlag,
          'password': this.password
        });
    
   }
  async presentToast(msg, type) {
    const toast = await this.toastCtrl.create({
      message: msg,
      //animated: true,
      cssClass: type,
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }
  
  uploadFile(event: FileList) {


    // The File object
    const file = event.item(0)

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ')
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path
    const path = `actorThumbnails/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();

        this.UploadedFileURL.subscribe(resp => {
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize,
            actorId: this.name
          });
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        })
      }),
      tap(snap => {
        this.fileSize = snap.totalBytes;
      })
    )
  }

  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation  
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }
  addImagetoDB(image: MyData) {
    this.imageList.push(image.filepath);
    if (this.imageList.length == 5) {
      this.disableMore = true;
    }
    this.fireBaseService.filterActors(this.name).get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.docId = doc.id;
        let actorObj = doc.data();

        if (_.isEmpty(actorObj['imageArray'])) {
          actorObj['imageArray'] = [];
        }
        actorObj['imageArray'].push(image.filepath);
        this.fireBaseService.updateActros(this.docId, actorObj);
      });

    });
  }
}
