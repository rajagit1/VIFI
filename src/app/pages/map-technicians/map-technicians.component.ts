import { Component,ViewChild } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Router } from '@angular/router';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { UserData } from '../../providers/user-data';
import { ModalController, IonRouterOutlet,ToastController,IonSlides,Platform } from '@ionic/angular';
import { ActorListPage } from '../actor-list/actor-list.page';
import { AccountPage } from '../account/account';
import { NavigationStart, Event as NavigationEvent } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActorAddPage } from '../../modals/actor-add/actor-add.page';
import { TechnicianDetailsPage } from '../../modals/technician-details/technician-details.page';

@Component({
  selector: 'app-map-technicians',
  templateUrl: './map-technicians.component.html',
  styleUrls: ['./map-technicians.component.scss'],
})
export class MapTechniciansComponent {
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  //Delete content starts
  isSubscribed:boolean=false;
  subsctionCount:number =0;
  postData: any;
  showPost: boolean = false;
  showfull: boolean = true;
  defaultHref: string = "/app/tabs/speakers";
  p_bar_value1: number;
  p_bar_value2: number;
  liked: boolean = false;
  mode: string = "story";
  heartClass: string;
  username: string;
  showActor: string;
  hasActor: boolean = false;
  isSynopsisEdit:boolean = false;
  dataReturned: any;
  userExist: boolean = false;
  showprice: boolean = false;
  dopName: string = "";
  dop_img: any = "";
  editorName:any="";
  editor_img:any="";

  scriptWriterName: string = "";
  scriptWriter_img: any = "";
  assistantDirectorName:any="";
  assistantDirector_img:any="";
  supportingMaleActorName: string = "";
  supportingMaleActor_img: any = "";
  supportingFemaleActorName:any="";
  supportingFemaleActor_img:any="";

  choreographerName: string = "";
  choreographer_img: any = "";
  studioName:any="";
  studio_img:any="";
  equipmentName:any="";
  equipment_img:any="";
  dubbingMaleName="";
  dubbingMale_img="";
  dubbingFemale_img="";
  dubbingFemaleName="";
  isDOPMapped:boolean=false;
  isEditorMapped:boolean=false;
  isLoaded: boolean = false;
  budget: number = 0;
  postUploadedBy: any = "";
  isBlinkRequired:boolean=false;
  isSingleFundedByVisible:boolean=true;
  isEditRequired:boolean=false;
  isSaveRequired:boolean=false;
  isMapped: boolean = false;
  querySnapshotStatus:boolean = false;
  postedStories:any=[];
  subscriptionId:any="";
  storyStatus:string="waitingForFund";
  dummyItem =[{}];
  
  dummyData = [
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    }
  ];

  fundType: any;
  showFundDetails: boolean = false;
  userType: string;
  showFinalPriceonSave: boolean = false;
  totalFund: number;
  sliderOne: any;
  roundoff: number;

  //Delete content ends
  ios: boolean;
  speakers: any[] = [];
  generType: string = "drama";
  segment = "drama";
  posts: any[];
  certifiedDramaPostedStories :any[];
  certifiedComedyPostedStories :any[];
  certifiedAdventurePostedStories :any[];
  certifiedCrimePostedStories :any[];
  certifiedSerchResult :any[];
  dramaStories: any;
  updatedDramaStories:any;
  updatedCrimeStories:any;
  updatedAdvStories:any;
  updatedComedyStories:any;
  comedyStories: any;
  advStories: any;
  crimeStories: any;
  
  slideOptsOne :any;    

  popup:boolean=false;
  popupActorName="";
  popupActorSkills="";
  safeURL: any;
  //isLoaded: boolean = false;
  //liked: boolean = false;
  //heartClass: string;
  //defaultHref = '/app/tabs/schedule';
  showSearchbar: boolean=true;
  //userType ="";
  /**dummyData = [
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
  ]*/
  //username: string;
  excludeTracks: any;
  queryText: string;
  isItemAvailable: boolean;
  items: any[];
  constructor(public confData: ConferenceData,public platform: Platform,
    public router: Router,public routerOutlet: IonRouterOutlet,public toastCtrl: ToastController,
    public userData: UserData,public modalController: ModalController,
    public fireBaseService: FireBaseService,public ngFireAuth: AngularFireAuth) {
      this.sliderOne =
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
      this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {
            
            this.queryText = '';
            this.showSearchbar = false;
            this.items = [];
            if(event.url === '/app/tabs/schedule'){
              console.log('--get post--');
            }
          }
        });
        this.slideOptsOne= {
          allowTouchMove: (this.platform.is('android') || this.platform.is('ios')),
          slidesPerView: 'auto',
          direction: 'horizontal',
          slideToClickedSlide: true,
          mousewheel: true,
          freeMode: true,
          freeModeSticky: (this.platform.is('android') || this.platform.is('ios')),
          freeModeMomentumBounce: false,
          freeModeMomentumRatio: 0.5,
          freeModeMomentumVelocityRatio: 0.5,
          centeredSlides: true,
          spaceBetween: 5
      }  
    }
  logout() {
      this.router.navigateByUrl('/app/tabs/about');
  }
  loginCheck() {
    if (_.isEmpty(this.username)) {
      this.router.navigateByUrl('/signUp');
      return false;
    } else {
      return true;
    }
  }
  ionViewDidEnter() {
    let networkStatus = (window.navigator.onLine ? 'on' : 'off') + 'line'
    if(networkStatus == 'offline' ){
      this.presentToast('No Internet Connection:Please turn on your network connection!', 'toast-danger');
      return;
    }
    this.postData = this.confData.routingData; 
    //this.checkActor(this.postData); 
    this.ngFireAuth.onAuthStateChanged((obj)=>{
      if(_.isEmpty(obj)){
        this.presentToast('Please login/signup to see more!','toast-success');
        this.router.navigateByUrl('/signUp');
        return;
      }
    });
    this.userType =this.userData.userType;
    this.showSearchbar = false;
    //this.ngFireAuth.onAuthStateChanged((obj)=>{
      //if(obj){  
                  this.confData.getSpeakers().subscribe((speakers: any[]) => {
                    this.speakers = speakers;
                  });
                  this.isLoaded=false;
                  this.getUserName();
                  this.getPostsForPostedStories();
                
    this.showSkeltonLoading();
  }

  getUserName() {
    this.userData.getUsername().then((username) => {
      //this.ngFireAuth.onAuthStateChanged((obj)=>{
            if(username){
              //this.username = obj.email.split('@')[0];
              this.username = username;
            }else{
              this.loginCheck();
            }
    });
  }

  showSkeltonLoading() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 1000);
  }

  navigateToDetalil(obj) {
    if (obj['views'] != undefined) {
      obj['views'] = obj['views'] + 1;
    }
    this.fireBaseService.updatePost(obj['id'], obj);
    this.confData.routingData = obj;
    if((this.confData.isFromPage =='' || this.confData.isFromPage==null || 
      this.confData.isFromPage==undefined) && this.confData.isFromPage !=="profile"){
        this.confData.isFromPage = 'category';
      }
    this.confData.loginUser = this.username;
    this.router.navigateByUrl('/app/tabs/speakers/speaker-details');
  }
  useFilter(arg) {
    return this.posts.filter(item => {
      return item.title.toLowerCase().indexOf(arg.toLowerCase()) > -1;
    });
  }
  setFilteredItems() {
    this.certifiedSerchResult =[];
    if (this.queryText != '') {
      this.isItemAvailable = true;  
      this.items = this.useFilter(this.queryText);    
      //this.items = _.uniqBy(this.items,'title',this.items,'image');
      if(this.userType == 'P' && this.userData.isCertified == true){
        //this.items = this.useFilter(this.queryText);        
        this.items = _.uniqBy(this.items,'title',this.items,'image');
        this.certifiedSerchResult = _.filter(this.items, { 'storyVisibility':"Certified"});
      }
      else if(this.userType  == 'D'  ){
        //this.items = this.useFilter(this.queryText);
        this.items = _.uniqBy(this.items,'title',this.items,'image');
        this.certifiedSerchResult = _.filter(this.items, { 'storyVisibility':"Certified",'uploadedBy':this.username});           
        } 
      //this.items = this.useFilter(this.queryText);
      this.items =  _.filter(this.items, { 'storyVisibility':"Public" });
      if(this.certifiedSerchResult.length > 0){
        this.certifiedSerchResult.forEach(item => this.items.push(item));
       }
      this.dramaStories = _.uniqBy(this.items, { 'generType': 'DRAMA' });
      this.comedyStories = _.uniqBy(this.items, { 'generType': 'COMEDY' });
      this.advStories = _.uniqBy(this.items, { 'generType': 'ADVENTURE' });
      this.crimeStories = _.uniqBy(this.items, { 'generType': 'CRIME' });
      this.items = [];
     } 

  }
  
  async getPostsForPostedStories() {
    this.posts = [];
    this.dramaStories = [];
    this.updatedDramaStories=[];
    this.updatedCrimeStories=[];
    this.updatedAdvStories=[];
    this.updatedComedyStories=[];
    this.comedyStories = [];
    this.advStories = [];
    this.crimeStories = [];
    this.fireBaseService.readPosts().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        this.posts.push(docData);
      });
      this.posts.reverse();
      this.posts = [...this.posts];
      this.dramaStories = _.filter(this.posts, { 'generType': 'DRAMA', 'uploadedBy': this.userData.userName });
      this.dramaStories = _.orderBy(this.dramaStories, ['uploadedOn'], ['desc']);
      this.dramaStories = _.uniqBy(this.dramaStories, 'title' );
      /** this.dramaStories.forEach(element => {
          if (element['dop']!==undefined && element['dop']) {
                    element['dop'].forEach(dopElement => {  
                                      if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                            element['dopName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                            element['dop_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                            element['dop_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                            element['dop_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                            element['isDOPMapped']=true;
                                            this.updatedDramaStories.push(element); 
                                          //this.userExist = true;
                                        }
                                }  );  
                      } 
                 if (element['editor']!==undefined && element['editor']) {        
                        element['editor'].forEach(dopElement => {  
                          if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                element['editorName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                element['editor_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                element['editor_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                element['editor_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                element['isEditorMapped']=true;
                                this.updatedDramaStories.push(element); 
                              //this.userExist = true;
                            }
                    }  ); 
                } 
                 if (element['assistantDirector']!==undefined && element['assistantDirector']) {    
                    element['assistantDirector'].forEach(dopElement => {  
                      if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                            element['assistantDirectorName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                            element['assistantDirector_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                            element['assistantDirector_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                            element['assistantDirector_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                            element['isAssistantDirectorMapped']=true;
                            this.updatedDramaStories.push(element); 
                          //this.userExist = true;
                        }
                }  ); 
              } 
               if (element['scriptWriter']!==undefined && element['scriptWriter']) {
                element['scriptWriter'].forEach(dopElement => {  
                  if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                        element['scriptWriterName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                        element['scriptWriter_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                        element['scriptWriter_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                        element['scriptWriter_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                        element['isScriptWriterMapped']=true;
                        this.updatedDramaStories.push(element); 
                      //this.userExist = true;
                    }
            }  ); 
          }
           if (element['supportingActorMale']!==undefined && element['supportingActorMale']) {
            element['supportingActorMale'].forEach(dopElement => {  
              if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                    element['supportingActorMaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                    element['supportingActorMale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                    element['supportingActorMale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                    element['supportingActorMale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                    element['isSupportingActorMaleMapped']=true;
                    this.updatedDramaStories.push(element); 
                  //this.userExist = true;
                }
        }  ); 
      }
       if (element['supportingActorFemale']!==undefined && element['supportingActorFemale']) {
                element['supportingActorFemale'].forEach(dopElement => {  
                  if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                        element['supportingActorFemaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                        element['supportingActorFemale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                        element['supportingActorFemale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                        element['supportingActorFemale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                        element['isSupportingActorFemaleMapped']=true;
                        this.updatedDramaStories.push(element); 
                      //this.userExist = true;
                    }
            });
      }   
  
   if (element['choreographer']!==undefined && element['choreographer']) {
              element['choreographer'].forEach(dopElement => {  
                if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                      element['choreographerName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                      element['choreographer_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                      element['choreographer_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                      element['choreographer_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                      element['isChoreographerMapped']=true;
                      this.updatedDramaStories.push(element); 
                    //this.userExist = true;
                  }
          }  ); 
  }
   if (element['studio']!==undefined && element['studio']) {
          element['studio'].forEach(dopElement => {  
            if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                  element['studioName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                  element['studio_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                  element['studio_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                  element['studio_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                  element['iStudioMapped']=true;
                  this.updatedDramaStories.push(element); 
                //this.userExist = true;
              }
          }  );
        }
         if (element['equipment']!==undefined && element['equipment']) {
                element['equipment'].forEach(dopElement => {  
                  if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                        element['equipmentName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                        element['equipment_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                        element['equipment_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                        element['equipment_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                        element['iEquipmentMapped']=true;
                        this.updatedDramaStories.push(element); 
                      //this.userExist = true;
                    }
                }  );  
              }     
        if (element['dubbingArtistMale']!==undefined && element['dubbingArtistMale']) {
                element['dubbingArtistMale'].forEach(dopElement => {  
                  if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                        element['dubbingMaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                        element['dubbingMale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                        element['dubbingMale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                        element['dubbingMale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                        element['isDubbingMaleMapped']=true;
                        this.updatedDramaStories.push(element); 
                      //this.userExist = true;
                    }
                }  );  
              } 
              if (element['dubbingArtistFemale']!==undefined && element['dubbingArtistFemale']) {
                element['dubbingArtistMale'].forEach(dopElement => {  
                  if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                        element['dubbingFemaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                        element['dubbingFemale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                        element['dubbingFemale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                        element['dubbingFemale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                        element['isDubbingFemaleMapped']=true;
                        this.updatedDramaStories.push(element); 
                      //this.userExist = true;
                    }
                }  );  
              }       
              this.updatedDramaStories.push(element); 
              this.updatedDramaStories = _.uniqBy(this.updatedDramaStories, 'title' );
      }); */
      this.comedyStories = _.filter(this.posts, { 'generType': 'COMEDY', 'uploadedBy': this.userData.userName });
      this.comedyStories = _.orderBy(this.comedyStories, ['uploadedOn'], ['desc']);
      this.comedyStories = _.uniqBy(this.comedyStories, 'title' );
      /** this.comedyStories.forEach(element => {
                              //if (element && element.split('_')[1] && element.split('_')[1].indexOf(this.username) >= 0) {
                                //IF user already exist you have done mapping messae will be shown
                                if (element['dop']!==undefined && element['dop']) {
                                                element['dop'].forEach(dopElement => {  
                                                                  if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                                        element['dopName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                                        element['dop_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                                        element['dop_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                                        element['dop_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                                        element['isDOPMapped']=true;
                                                                        this.updatedComedyStories.push(element); 
                                                                      //this.userExist = true;
                                                                    }
                                                            }  );
                                            } 
                                if (element['editor']!==undefined && element['editor']) {            
                                              element['editor'].forEach(dopElement => {  
                                                if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                      element['editorName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                      element['editor_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                      element['editor_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                      element['editor_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                      element['isEditorMapped']=true;
                                                      this.updatedComedyStories.push(element); 
                                                    //this.userExist = true;
                                                  }
                                          }  ); 
                                    }  
                            if (element['assistantDirector']!==undefined && element['assistantDirector']) {   
                                          element['assistantDirector'].forEach(dopElement => {  
                                            if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                  element['assistantDirectorName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                  element['assistantDirector_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                  element['assistantDirector_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                  element['assistantDirector_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                  element['isAssistantDirectorMapped']=true;
                                                  this.updatedComedyStories.push(element); 
                                                //this.userExist = true;
                                              }
                                      }  );
                                    }  
                          if (element['scriptWriter']!==undefined && element['scriptWriter']) {        
                                      element['scriptWriter'].forEach(dopElement => {  
                                        if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                              element['scriptWriterName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                              element['scriptWriter_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                              element['scriptWriter_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                              element['scriptWriter_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                              element['isScriptWriterMapped']=true;
                                              this.updatedComedyStories.push(element); 
                                            //this.userExist = true;
                                          }
                                  }  ); 
                                }   
                        if (element['supportingActorMale']!==undefined && element['supportingActorMale']) {     
                                  element['supportingActorMale'].forEach(dopElement => {  
                                    if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                          element['supportingActorMaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                          element['supportingActorMale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                          element['supportingActorMale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                          element['supportingActorMale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                          element['isSupportingActorMaleMapped']=true;
                                          this.updatedComedyStories.push(element); 
                                        //this.userExist = true;
                                      }
                              }  ); 
                            }
                          if (element['supportingActorFemale']!==undefined && element['supportingActorFemale']) {     
                                    element['supportingActorFemale'].forEach(dopElement => {  
                                      if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                            element['supportingActorFemaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                            element['supportingActorFemale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                            element['supportingActorFemale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                            element['supportingActorFemale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                            element['isSupportingActorFemaleMapped']=true;
                                            this.updatedComedyStories.push(element); 
                                          //this.userExist = true;
                                        }
                                }  ); 
                        }
                        if (element['choreographer']!==undefined && element['choreographer']) { 
                                    element['choreographer'].forEach(dopElement => {  
                                      if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                            element['choreographerName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                            element['choreographer_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                            element['choreographer_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                            element['choreographer_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                            element['isChoreographerMapped']=true;
                                            this.updatedComedyStories.push(element); 
                                          //this.userExist = true;
                                        }
                                }  ); 

                        }
         if (element['studio']!==undefined && element['studio']) {      
                      element['studio'].forEach(dopElement => {  
                        if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                              element['studioName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                              element['studio_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                              element['studio_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                              element['studio_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                              element['iStudioMapped']=true;
                              this.updatedComedyStories.push(element); 
                            //this.userExist = true;
                          }
                      }  );
                    }   
                      if (element['equipment']!==undefined && element['equipment']) { 
                                element['equipment'].forEach(dopElement => {  
                                  if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                        element['equipmentName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                        element['equipment_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                        element['equipment_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                        element['equipment_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                        element['iEquipmentMapped']=true;
                                        this.updatedComedyStories.push(element); 
                                      //this.userExist = true;
                                    }
                                }  ); 
                      }  
                      if (element['dubbingArtistMale']!==undefined && element['dubbingArtistMale']) {
                        element['dubbingArtistMale'].forEach(dopElement => {  
                          if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                element['dubbingMaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                element['dubbingMale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                element['dubbingMale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                element['dubbingMale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                element['isDubbingMaleMapped']=true;
                                this.updatedDramaStories.push(element); 
                              //this.userExist = true;
                            }
                        }  );  
                      } 
                      if (element['dubbingArtistFemale']!==undefined && element['dubbingArtistFemale']) {
                        element['dubbingArtistMale'].forEach(dopElement => {  
                          if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                element['dubbingFemaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                element['dubbingFemale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                element['dubbingFemale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                element['dubbingFemale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                element['isDubbingFemaleMapped']=true;
                                this.updatedDramaStories.push(element); 
                              //this.userExist = true;
                            }
                        }  );  
                      } 
              this.updatedComedyStories.push(element); 
              this.updatedComedyStories = _.uniqBy(this.updatedComedyStories, 'title' );
      }); */
      this.advStories = _.filter(this.posts, { 'generType': 'ADVENTURE', 'uploadedBy': this.userData.userName });
       this.advStories = _.orderBy(this.advStories, ['uploadedOn'], ['desc']);
       this.advStories = _.uniqBy(this.advStories, 'title' );
       /** this.advStories.forEach(element => {
        //if (element && element.split('_')[1] && element.split('_')[1].indexOf(this.username) >= 0) {
          //IF user already exist you have done mapping messae will be shown
          if (element['dop']!==undefined && element['dop']) {
            element['dop'].forEach(dopElement => {  
                              if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                    element['dopName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                    element['dop_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                    element['dop_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                    element['dop_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];                                                                        
                                    element['isDOPMapped']=true;
                                    this.updatedAdvStories.push(element); 
                                  //this.userExist = true;
                                }
                        }  ); 
                  }   
               if (element['editor']!==undefined && element['editor']) { 
                        element['editor'].forEach(dopElement => {  
                          if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                element['editorName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                element['editor_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                element['editor_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                element['editor_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                element['isEditorMapped']=true;
                                this.updatedAdvStories.push(element); 
                              //this.userExist = true;
                            }
                    }  ); 
                  }  
           if (element['assistantDirector']!==undefined && element['assistantDirector']) {      
                    element['assistantDirector'].forEach(dopElement => {  
                      if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                            element['assistantDirectorName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                            element['assistantDirector_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                            element['assistantDirector_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                            element['assistantDirector_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                            element['isAssistantDirectorMapped']=true;
                            this.updatedAdvStories.push(element); 
                          //this.userExist = true;
                        }
                }  ); 
          } 
       if (element['scriptWriter']!==undefined && element['scriptWriter']) {  
              element['scriptWriter'].forEach(dopElement => {  
                      if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                            element['scriptWriterName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                            element['scriptWriter_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                            element['scriptWriter_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                            element['scriptWriter_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                            element['isScriptWriterMapped']=true;
                            this.updatedAdvStories.push(element); 
                          //this.userExist = true;
                        }
                }  ); 
          }
           if (element['supportingActorMale']!==undefined && element['supportingActorMale']) {
                element['supportingActorMale'].forEach(dopElement => {  
                  if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                        element['supportingActorMaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                        element['supportingActorMale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                        element['supportingActorMale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                        element['supportingActorMale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                        element['isSupportingActorMaleMapped']=true;
                        this.updatedAdvStories.push(element); 
                      //this.userExist = true;
                    }
            }  );
          }  
           if (element['supportingActorFemale']!==undefined && element['supportingActorFemale']) {  
                    element['supportingActorFemale'].forEach(dopElement => {  
                      if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                            element['supportingActorFemaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                            element['supportingActorFemale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                            element['supportingActorFemale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                            element['supportingActorFemale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                            element['isSupportingActorFemaleMapped']=true;
                            this.updatedAdvStories.push(element); 
                          //this.userExist = true;
                        }
                }  );
          }   
           if (element['choreographer']!==undefined && element['choreographer']) {    
                      element['choreographer'].forEach(dopElement => {  
                        if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                              element['choreographerName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                              element['choreographer_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                              element['choreographer_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                              element['choreographer_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                              element['isChoreographerMapped']=true;
                              this.updatedAdvStories.push(element); 
                            //this.userExist = true;
                          }
                  }  ); 
                }  
       if (element['studio']!==undefined && element['studio']) {          
                element['studio'].forEach(dopElement => {  
                  if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                        element['studioName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                        element['studio_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                        element['studio_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                        element['studio_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                        element['iStudioMapped']=true;
                        this.updatedAdvStories.push(element); 
                      //this.userExist = true;
                    }
                }  );
        }
     if (element['equipment']!==undefined && element['equipment']) {      
          element['equipment'].forEach(dopElement => {  
            if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                  element['equipmentName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                  element['equipment_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                  element['equipment_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                  element['equipment_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                  element['iEquipmentMapped']=true;
                  this.updatedAdvStories.push(element); 
                //this.userExist = true;
              }
          }  );
        } 
        if (element['dubbingArtistMale']!==undefined && element['dubbingArtistMale']) {
          element['dubbingArtistMale'].forEach(dopElement => {  
            if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                  element['dubbingMaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                  element['dubbingMale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                  element['dubbingMale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                  element['dubbingMale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                  element['isDubbingMaleMapped']=true;
                  this.updatedDramaStories.push(element); 
                //this.userExist = true;
              }
          }  );  
        } 
        if (element['dubbingArtistFemale']!==undefined && element['dubbingArtistFemale']) {
          element['dubbingArtistMale'].forEach(dopElement => {  
            if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                  element['dubbingFemaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                  element['dubbingFemale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                  element['dubbingFemale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                  element['dubbingFemale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                  element['isDubbingFemaleMapped']=true;
                  this.updatedDramaStories.push(element); 
                //this.userExist = true;
              }
          }  );  
        }       
              this.updatedAdvStories.push(element); 
              this.updatedAdvStories = _.uniqBy(this.updatedAdvStories, 'title' );
      }); */
       this.crimeStories = _.filter(this.posts, { 'generType': 'CRIME', 'uploadedBy': this.userData.userName });
       this.crimeStories = _.orderBy(this.crimeStories, ['uploadedOn'], ['desc']);
       this.crimeStories = _.uniqBy(this.crimeStories, 'title' );
      /** this.crimeStories.forEach(element => {
                                                    //if (element && element.split('_')[1] && element.split('_')[1].indexOf(this.username) >= 0) {
                                                      //IF user already exist you have done mapping messae will be shown
                                                      if (element['dop'] !== undefined && element['dop']) {
                                                        element['dop'].forEach(dopElement => {  
                                                                          if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                                                element['dopName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                                                element['dop_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                                                element['dop_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                                                element['dop_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                                                element['isDOPMapped']=true;
                                                                                this.updatedCrimeStories.push(element); 
                                                                              //this.userExist = true;
                                                                            }
                                                                    }  );
                                                                  }  
                                              if (element['editor'] !== undefined && element['editor']) {  
                                                                  if (element['editor'] !== undefined && element['editor']) {         
                                                                    element['editor'].forEach(dopElement => {  
                                                                      if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                                            element['editorName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                                            element['editor_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                                            element['editor_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                                            element['editor_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                                            element['isEditorMapped']=true;
                                                                            this.updatedCrimeStories.push(element); 
                                                                          //this.userExist = true;
                                                                        }
                                                                }  ); 
                                                              }  
                                                            }   
                                            if (element['assistantDirector'] !== undefined && element['assistantDirector']) {           
                                                                element['assistantDirector'].forEach(dopElement => {  
                                                                  if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                                        element['assistantDirectorName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                                        element['assistantDirector_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                                        element['assistantDirector_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                                        element['assistantDirector_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                                        element['isAssistantDirectorMapped']=true;
                                                                        this.updatedCrimeStories.push(element); 
                                                                      //this.userExist = true;
                                                                    }
                                                            }  ); 
                                                          }
                                              if (element['scriptWriter'] !== undefined && element['scriptWriter']) {         
                                                            element['scriptWriter'].forEach(dopElement => {  
                                                              if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                                    element['scriptWriterName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                                    element['scriptWriter_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                                    element['scriptWriter_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                                    element['scriptWriter_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                                    element['isScriptWriterMapped']=true;
                                                                    this.updatedCrimeStories.push(element); 
                                                                  //this.userExist = true;
                                                                }
                                                        }  );
                                                      }   
                                              if (element['supportingActorMale'] !== undefined && element['supportingActorMale']) {           
                                                        element['supportingActorMale'].forEach(dopElement => {  
                                                          if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                                element['supportingActorMaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                                element['supportingActorMale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                                element['supportingActorMale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                                element['supportingActorMale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                                element['isSupportingActorMaleMapped']=true;
                                                                this.updatedCrimeStories.push(element); 
                                                              //this.userExist = true;
                                                            }
                                                    }  );
                                              }  
                                                if (element['supportingActorFemale'] !== undefined && element['supportingActorFemale']) {    
                                                          element['supportingActorFemale'].forEach(dopElement => {  
                                                            if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                                  element['supportingActorFemaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                                  element['supportingActorFemale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                                  element['supportingActorFemale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                                  element['supportingActorFemale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                                  element['isSupportingActorFemaleMapped']=true;
                                                                  this.updatedCrimeStories.push(element); 
                                                                //this.userExist = true;
                                                              }
                                                      }  );
                                                }   
                                                if (element['choreographer'] !== undefined && element['choreographer']) {
                                                          element['choreographer'].forEach(dopElement => {  
                                                            if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                                  element['choreographerName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                                  element['choreographer_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                                  element['choreographer_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                                  element['choreographer_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                                  element['isChoreographerMapped']=true;
                                                                  this.updatedCrimeStories.push(element); 
                                                                //this.userExist = true;
                                                              }
                                                      }  ); 
                                                  }
                                            if (element['studio'] !== undefined && element['studio']) {
                                                  element['studio'].forEach(dopElement => {  
                                                    if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                          element['studioName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                          element['studio_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                          element['studio_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                          element['studio_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                          element['iStudioMapped']=true;
                                                          this.updatedCrimeStories.push(element); 
                                                        //this.userExist = true;
                                                      }
                                                  }  );
                                                } 
                                             if (element['equipment'] !== undefined && element['equipment']) {
                                                          element['equipment'].forEach(dopElement => {  
                                                            if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                                  element['equipmentName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                                  element['equipment_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                                  element['equipment_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                                  element['equipment_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                                  element['iEquipmentMapped']=true;
                                                                  this.updatedCrimeStories.push(element); 
                                                                //this.userExist = true;
                                                              }
                                                          }  );
                                                        } 
                                                        if (element['dubbingArtistMale']!==undefined && element['dubbingArtistMale']) {
                                                          element['dubbingArtistMale'].forEach(dopElement => {  
                                                            if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                                  element['dubbingMaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                                  element['dubbingMale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                                  element['dubbingMale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                                  element['dubbingMale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                                  element['isDubbingMaleMapped']=true;
                                                                  this.updatedDramaStories.push(element); 
                                                                //this.userExist = true;
                                                              }
                                                          }  );  
                                                        } 
                                                        if (element['dubbingArtistFemale']!==undefined && element['dubbingArtistFemale']) {
                                                          element['dubbingArtistMale'].forEach(dopElement => {  
                                                            if (dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2] == this.username) {
                                                                  element['dubbingFemaleName']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0];
                                                                  element['dubbingFemale_img']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
                                                                  element['dubbingFemale_skills']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[3];
                                                                  element['dubbingFemale_mobile']=dopElement.split('***@@@shirdi&&&saibaba@@@^^^!!!')[4];
                                                                  element['isDubbingFemaleMapped']=true;
                                                                  this.updatedDramaStories.push(element); 
                                                                //this.userExist = true;
                                                              }
                                                          }  );  
                                                        }    
                                                                                                       
              this.updatedCrimeStories.push(element); 
              this.updatedCrimeStories = _.uniqBy(this.updatedCrimeStories, 'title' );
            }); */
    
          });

        }
  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  getStatus(obj) {
    if (obj['likes'].indexOf(this.username) >= 0) {
      return true;
    } else {
      return false;
    }
  }
  changeClass(obj) {
    if (this.liked == true) {
      this.liked = false;
      this.heartClass = "heart-cls-white";
      if (obj['likes'].indexOf(this.username) > 0) {
        let idx = obj['likes'].indexOf(this.username);
        obj['likes'].splice(idx, 1);
      }
    } else {
      this.liked = true;
      this.heartClass = "heart-cls-red";
      if (obj['likes'].indexOf(this.username) <= 0) {
        obj['likes'].push(this.username);
      }
    }
    this.fireBaseService.updatePost(obj['id'], obj);
  }
  changeCategory(ev) {
    this.generType = ev.detail.value;
    this.isLoaded = false;
    this.showSkeltonLoading();
  }
  /**async showActors(){
 
    this.router.navigateByUrl('/account');
  }*/
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
  async addTechnicians(postData){
      
    this.confData.isFromPage='map-technicians';
    const modal = await this.modalController.create({
      component: ActorAddPage,
      componentProps: {
        "paramID": postData,
        "paramTitle": "Test Title"
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //this.checkActor(this.dataReturned);
        this.dopName ='';
        this.dop_img='';
        this.editorName='';
        this.editor_img ='';
        this.assistantDirectorName='';
        this.assistantDirector_img='';
        this.scriptWriterName='';
        this.scriptWriter_img='';
        this.supportingMaleActorName='';
        this.supportingMaleActor_img='';
        this.supportingFemaleActorName='';
        this.supportingMaleActor_img='';
        this.choreographerName='';
        this.choreographer_img='';
        this.studioName='';
        this.studio_img='';
        this.equipmentName =''
        this.equipment_img='';
        this.dubbingFemaleName=''
        this.dubbingFemale_img='';
        this.dubbingMaleName='';
        this.dubbingMale_img='';
        this.userData.mappedCrews.forEach(element => {
          if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'dop'){
           this.dopName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
            this.dop_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
          }
          else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'assistantDirector'){
            this.assistantDirectorName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.assistantDirector_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'scriptWriter'){
            this.scriptWriterName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.scriptWriter_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'supportingActorMale'){
            this.supportingMaleActorName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.supportingMaleActor_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'supportingActorFemale'){
            this.supportingFemaleActorName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.supportingFemaleActor_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'choreographer'){
            this.choreographerName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.choreographer_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'studio'){
            this.studioName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.studio_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'equipment'){
            this.equipmentName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.equipment_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'dubbingMaleName'){
            this.dubbingMaleName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.dubbingMale_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }else if (element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[0] == 'dubbingFemaleName'){
            this.dubbingFemaleName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
             this.dubbingFemale_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }else{
            this.editorName = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[1];
            this.editor_img = element.split('***@@@shirdi&&&saibaba@@@^^^!!!')[2];
           }
       });       
        this.userExist =false;
        this.isMapped =true;
        this.isDOPMapped =true;
        this.isEditorMapped =true;
        //this.choiceSavedpresentToast('Your choices are saved..!', 'toast-success');
      }
    });

    return await modal.present();
    
  }
  checkActor(data) {

    if (data['dop']!==undefined && data['editor']!==undefined && data['dop'] && data['editor'] && data['dop'].length == 0 && data['editor'].length == 0) {
      this.hasActor = false;
    } else {
      this.userExist = false;
      //if (data['dop']!==undefined!==undefined && data['editor']!==undefined && data['dop'] && data['editor']) {
        data.forEach(element => {
          //if (element && element.split('_')[1] && element.split('_')[1].indexOf(this.username) >= 0) {
            //IF user already exist you have done mapping messae will be shown
            if (element['dop']!==undefined!==undefined && element['editor']!==undefined && element['dop'] && element['editor']) {
                    if (element == this.username) {
                    this.userExist = true;
                  }
                }   
        });
     // }
      this.hasActor = true;
      
    }
  }
  slideOptsActors = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    slideShadows: true,
    pager: false
  };
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
  /**actorModalpopup(eachObj){
    this.popup=true;
    this.popupActorName = eachObj.assistantDirectorName;
    //this.popupActorSkills = eachObj.skills;
    //let profile= eachObj.profiles?eachObj.profiles.split('=')[1]:eachObj.profiles;
    //this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+profile);
    }
  actorModalClosepopup(){ 
    this.popup=false;
    this.popupActorName = "";
    this.popupActorSkills = "";
  }*/
  async openModal(techieObj) {
    const modal = await this.modalController.create({
    component: TechnicianDetailsPage,
    componentProps: { techieObj: techieObj }
    });
    return await modal.present();
   }
   dismiss() {
    this.modalController.dismiss();
    }
    async editTechnician(techieObj){

      this.confData.isFromPage='map-technicians';
              const modal = await this.modalController.create({
                component: ActorAddPage,
                componentProps: {
                  "paramID": techieObj,
                  "paramTitle": "Test Title"
                }
              });

              modal.onDidDismiss().then((dataReturned) => {
                if (dataReturned !== null) {
                  this.getPostsForPostedStories(); 
                }
              });
              return await modal.present();
     /**  this.fireBaseService.filterPostByActorName(techieObj.uploadedBy).then(element => {
      if (!_.isEmpty(element['docs'])) {
            element['docs'].forEach(arg => {              
                  if(arg["id"] == techieObj.id){
                    let obj ={};
                    console.log("arg.data().isAtleastOneMappingDoneObj:::",arg.data().isAtleastOneMappingDone);
                    //arg.data()["isAtleastOneMappingDone"] = false;
                    obj = arg.data();  
                    obj["isAtleastOneMappingDone"] =false;                
                    this.fireBaseService.updatePost(arg["id"] , obj); 
                  }               
              });
              console.log("loop ended");
              this.getPostsForPostedStories();
            }
            //console.log("yennachi:::",element['docs']);
          }); */
      
      //this.fireBaseService.filterPostByActorName(techieObj.actorName);
    }
}

