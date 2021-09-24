import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, ToastController, ActionSheetController, AlertController, ModalController, IonInput, IonSlides } from '@ionic/angular';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { FireBaseService } from '../../services/firebase.service';
import { Post } from '../../interfaces/user-options';
import { UserData } from '../../providers/user-data';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { finalize, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
//image
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ConferenceData } from '../../providers/conference-data';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
  providers: [AngularFirestore]
})

export class CreatePostPage implements OnInit {
  selectOptions = {
    header: 'Select a range'
  };
  docId: string;
  isImageCropperShown2: boolean = false;
  pageHeader: string;
  text: string = "";
  posts = [];
  title: string = "";
  budget: string = "";
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;
  image: string;
  synopsis: string = "";
  username: string;
  loadingProgress;
  isPosted: boolean = false;
  storyVisibility: boolean = false;
  result: string = "";
  //image
  isFromSpeakerListPage: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isImageCropped: boolean = false;
  isImageCropperShown: boolean = true;
  finalizedImageUrl: string = "";
  isImagefinalized: boolean = false;
  task: AngularFireUploadTask;

  percentage: Observable<number>;


  snapshot: Observable<any>;


  UploadedFileURL: Observable<string>;


  images: Observable<MyData[]>;


  fileName: string;
  fileSize: number;
  showPreview: boolean = true;
  storyImageToUpdate: string;
  isUploading: boolean;
  isUploaded: boolean;
  fundingType: number = 0;
  private imageCollection: AngularFirestoreCollection<MyData>;
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;

  @ViewChild('ref', { static: false }) pRef: IonInput;
  UploadedFilePath: string;
  userType: string;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  filmType: number = 1;
  constructor(public navCtrl: NavController,
    private localNotifications: LocalNotifications,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router, private confData: ConferenceData,
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
  ionViewDidEnter() {

    this.result = "";
    this.title = "";
    this.budget = "";
    this.storyVisibility = false;
    this.synopsis = "";
    this.UploadedFilePath = "";
    this.isUploaded = false;
    this.isImageCropped = false;
    this.isImageCropperShown = false;
    this.isImagefinalized = false;
    this.finalizedImageUrl = "";
    this.isImageCropped = false;
    this.isImageCropperShown = false;
    this.getUsername();
    if (this.userData.isFromSpeakerListPage == true) {
      this.isPosted = false;
      this.isFromSpeakerListPage = true;
      console.log('stotyDetails to Edit:::', this.userData.fromSpeakerListData);
      this.docId = this.userData.fromSpeakerListData['id'];
      this.title = this.userData.fromSpeakerListData['title'];
      this.budget = this.userData.fromSpeakerListData['budget'];
      this.synopsis = this.userData.fromSpeakerListData['synopsis'];
      this.storyVisibility = this.userData.fromSpeakerListData['storyVisibility'];
      this.finalizedImageUrl = this.userData.fromSpeakerListData['image'];
      this.storyImageToUpdate = this.userData.fromSpeakerListData['image'];
      this.userData.isFromSpeakerListPage = false;
      this.pageHeader = "Update Story Details";
      //this.defaultHref = `/app/tabs/about`;
      //this.isFromSpeakerListPage=false;

    } else {
      this.pageHeader = "Create Post";
    }
    if ((this.userType !== undefined && this.userType !== '' && this.userType !== 'D') ||
      (this.userData.userType !== undefined && this.userData.userType !== '' && this.userData.userType !== 'D')) {
      this.presentToast('Network Slow/You dont have access!', 'toast-danger');
      return;
    }
    //setTimeout(() => this.pRef.setFocus(), 300);
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  getUsername() {
    this.userType = this.userData.userType;
    this.userData.getUsername().then((username) => {
      //this.ngFireAuth.onAuthStateChanged((obj)=>{
      if (username) {
        // this.username = obj.email.split('@')[0];
        this.username = username;
        this.getPosts();

        let query = this.fireBaseService.fetchPost();
        query.orderByChild('uploadedBy').equalTo(this.username).on("child_added", snap => {
          this.posts.push(snap.val());
          this.posts.reverse();
          this.posts = [...this.posts];
        });
      }
    });

  }
  ngOnInit() {

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
  async presentToastForPostsuccess(msg, type) {
    const toast = await this.toastCtrl.create({
      message: msg,
      animated: true,
      cssClass: type,
      position: 'middle',
      duration: 1000
    });
    toast.present();
  }
  clearValues() {
    this.result = "";
    this.synopsis = "";
    this.title = "";
    this.budget = "";
    this.storyVisibility = false;
    this.isUploaded = false;
  }
  logout() {
    if (this.pageHeader == 'Update Story Details') {
      //this.confData.isFromPage = "profile" 
      this.isFromSpeakerListPage = false;
      this.isImagefinalized = false;
      this.finalizedImageUrl = "";
      this.router.navigateByUrl('/app/tabs/speakers');
    } else {
      this.isImageCropped = false;
      this.isImageCropperShown = false;
      this.isPosted = false;
      this.isImagefinalized = false;
      this.finalizedImageUrl = "";
      this.router.navigateByUrl('/app/tabs/schedule');
    }

  }
  async post(genre) {
    //For safer side I have added one more condtion from userData.userType if
    // getUsername not find the userType from userData
    if (this.isFromSpeakerListPage == true) {
      this.pageHeader = "Update Story Details";
      let storyObj = {};
      storyObj['title'] = this.title;
      storyObj['synopsis'] = this.synopsis;
      storyObj['budget'] = this.budget;
      storyObj['storyVisibility'] = this.storyVisibility === true ? 'Certified' : 'Public';
      storyObj['fundType'] = this.fundingType;
      storyObj['generType'] = genre;
      storyObj['filmType'] = this.filmType;
      storyObj['image'] = !this.isImageCropperShown2 ? this.storyImageToUpdate : this.UploadedFilePath;
      this.fireBaseService.updatePost(this.docId, storyObj);
      this.presentToastForPostsuccess('Story Details Updated !', 'toast-success');
      this.isPosted = true;
      this.isFromSpeakerListPage = false;
      this.router.navigateByUrl(`/app/tabs/speakers`);
      return;
    } else {
      if ((this.userType !== undefined && this.userType !== '' && this.userType == 'D') ||
        (this.userData.userType !== undefined && this.userData.userType !== '' && this.userData.userType == 'D')) {
        this.isPosted = false;
        if (this.synopsis == '' && this.title == '') {
          this.presentToast('Please provide synopsis..!', 'toast-danger');
          return true;
        }
        if (this.UploadedFileURL === undefined) {
          this.presentToast('Please upload thumbnail..!', 'toast-danger');
          return true;
        }
        if (genre == 'select') {
          this.presentToast('Please select your genre..!', 'toast-danger');
          return true;
        }


        let postObj = {};

        postObj['synopsis'] = this.synopsis;
        postObj['uploadedBy'] = this.username;
        postObj['uploadedOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
        postObj['generType'] = genre;
        postObj['title'] = this.title;
        postObj['budget'] = this.budget;
        postObj['image'] = this.UploadedFilePath;
        postObj['fundType'] = this.fundingType;
        postObj['likes'] = [];
        postObj['views'] = 0;
        postObj['actors'] = [];
        postObj['fundedBy'] = [];
        postObj['music'] = [];
        postObj['actress'] = [];
        postObj['shooting'] = false;
        postObj['storyRegNumber'] = 'VIFI-' + this.title.slice(0, 3) + Math.random().toString(36).substring(5);
        postObj['storyStatus'] = 'waitingForFund';
        postObj['filmType'] = this.filmType;
        postObj['storyVisibility'] = this.storyVisibility === true ? 'Certified' : 'Public';
        this.loadingProgress = await this.loadingCtrl.create({
          message: 'Uploading your post..',
          duration: 3500
        });
        await this.loadingProgress.present();

        this.fireBaseService.createPost(postObj).then(creationResponse => {
         
          if (creationResponse != null) {
            this.presentToastForPostsuccess('Posted successfully!', 'toast-success');
            this.isPosted = true;
            this.loadingProgress.onWillDismiss();
            this.clearValues();
            this.router.navigateByUrl('/app/tabs/schedule');
          }
        })
          .catch((error) => this.presentToast(error.message, 'toast-danger'));
      } else {
        this.presentToast('Network Slow/You dont have access!', 'toast-danger');
        return;
      }
    }
  }
  /***
   * getPosts
   */
  getPosts() {
    this.posts = [];
    let query = this.fireBaseService.fetchPost();
    let postArray = [];

    query.orderByChild('uploadedBy').equalTo(this.username).once('value').then(snapshot => {
      snapshot.forEach(function (data) {
        postArray.push(data.val());
      });
    })

    this.posts = postArray;

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

  async presentFundType() {
    if (this.synopsis == '') {
      this.presentToast('Please provide synopsis..!', 'toast-danger');
      return true;
    }
    else if (this.title == '') {
      this.presentToast('Please provide title..!', 'toast-danger');
      return true;
    }
    else if (this.budget == '') {
      this.presentToast('Please provide budget..!', 'toast-danger');
      return true;
    }
    else if (this.finalizedImageUrl == "") {
      this.presentToast('Please upload your poster image!', 'toast-danger');
      return;
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Funding..',
      buttons: [{
        text: 'Single Funding',
        role: 'destructive',
        icon: 'person',
        handler: () => {
          this.fundingType = 1;
          this.presentFilmType();
        }
      }, {
        text: 'Crowd Funding',
        icon: 'people-circle',
        handler: () => {
          this.fundingType = 2;
          this.presentFilmType();
        }
      }]
    });
    await actionSheet.present();
  }
  async presentFilmType() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Feature..',
      buttons: [
        {
          text: 'Feature Film',
          role: 'destructive',
          icon: 'easel-outline',
          handler: () => {
            this.filmType = 1;
            this.presentActionSheet();
          }
        }, {
          text: 'Non feature - Short Film',
          icon: 'videocam',
          handler: () => {
            this.filmType = 2;
            this.presentActionSheet();
          }
        }, {
          text: 'Non feature - Pilot Film',
          icon: 'megaphone',
          handler: () => {
            this.filmType = 3;
            this.presentActionSheet();
          }
        },
        {
          text: 'Non feature - Tele Film',
          icon: 'image',
          handler: () => {
            this.filmType = 4;
            this.presentActionSheet();
          }
        }]
    });
    await actionSheet.present();
  }

  /**
   * present
   */
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Genres',
      buttons: [
        {
          text: 'Select your Genre',
          role: 'destructive',
          icon: '',
          handler: () => {
            this.post('select');
          }
        },
        {
          text: 'Drama/Love',
          role: 'destructive',
          icon: 'people-circle-outline',
          handler: () => {
            this.post('DRAMA');
          }
        }, {
          text: 'Comedy/Sports',
          icon: 'happy-outline',
          handler: () => {
            this.post('COMEDY');
          }
        }, {
          text: 'Adventure/SciFi',
          icon: 'film-outline',
          handler: () => {
            this.post('ADVENTURE');
          }
        }, {
          text: 'Crime/Horror',
          icon: 'skull-outline',
          handler: () => {
            this.post('CRIME');
          }
        }]
    });
    await actionSheet.present();
    //this.isImageCropperShown =false;
    //this.isImageCropped=false;
  }

  fileChangeEvent(event: any): void {
    this.isImageCropperShown = true;
    this.imageChangedEvent = event;
    this.fileName = event.target.files[0].name;
    this.fileSize = event.target.files[0].size;
    if (this.isFromSpeakerListPage == true) {
      this.isImageCropperShown2 = true;
    }
    // this.uploadFile(this.croppedImage,this.fileName);
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.isImageCropped = true;
    this.approveCroppedImage(this.croppedImage, this.fileName);
    if (this.isFromSpeakerListPage == true) {
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
    console.log("hi");
  }

  loading = false;
  async uploadFile(event, file) {
    this.loading = true;
    const path = `storyThumnails/${new Date().getTime()}_${file}`;
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
        console.log("downloaded url::" + url);
        this.isImagefinalized = true;

      }),

      finalize(() => this.loading = false)
    ).subscribe((resp) => {

      console.log("response addImageDON::" + resp);
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
      if (this.isFromSpeakerListPage == true) {
        this.showPreview = true;
      }
    }, error => {
      console.log("image not uploaded");
      this.presentToast('You have selected invalid image!', 'toast-danger');
      this.isUploaded = false;
    });
  }

  istitleAlreadyExist(title) {
    this.isPosted = false;
    this.result = '';
    let postList: any = [];
    this.fireBaseService.readPosts().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        if (docData['title'].toLowerCase() == title.target.value.toLowerCase()) {
          this.result = 'Title' + " '" + title.target.value + "' " + 'already Exist!';
          this.title = '';
          //this.presentToast('Title already Exist.Please try with other title!','toast-danger');         
          return;
        }
      });
    });

  }
}
