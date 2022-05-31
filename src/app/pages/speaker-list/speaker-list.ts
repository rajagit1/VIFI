import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Router } from '@angular/router';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { UserData } from '../../providers/user-data';
import { ModalController, IonRouterOutlet,ToastController } from '@ionic/angular';
import { ActorListPage } from '../actor-list/actor-list.page';
import { AccountPage } from '../account/account';
import { NavigationStart, Event as NavigationEvent } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
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
  comedyStories: any;
  advStories: any;
  crimeStories: any;
  isLoaded: boolean = false;
  liked: boolean = false;
  heartClass: string;
  defaultHref = '/app/tabs/schedule';
  showSearchbar: boolean=true;
  userType ="";
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
  ]
  username: string;
  excludeTracks: any;
  queryText: string;
  isItemAvailable: boolean;
  items: any[];
  constructor(public confData: ConferenceData,
    public router: Router,public routerOutlet: IonRouterOutlet,public toastCtrl: ToastController,
    public userData: UserData,public modalController: ModalController,
    public fireBaseService: FireBaseService,public ngFireAuth: AngularFireAuth) { 
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
    }
  logout() {
    this.userType ="";
    if(this.confData.isFromPage =="profile"){
      this.confData.isFromPage="";
      this.router.navigateByUrl('/app/tabs/about');
    }else{
      this.confData.isFromPage ="";
      this.router.navigateByUrl('/app/tabs/schedule');
    }    
    
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
                  if(this.confData.isFromPage =="profile"){
                    this.getPostsForPostedStories();
                  }else{
                    this.getPosts();
                  }
      /** }else{
        this.presentToast('Please login/signup to see more!','toast-success');
        this.router.navigateByUrl('/signUp'); 
      }
    });*/  
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
     } else {
      this.getPosts();
    }
   

  }
  async getPosts() {
    this.userData.getIsCertified().then((isCertifiedFlag) => {
      this.userData.isCertified = isCertifiedFlag;
    });
    this.posts = [];
    this.certifiedDramaPostedStories  =[];
    this.certifiedComedyPostedStories =[];
    this.certifiedAdventurePostedStories =[];
    this.certifiedCrimePostedStories =[];
    this.dramaStories = [];
    this.comedyStories = [];
    this.advStories = [];
    this.crimeStories = [];
    this.fireBaseService.readPosts().subscribe(data => {
      data.map((e: any) => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        this.posts.push(docData);
      });
      this.posts.reverse();  
      this.posts = [...this.posts]; 
      this.posts = _.uniqBy(this.posts,'title');  
      if(this.userType == 'P' && this.userData.isCertified == true){ 
        this.certifiedDramaPostedStories = _.filter(this.posts, { 'generType': 'DRAMA' ,'storyVisibility':"Certified"});           
        this.certifiedComedyPostedStories = _.filter(this.posts, { 'generType': 'COMEDY' ,'storyVisibility':"Certified"});           
        this.certifiedAdventurePostedStories = _.filter(this.posts, { 'generType': 'ADVENTURE' ,'storyVisibility':"Certified"});           
        this.certifiedCrimePostedStories = _.filter(this.posts, { 'generType': 'CRIME' ,'storyVisibility':"Certified"});    
           
       
      }
      else if(this.userType  == 'D'  ){
        this.certifiedDramaPostedStories = _.filter(this.posts, { 'generType': 'DRAMA' ,'storyVisibility':"Certified",'uploadedBy':this.username});           
        this.certifiedComedyPostedStories = _.filter(this.posts, { 'generType': 'COMEDY' ,'storyVisibility':"Certified",'uploadedBy':this.username});           
        this.certifiedAdventurePostedStories = _.filter(this.posts, { 'generType': 'ADVENTURE' ,'storyVisibility':"Certified",'uploadedBy':this.username});           
        this.certifiedCrimePostedStories = _.filter(this.posts, { 'generType': 'CRIME' ,'storyVisibility':"Certified",'uploadedBy':this.username});    
      } 
      
      this.posts =  _.filter(this.posts, { 'storyVisibility':"Public" });
     
      this.dramaStories = _.filter(this.posts, { 'generType': 'DRAMA' });
      if(this.certifiedDramaPostedStories.length > 0){
        this.certifiedDramaPostedStories.forEach(item =>
           this.dramaStories.push(item)
           );
           this.certifiedDramaPostedStories.forEach(item => this.posts.push(item));
       }
       this.dramaStories = _.uniqBy(this.dramaStories, 'title');
      this.dramaStories = _.orderBy(this.dramaStories, ['uploadedOn'], ['desc']);

      this.comedyStories = _.filter(this.posts, { 'generType': 'COMEDY' });
      if(this.certifiedComedyPostedStories.length > 0){
        this.certifiedComedyPostedStories.forEach(item => this.comedyStories.push(item));
        this.certifiedComedyPostedStories.forEach(item => this.posts.push(item));
       }
      this.comedyStories = _.uniqBy(this.comedyStories, 'title');
      this.comedyStories = _.orderBy(this.comedyStories, ['uploadedOn'], ['desc']);

      this.advStories = _.filter(this.posts, { 'generType': 'ADVENTURE' });
      if(this.certifiedAdventurePostedStories.length > 0){
        this.certifiedAdventurePostedStories.forEach(item => this.advStories.push(item));
        this.certifiedAdventurePostedStories.forEach(item => this.posts.push(item));
       }
      this.advStories = _.uniqBy(this.advStories, 'title');
      this.advStories = _.orderBy(this.advStories, ['uploadedOn'], ['desc']);

      this.crimeStories = _.filter(this.posts, { 'generType': 'CRIME' });
      if(this.certifiedCrimePostedStories.length > 0){
        this.certifiedCrimePostedStories.forEach(item => this.crimeStories.push(item));
        this.certifiedCrimePostedStories.forEach(item => this.posts.push(item));
       }
      this.crimeStories = _.uniqBy(this.crimeStories, 'title');
      this.crimeStories = _.orderBy(this.crimeStories, ['uploadedOn'], ['desc']);

    });
  }
  async getPostsForPostedStories() {
    this.posts = [];
    this.dramaStories = [];
    this.comedyStories = [];
    this.advStories = [];
    this.crimeStories = [];
    this.fireBaseService.readPosts().subscribe(data => {
      data.map((e: any) => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        this.posts.push(docData);
      });
      this.posts.reverse();
      this.posts = [...this.posts];
      this.dramaStories = _.filter(this.posts, { 'generType': 'DRAMA', 'uploadedBy': this.userData.userName });
      this.dramaStories = _.orderBy(this.dramaStories, ['uploadedOn'], ['desc']);
      this.dramaStories = _.uniqBy(this.dramaStories, 'title' );
      this.comedyStories = _.filter(this.posts, { 'generType': 'COMEDY', 'uploadedBy': this.userData.userName });
      this.comedyStories = _.orderBy(this.comedyStories, ['uploadedOn'], ['desc']);
      this.comedyStories = _.uniqBy(this.comedyStories, 'title' );
      this.advStories = _.filter(this.posts, { 'generType': 'ADVENTURE', 'uploadedBy': this.userData.userName });
       this.advStories = _.orderBy(this.advStories, ['uploadedOn'], ['desc']);
       this.advStories = _.uniqBy(this.advStories, 'title' );
       this.crimeStories = _.filter(this.posts, { 'generType': 'CRIME', 'uploadedBy': this.userData.userName });
       this.crimeStories = _.orderBy(this.crimeStories, ['uploadedOn'], ['desc']);
       this.crimeStories = _.uniqBy(this.crimeStories, 'title' );
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
  async showActors(){
 
    this.router.navigateByUrl('/account');
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
  editStory(storyDetails){
    this.userData.isFromSpeakerListPage = true;
    this.userData.fromSpeakerListData=storyDetails;
    this.router.navigateByUrl('app/tabs/create-post');
  }
}