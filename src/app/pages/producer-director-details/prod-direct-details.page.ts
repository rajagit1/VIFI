import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from "lodash";
import { ConferenceData } from '../../providers/conference-data';
import { FireBaseService } from '../../services/firebase.service';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import {  ModalController,IonRouterOutlet } from '@ionic/angular';
@Component({
  selector: 'app-actor-details',
  templateUrl: './prod-direct-details.page.html',
  styleUrls: ['./prod-direct-details.page.scss'],
})
export class ProdDirectDetailsPage implements OnInit {
  safeURL: any;
  actorData: any;
  p_bar_value1: number;
  postData:any={};
  isLoaded:boolean=false;
  postedStories=[];
  defaultHref = '/app/tabs/schedule';
  excludeTracks: any = [];
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
  constructor(public router:Router, 
    private youtube: YoutubeVideoPlayer,
    private confData:ConferenceData,
    private firebase:FireBaseService,
    public modalCtrl: ModalController,
    public routerOutlet: IonRouterOutlet,
    private _sanitizer: DomSanitizer) { 
    
  }
  ngOnInit(){
    this.actorData=this.confData.actorData;
  }
  ionViewDidEnter() {
    this.actorData=this.confData.actorData;
    console.log("from prod direct:::",this.actorData);
    this.postData=this.firebase.postData;
    this.postedStories = this.actorData['associatedStories'];
    let profile=this.actorData.profiles?this.actorData.profiles.split('=')[1]:this.actorData.profiles;
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+profile);
    this.runDeterminateProgress();    
    //this.filterStories();
    console.log("filtering is done");
    this.showSkeltonLoading();
    console.log("showSkeltonLoading is done");
  }
  /**filterStories(){
    this.postData.forEach(element => {
       if(this.actorData['postedStories'].indexOf(element['id'])>=0){
          this.postedStories.push(element);
       }
    });
    //this.associatedStories = _.filter(this.postedStories, { 'uploadedBy': this.confData.loginUser });
    console.log('assocaited stories',this.postedStories);
    this.postedStories = _.uniqBy(this.postedStories,'title');
  } **/
  showSkeltonLoading() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 1000);
  }
  runDeterminateProgress() {
    
    for (let index = 0; index <= 100; index++) {
      this.setPercentBar(+index);
    }
  }

  setPercentBar(i) {
    setTimeout(() => {
      let apc = (i / 100)
    
      this.p_bar_value1 = apc;
      
    }, 30 * i);
  }
  logout() {
    if(this.confData.isFromPage == 'notification'){
      this.router.navigateByUrl("/app/tabs/schedule/#schedule-filter");
      //this.presentFilter();
      return ;
    }
    else if(this.confData.isFromPage == 'speakerDetails'){
      this.confData.isDirectorLabelClicked = false;
      this.router.navigateByUrl('/app/tabs/speakers/speaker-details');
    }else{
    this.router.navigateByUrl('/app/tabs/schedule');
    this.actorData={};
    }
  }
  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    
  }
  
  
}
