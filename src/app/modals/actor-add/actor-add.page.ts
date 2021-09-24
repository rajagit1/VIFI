import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, IonReorderGroup, ToastController, LoadingController } from '@ionic/angular';
import { DragulaService } from 'ng2-dragula';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import { UserData } from '../../providers/user-data';
import { ConferenceData } from '../../providers/conference-data';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/auth';
import { IonSlides } from '@ionic/angular';
import { ActordetailsPopupPage } from '../../pages/actordetails-popup/actordetails-popup.page';
@Component({
  selector: 'app-actor-add',
  templateUrl: './actor-add.page.html',
  styleUrls: ['./actor-add.page.scss'],
})
export class ActorAddPage implements OnInit {
  
  @ViewChild('slideWithNav',{static:false}) ionSlides: IonSlides;

  q1 = [

  ];
  q2 = [


  ];

  q3 = [


  ];
  q4 = [


  ];
  q5 = [


  ];
  q6 = [


  ];
  q7 = [


  ];
  q8 = [


  ];
  q9 = [


  ];
  q10 = [


  ];
  q11 = [


  ];
  q12 = [


  ];
  q13 = [


  ];
  q14 = [


  ];
  q15 = [


  ];
  q16 = [


  ];
  q17 = [


  ];
  q18 = [


  ];
  q19 = [


  ];


  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    slideShadows: true,
    onlyExternal:true,
    pager: false
  };

  todo = { value: '', color: '' };
  selectedQuadrant = 'q1';
  showActress = 'actor';
  showMaleSinger='maleSinger';
  showFemaleSinger='femaleSinger';
  slideOpts: { slidesPerView: number; coverflowEffect: { rotate: number; stretch: number; depth: number; modifier: number; slideShadows: boolean; }; };
  users: any = [];
  safeURLs:any =[];
  actors: any;
  actress: any;
  postData: any;
  username: string;
  queryText_studioExp:string="";
  queryText_equipmentExp:string="";
  queryText_choreographerExp:string="";
  queryText_dubbingFemaleExp:string="";
  queryText_dubbingMaleExp:string="";
  queryText_supportingFemaleActorExp:string="";
  queryText_supportingMaleActorExp:string="";
  queryText_etrExp:string="";
  queryText_dopExp:string="";

  queryText_assitantdirector:string="";
  queryText_assitantdirectorExp:string="";
  selectedActor: string = "";
  selectedActress: string = "";
  selectedMaleSinger: string = "";
  selectedFemaleSinger: string = "";
  selectedDOP: string = "";
  selectedEditor: string = "";
  selectedAssistantDirector:string="";
  selectedScriptWriter:string="";
  selectedSupportMaleActor:string="";
  selectedSupportFemaleActor:string="";
  selectedDubbingArtistMale:string="";
  selectedDubbingArtistFemale:string="";
  selectedChoregpr:string="";
  selectedequipment:string="";
  selectedStudio:string="";
  selectedMusic: string = "";
  actor_img: any;
  actoress_img: any;
  queryText_actor: string = "";
  queryText_actress: string = "";
  queryText_maleSinger: string = "";
  queryText_femaleSinger: string = "";
  queryText_musicDirector: string = "";
  queryText_supportingMaleActor: string ="";
  queryText_supportingFemaleActor: string ="";
  queryText_dubbingMale:string="";
  queryText_dubbingFemale:string="";
  queryText_dop: string = "";
  queryText_etr: string = "";
  queryText_scriptwriter:string="";
  queryText_scriptwriterEXP:string="";
  queryText_equipment: string="";
  queryText_choreographer: string="";
  queryText_studio: string = "";
  queryText_supportingMaleActorAge:string="";
  queryText_supportingFemaleActorAge:string="";
  forWardisplay:string="visibile";
  maleActor: any = [];
  femaleActor: any = [];
  musicDirector: any = []; //Music Director Male
  musicDirectorFemale: any = []; //Muic Diector Female
  maleSinger:any=[];
  femaleSinger:any[];
  assistantdirectors:any[];
  scriptwriters:any[];
  supportingartistsMale:any[];
  supportingartistsFemale:any[];
  dubbingArtistMaleList:any[];
  dubbingArtistFemaleList:any[];
  choregrprs:any[];
  equipments:any[];
  studios:any[];
  dop:any[];
  editor:any[];
  isActorSkipped:boolean=false;
  isActressSkipped:boolean=false;
  isDOPSkipped:boolean=false;
  isEditorSkipped:boolean=false;
  isAssistantDirectorSkipped:boolean=false;
  isScriptWriterSkipped:boolean=false;
  isSupportingActorMaleSkipped:boolean=false;
  isSupportingActorFemaleSkipped:boolean=false;
  isDubbingMaleArtistSkipped:boolean=false;
  isDubbingFemaleArtistSkipped:boolean=false;
  isChoreographerSkipped:boolean=false;
  isEquipmentSkipped:boolean=false;
  isStudioskipped:boolean=false;
  isMapped:boolean=false;
  mediaFile:string="";
  profile:string="";
  popup:boolean=false;
  popupActorName="";
  popupActorSkills="";
  safeURL: any;
  mappedCount:any;
  constructor(private dragulaService: DragulaService,
    private toastController: ToastController,
    private modalController: ModalController,
    private fireBaseService: FireBaseService,
    private navParams: NavParams,
    public userData: UserData,
    public router: Router,
    public confData: ConferenceData,
    private _sanitizer: DomSanitizer,
    public ngFireAuth: AngularFireAuth,
    private loadingCtrl: LoadingController) {
    this.dragulaService.drag('bag')
      .subscribe(({ name, el, source }) => {
        el.setAttribute('color', 'danger');
      });

    this.dragulaService.removeModel('bag')
      .subscribe(({ item }) => {
        this.toastController.create({
          message: 'Removed: ' + item.value,
          duration: 2000
        }).then(toast => toast.present());
      });

    this.dragulaService.dropModel('bag')
      .subscribe(({ item }) => {
        item['color'] = 'success';
      });


  }
  

  useFilter(arg, type) { 
    if (type == "actor") {
      return this.maleActor.filter(item => {
        return item.experience == arg ;
       // return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    } else if (type == "actress") {
      return this.femaleActor.filter(item => {
        return item.experience == arg ;
        //return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }else if (type == "maleSinger") {
      return this.maleSinger.filter(item => {
        return item.experience == arg ;
        //return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }else if (type == "femaleSinger") {
      return this.femaleSinger.filter(item => {
        return item.experience == arg ;
        //return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }
    else if (type == "DOP") {
      return this.dop.filter(item => {
        return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }
    else if (type == "ETR") {
      return this.editor.filter(item => {
        return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }else if (type == "AD") {
      return this.assistantdirectors.filter(item => {
        return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }else if (type == "SW") {
      return this.scriptwriters.filter(item => {
        return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }else if (type == "supportingMaleActor") {
      return this.supportingartistsMale.filter(item => {
        return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }else if (type == "supportingFemaleActor") {
      return this.supportingartistsFemale.filter(item => {
        return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }else if (type == "DUB_M") {
      return this.dubbingArtistMaleList.filter(item => {
        return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }else if (type == "DUB_F") {
      return this.dubbingArtistFemaleList.filter(item => {
        return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }else if (type == "EQMT") {
      return this.equipments.filter(item => {
        return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    } else if (type == "STUD") {
      return this.studios.filter(item => {
        return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }else if (type == "CHORGR") {
      return this.choregrprs.filter(item => {
        return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
    }  else {
      return this.musicDirector.filter(item => {
        return item.experience == arg ;
        //return item.actorName.toLowerCase().indexOf(arg.toLowerCase()) > -1;
      });
      //Music director female needs to be implemented
    }

  }
  
  setFilteredItems(type) {
    if (type == "actor") {
      if (this.queryText_actor != '' && this.queryText_actor !== null) {
        this.q3 = this.useFilter(this.queryText_actor, type);
      } else {
        this.q3 = this.maleActor;
      }
    } else if (type == "actress") {
      if (this.queryText_actress != '' && this.queryText_actress !== null) {

        this.q1 = this.useFilter(this.queryText_actress, type);
      } else {
        this.q1 = this.femaleActor;
      }
    }else if (type == "maleSinger") {
      if (this.queryText_maleSinger != '' && this.queryText_maleSinger !== null) {

        this.q7 = this.useFilter(this.queryText_maleSinger, type);
      } else {
        this.q7 = this.maleSinger;
      }
    }else if (type == "femaleSinger") {
      if (this.queryText_femaleSinger != '' && this.queryText_femaleSinger !== null) {

        this.q8 = this.useFilter(this.queryText_femaleSinger, type);
      } else {
        this.q8 = this.femaleSinger;
      }
    }else if (type == "DOP") {
      if (this.queryText_dop != '' && this.queryText_dop !== null) {

        this.q9 = this.useFilter(this.queryText_dop, type);
      } else {
        this.q9 = this.dop;
      }
    }else if (type == "ETR") {
      if (this.queryText_etr != '' && this.queryText_etr !== null) {

        this.q10 = this.useFilter(this.queryText_etr, type);
      } else {
        this.q10 = this.editor;
      }
    }else if (type == "AD") {
      if (this.queryText_assitantdirector != '' && this.queryText_assitantdirector !== null) {

        this.q11 = this.useFilter(this.queryText_assitantdirector, type);
      } else {
        this.q11 = this.assistantdirectors;
      }
    }else if (type == "SW") {
      if (this.queryText_scriptwriter != '' && this.queryText_scriptwriter !== null) {

        this.q12 = this.useFilter(this.queryText_scriptwriter, type);
      } else {
        this.q12 = this.scriptwriters;
      }
    }else if (type == "supportingMaleActor") {
      if (this.queryText_supportingMaleActor != '' && this.queryText_supportingMaleActor !== null) {

        this.q13 = this.useFilter(this.queryText_supportingMaleActor, type);
      } else {
        //this.queryText_supportingMaleActor="";
        this.q13 = this.supportingartistsMale;
      }
    }else if (type == "supportingFemaleActor") {
      if (this.queryText_supportingFemaleActor != '' && this.queryText_supportingFemaleActor !== null) {

        this.q17 = this.useFilter(this.queryText_supportingFemaleActor, type);
      } else {
        //this.queryText_supportingFemaleActor ="";
        this.q17 = this.supportingartistsFemale;
      }
    }else if (type == "DUB_M") {
      if (this.queryText_dubbingMale != '' && this.queryText_dubbingMale !== null) {

        this.q18 = this.useFilter(this.queryText_dubbingMale, type);
      } else {
        this.q18 = this.supportingartistsMale;
      }
    }else if (type == "DUB_F") {
      if (this.queryText_dubbingFemale != '' && this.queryText_dubbingFemale !== null) {

        this.q19 = this.useFilter(this.queryText_dubbingFemale, type);
      } else {
        this.q19 = this.supportingartistsMale;
      }
    }else if (type == "CHORGR") {
      if (this.queryText_choreographer != '' && this.queryText_choreographer !== null) {

        this.q14 = this.useFilter(this.queryText_choreographer, type);
      } else {
        this.q14 = this.choregrprs;
      }
    }else if (type == "EQMT") {
      if (this.queryText_equipment != '' && this.queryText_equipment !== null) {

        this.q15 = this.useFilter(this.queryText_equipment, type);
      } else {
        this.q15 = this.equipments;
      }
    }else if (type == "STUD") {
      if (this.queryText_studio != '' && this.queryText_studio !== null) {

        this.q16 = this.useFilter(this.queryText_studio, type);
      } else {
        this.q16 = this.studios;
      }
    }  else {
      if (this.queryText_musicDirector != ''  && this.queryText_musicDirector !== null) {

        this.q5 = this.useFilter(this.queryText_musicDirector, type);
      } else {
        this.q5 = this.musicDirector;
      }
    }

  }
  //SetFilter for Technician for supporting Artists
  setFilteredItemsAge(type) {
    if (type == "supportingMaleActor") {
      if (this.queryText_supportingMaleActorAge != '') {
        this.q13 = this.useFilterAge(this.queryText_supportingMaleActorAge, type);
      } else {
        this.q13 = this.supportingartistsMale; 
      }
    } 
    if (type == "supportingFemaleActor") {
      if (this.queryText_supportingFemaleActorAge != '') {
        this.q17 = this.useFilterAge(this.queryText_supportingFemaleActorAge, type);
      } else {
        this.q17 = this.supportingartistsFemale; 
      }
    } 
  }
//SetFilter for Technician(Editor,DOP,Choregrapher,) for supporting Artists
  setFilteredItemsExperience(type) {
    if (type == "DOP") {
      if (this.queryText_dopExp != '' && this.queryText_dopExp != null) {

        this.q9 = this.useFilterExperience(this.queryText_dopExp, type);
      } else {
        this.q9 = this.dop;
      }
    }else if (type == "ETR") {
      if (this.queryText_etrExp != '' && this.queryText_etrExp != null) {

        this.q10 = this.useFilterExperience(this.queryText_etrExp, type);
      } else {
        this.q10 = this.editor;
      }
    }else if (type == "AD") {
      if (this.queryText_assitantdirectorExp != '' && this.queryText_assitantdirectorExp != null) {

        this.q11 = this.useFilterExperience(this.queryText_assitantdirectorExp, type);
      } else {
        this.q11 = this.assistantdirectors;
      }
    }else if (type == "SW") {
      if (this.queryText_scriptwriterEXP != '' && this.queryText_scriptwriterEXP != null) {

        this.q12 = this.useFilterExperience(this.queryText_scriptwriterEXP, type);
      } else {
        this.q12 = this.scriptwriters;
      }
    }else if (type == "supportingMaleActor" ) {
      if (this.queryText_supportingMaleActorExp != '' && this.queryText_supportingMaleActorExp != null) {

        this.q13 = this.useFilterExperience(this.queryText_supportingMaleActorExp, type);
      } else {
        this.q13 = this.supportingartistsMale;
      }
    }else if (type == "supportingFemaleActor") {
      if (this.queryText_supportingFemaleActorExp != '' && this.queryText_supportingFemaleActorExp != null) {

        this.q17 = this.useFilterExperience(this.queryText_supportingFemaleActorExp, type);
      } else {
        this.q17 = this.supportingartistsFemale;
      }
    }else if (type == "DUB_M") {
      if (this.queryText_dubbingMaleExp != '' && this.queryText_dubbingMaleExp != null) {

        this.q18 = this.useFilterExperience(this.queryText_dubbingMaleExp, type);
      } else {
        this.q18 = this.dubbingArtistMaleList;
      }
    }else if (type == "DUB_F") {
      if (this.queryText_dubbingFemaleExp != '' && this.queryText_dubbingFemaleExp != null) {

        this.q19 = this.useFilterExperience(this.queryText_dubbingFemaleExp, type);
      } else {
        this.q19 = this.dubbingArtistFemaleList;
      }
    }else if (type == "CHORGR") {
      if (this.queryText_choreographerExp != '' && this.queryText_choreographerExp != null) {

        this.q14 = this.useFilterExperience(this.queryText_choreographerExp, type);
      } else {
        this.q14 = this.choregrprs;
      }
    }else if (type == "EQMT") {
      if (this.queryText_equipmentExp != '' && this.queryText_equipmentExp != null) {

        this.q15 = this.useFilterExperience(this.queryText_equipmentExp, type);
      } else {
        this.q15 = this.equipments;
      }
    }else if (type == "STUD") {
      if (this.queryText_studioExp != '' && this.queryText_studioExp != null) {

        this.q16 = this.useFilterExperience(this.queryText_studioExp, type);
      } else {
        this.q16 = this.studios;
      }
    } 
  }

  //Technician filter by age
  useFilterAge(arg, type) {
    if (type == "supportingMaleActor") {
      return this.supportingartistsMale.filter(item => {
        return item.age == arg ;
      });
    }else if (type == "supportingFemaleActor") {
      return this.supportingartistsFemale.filter(item => {
        return item.age == arg ;
      });
    }
  }
  //Technician filter by experience
  useFilterExperience(arg, type) {
   
     if (type == "DOP") {
      return this.dop.filter(item => { 
        return item.experience == arg;
      });
    }
    if (type == "ETR") {
      return this.editor.filter(item => {
        return item.experience == arg;
      });
    } if (type == "AD") {
      return this.assistantdirectors.filter(item => {
        return item.experience == arg;
      });
    } if (type == "SW") {
      return this.scriptwriters.filter(item => {
        return item.experience == arg;
      });
    } if (type == "supportingMaleActor") {
      return this.supportingartistsMale.filter(item => {
        return item.experience == arg;
      });
    } if (type == "supportingFemaleActor") {
      return this.supportingartistsFemale.filter(item => {
        return item.experience == arg;
      });
    } if (type == "DUB_M") {
      return this.dubbingArtistMaleList.filter(item => {
        return item.experience == arg;
      });
    } if (type == "DUB_F") {
      return this.dubbingArtistFemaleList.filter(item => {
        return item.experience == arg;
      });
    } if (type == "EQMT") {
      return this.equipments.filter(item => {
        return item.experience == arg;
      });
    }  if (type == "STUD") {
      return this.studios.filter(item => {
        return item.experience == arg;
      });
    } if (type == "CHORGR") {
      return this.choregrprs.filter(item => {
        return item.experience == arg;
      });
    }
  }
  radioFocus() {

  }
  radioSelect(obj) {
  }
  radioGroupChange(obj, type) {
    if (type == "2") {
      this.selectedActor = obj.detail.value;
    } else if (type == "1") {
      this.selectedActress = obj.detail.value;
    }else if (type == "3") {
      this.selectedMaleSinger = obj.detail.value;
    }else if (type == "4") {
      this.selectedFemaleSinger = obj.detail.value;
    }
     else if (type == "5") {
      this.selectedMusic = obj.detail.value;
    }else if (type == "6") {
      this.selectedDOP = obj.detail.value;
    }else if (type == "7") {
      this.selectedEditor = obj.detail.value;
    }
    else if (type == "8") {
      this.selectedAssistantDirector = obj.detail.value;
    }
    else if (type == "9") {
      this.selectedScriptWriter = obj.detail.value;
    }
    else if (type == "10") {
      this.selectedSupportMaleActor = obj.detail.value;
    }
    else if (type == "11") {
      this.selectedSupportFemaleActor = obj.detail.value;
    }else if (type == "12") {
      this.selectedChoregpr = obj.detail.value;
    }else if (type == "13") {
      this.selectedequipment = obj.detail.value;
    }else if (type == "14") {
      this.selectedStudio = obj.detail.value;
    }
    else if (type == "15") {
    this.selectedDubbingArtistMale= obj.detail.value;
    }
    else if (type == "16") {
      this.selectedDubbingArtistFemale= obj.detail.value;
      }
  }
  radioBlur() {

  }

  getUserName() {
    this.userData.getUsername().then((username) => {
      //this.ngFireAuth.onAuthStateChanged((obj)=>{
        if(username){
            //this.username = obj.email.split('@')[0];;
            this.username = username;
        }
      });
  }
  async ionViewDidEnter() {
    this.getUserName();
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 2000
    });

    await loading.present();
    this.fireBaseService.readActors().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        docData['storyCount'] = e.payload.doc.data()['associatedStories'].length;
        this.users.push(docData);
      });
       //Actor/Actress/Music director mapping block starts
      if(this.confData.isFromPage!='' && this.confData.isFromPage !='map-technicians'){
      this.q3 = _.filter(this.users, { 'gender': 'M' });
      this.q3 = _.uniqBy(this.q3,'actorName');
      this.q3 = _.orderBy(this.q3, ['experience'], ['desc']);
      this.maleActor = _.filter(this.users, { 'gender': 'M' });
      this.maleActor = _.uniqBy(this.maleActor,'actorName');
      //this.maleActor = _.orderBy(this.maleActor, ['!experience'], ['desc']);
      this.maleActor = _.orderBy(this.maleActor,  [( o ) => { return o.experience || '' }], ['desc']);
      
      
      this.q1 = _.filter(this.users, { 'gender': 'F' });
      this.q1 = _.uniqBy(this.q1,'actorName');
      this.q1 = _.orderBy(this.q1, ['experience'], ['desc']);
      this.femaleActor = _.filter(this.users, { 'gender': 'F' });
      this.femaleActor = _.uniqBy(this.femaleActor,'actorName');
      //this.femaleActor = _.orderBy(this.femaleActor, ['!experience'], ['desc']);
      this.femaleActor = _.orderBy(this.femaleActor, [( o ) => { return o.experience || '' }], ['desc']);
      //Music Director Male
      this.q5 = _.filter(this.users,{ 'userType': 'MD' });//As of now Male,Female required in music director
      this.q5 = _.uniqBy(this.q5,'actorName');
      this.q5 = _.orderBy(this.q5, ['experience'], ['desc']);
      this.musicDirector = _.filter(this.users, { 'userType': 'MD' });
      this.musicDirector = _.uniqBy(this.musicDirector,'actorName');
      //this.musicDirector = _.orderBy(this.musicDirector, ['!experience'], ['desc']);
      this.musicDirector = _.orderBy(this.musicDirector, [( o ) => { return o.experience || '' }], ['desc']);
      //Music Director Female
      this.q6 = _.filter(this.users,{ 'gender': 'Music_F' });
      this.q6 = _.uniqBy(this.q6,'actorName');
      this.q6 = _.orderBy(this.q6, ['experience'], ['desc']);
      this.musicDirectorFemale = _.filter(this.users,{ 'gender': 'Music_F' });
      this.musicDirectorFemale = _.uniqBy(this.musicDirectorFemale,'actorName');
      //this.musicDirectorFemale = _.orderBy(this.musicDirector, ['!experience'], ['desc']);
      this.musicDirectorFemale = _.orderBy(this.musicDirector, [( o ) => { return o.experience || '' }], ['desc']);
      //Singer Male
      this.q7 = _.filter(this.users,{ 'gender': 'Singer_M' });
      this.q7 = _.uniqBy(this.q7,'actorName');
      this.q7 = _.orderBy(this.q7, ['experience'], ['desc']);
      this.maleSinger = _.filter(this.users, { 'gender': 'Singer_M' });
      this.maleSinger = _.uniqBy(this.maleSinger,'actorName');
      //this.maleSinger = _.orderBy(this.maleSinger, ['!experience'], ['desc']);
      this.maleSinger = _.orderBy(this.maleSinger, [( o ) => { return o.experience || '' }], ['desc']);
      //Singer Female
      this.q8 = _.filter(this.users,{ 'gender': 'Singer_F' });
      this.q8 = _.uniqBy(this.q8,'actorName');
      this.q8 = _.orderBy(this.q8, ['experience'], ['desc']);
      this.femaleSinger = _.filter(this.users,{ 'gender': 'Singer_F' });
      this.femaleSinger = _.uniqBy(this.femaleSinger,'actorName');
      //this.femaleSinger = _.orderBy(this.femaleSinger, ['!experience'], ['desc']);
      this.femaleSinger = _.orderBy(this.femaleSinger, [( o ) => { return o.experience || '' }], ['desc']);
      }else{ //Technicians mapping block starts
        this.showActress ='dop';
        //DOP 
      this.q9 = _.filter(this.users,{ 'userType': 'DOP' });
      this.q9 = _.uniqBy(this.q9,'actorName');
      //this.q9 = _.orderBy(this.q9 ['experience'], ['desc']);
      this.dop = _.filter(this.users, { 'userType': 'DOP' });
      this.dop = _.uniqBy(this.dop,'actorName');
      this.dop = _.orderBy(this.dop, ['experience'], ['desc']);
      //Editor
      this.q10 = _.filter(this.users,{ 'userType': 'ETR' });
      this.q10 = _.uniqBy(this.q10,'actorName');
      //this.q10 = _.orderBy(this.q10 ['experience'], ['desc']);
      this.editor = _.filter(this.users, { 'userType': 'ETR' });
      this.editor = _.uniqBy(this.editor,'actorName');
      this.editor = _.orderBy(this.editor, ['experience'], ['desc']);
      
      //AssistantDirectors  
      this.q11 = _.filter(this.users,{ 'userType': 'AD' });
      this.q11 = _.uniqBy(this.q11,'actorName');
      this.assistantdirectors = _.filter(this.users, { 'userType': 'AD' });
      this.assistantdirectors = _.uniqBy(this.assistantdirectors,'actorName');
      this.assistantdirectors = _.orderBy(this.assistantdirectors, ['experience'], ['desc']);

      //ScriptWriters  
      this.q12 = _.filter(this.users,{ 'userType': 'SW' });
      this.q12 = _.uniqBy(this.q12,'actorName');
      this.scriptwriters = _.filter(this.users, { 'userType': 'SW' });
      this.scriptwriters = _.uniqBy(this.scriptwriters,'actorName');
      this.scriptwriters = _.orderBy(this.scriptwriters, ['experience'], ['desc']);

      //Supporting Artists  Male
      this.q13 =_.filter(this.users,{ 'gender': 'SA_M' });
      this.q13 = _.uniqBy(this.q13,'actorName');
      this.supportingartistsMale = _.filter(this.users, { 'gender': 'SA_M' });
      this.supportingartistsMale = _.uniqBy(this.supportingartistsMale,'actorName');
      this.supportingartistsMale = _.orderBy(this.supportingartistsMale, ['experience'], ['desc']);

      //Supporting Artists Female 
      this.q17 = _.filter(this.users,{ 'gender': 'SA_F' });
      this.q17 = _.uniqBy(this.q17,'actorName');
      this.supportingartistsFemale = _.filter(this.users, { 'gender': 'SA_F' });
      this.supportingartistsFemale = _.uniqBy(this.supportingartistsFemale,'actorName');
      this.supportingartistsFemale = _.orderBy(this.supportingartistsFemale, ['experience'], ['desc']);

      //Dubbing Artists Male 
      this.q18 = _.filter(this.users,{ 'gender': 'DUB_M' });
      this.q18 = _.uniqBy(this.q18,'actorName');
      this.dubbingArtistMaleList = _.filter(this.users, { 'gender': 'DUB_M' });
      this.dubbingArtistMaleList = _.uniqBy(this.dubbingArtistMaleList,'actorName');
      this.dubbingArtistMaleList = _.orderBy(this.dubbingArtistMaleList, ['experience'], ['desc']);

      //Dubbing Artists Female 
      this.q19 = _.filter(this.users,{ 'gender': 'DUB_F' });
      this.q19 = _.uniqBy(this.q19,'actorName');
      this.dubbingArtistFemaleList = _.filter(this.users, { 'gender': 'DUB_F' });
      this.dubbingArtistFemaleList = _.uniqBy(this.dubbingArtistFemaleList,'actorName');
      this.dubbingArtistFemaleList = _.orderBy(this.dubbingArtistFemaleList, ['experience'], ['desc']);

      //choregrprs  
      this.q14 = _.filter(this.users,{ 'userType': 'CHORGR' });
      this.q14 = _.uniqBy(this.q14,'actorName');
      this.choregrprs = _.filter(this.users, { 'userType': 'CHORGR' });
      this.choregrprs = _.uniqBy(this.choregrprs,'actorName');
      this.choregrprs = _.orderBy(this.choregrprs, ['experience'], ['desc']);

      //Equipments  
      this.q15 = _.filter(this.users,{ 'userType': 'EQMT' });
      this.q15 = _.uniqBy(this.q15,'actorName');
      this.equipments = _.filter(this.users, { 'userType': 'EQMT' });
      this.equipments = _.uniqBy(this.equipments,'actorName');
      this.equipments = _.orderBy(this.equipments, ['experience'], ['desc']);

       //Studio  
       this.q16 = _.filter(this.users,{ 'userType': 'STUD' });
       this.q16 = _.uniqBy(this.q16,'actorName');
       this.studios = _.filter(this.users, { 'userType': 'STUD' });
       this.studios = _.uniqBy(this.studios,'actorName');
       this.studios = _.orderBy(this.studios, ['experience'], ['desc']);
      }

      loading.onWillDismiss();
    });

  }
  showActorDetails() {
    alert(1);
  }
  checkActorSelected(selectedVal) {
    if (this.selectedActor != "") {      
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Actor ...', 'toast-primary');
      //this.selectedActress="";
      this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkActressSelected(selectedVal) {
    if (this.selectedActress != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Actress ...', 'toast-primary');
      this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkMaleSingerSelected(selectedVal) {
    if (this.selectedMaleSinger != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Male Singer ...', 'toast-primary');
      this.selectedMaleSinger ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkFemaleSingerSelected(selectedVal) {
    if (this.selectedFemaleSinger != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Female Singer ...', 'toast-primary');
      this.selectedFemaleSinger ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkDOPSelected(selectedVal) {
    if (this.selectedDOP != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Cinematography...', 'toast-primary');
      this.selectedDOP ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkEditorSelected(selectedVal) {
    if (this.selectedEditor != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Editor...', 'toast-primary');
      this.selectedEditor ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkAssistantDirectorSelected(selectedVal) {
    if (this.selectedAssistantDirector != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Assistant Director ...', 'toast-primary');
      this.selectedAssistantDirector ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkScriptwriterSelected(selectedVal) {
    if (this.selectedScriptWriter != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Script writer ...', 'toast-primary');
      this.selectedScriptWriter ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkSupportMaleActorSelected(selectedVal) {
    if (this.selectedSupportMaleActor != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Support Male Actor ...', 'toast-primary');
      this.selectedSupportMaleActor ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkSupportFemaleActorSelected(selectedVal) {
    if (this.selectedSupportFemaleActor != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Support Female Actor ...', 'toast-primary');
      this.selectedSupportFemaleActor ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkChoreoprapherSelected(selectedVal){
    if (this.selectedChoregpr != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Choreographer ...', 'toast-primary');
      this.selectedChoregpr ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkDubbingStudioSelected(selectedVal) {
    if (this.selectedStudio != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Dubbing Studio ...', 'toast-primary');
      this.selectedStudio ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkEquipmentSelected(selectedVal) {
    if (this.selectedequipment != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Equipment ...', 'toast-primary');
      this.selectedequipment ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkDubbingArtistMaleSelected(selectedVal) {
    if (this.selectedDubbingArtistMale != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Dubbing Male Artist ...', 'toast-primary');
      this.selectedDubbingArtistMale ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  checkDubbingArtistFemaleSelected(selectedVal) {
    if (this.selectedDubbingArtistFemale != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Dubbing Female Artist ...', 'toast-primary');
      this.selectedDubbingArtistFemale ="";
      //this.selectedActress="";
      //this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }
  skipActorCrew(){
    this.isActorSkipped=true;
    this.showActress = "actress";
  }
  skipActressCrew(){
    this.isActressSkipped=true;
    this.showActress = "maleSinger";
  }
  skipmaleSingerCrew(){
    this.isActressSkipped=true;
    this.showActress = "femaleSinger";
  }
  skipfemaleSingerCrew(){
    this.isActressSkipped=true;
    this.showActress = "music";
  }
  skipDOPCrew(){
    this.isDOPSkipped=true;
    this.showActress = "editor";
  } 
  skipAssitantDirectorCrew(){
    this.isAssistantDirectorSkipped=true;
    this.showActress = "scriptWriter";
  }
  skipEditorCrew(){
    this.isEditorSkipped=true;
    this.showActress = "assistantDirector";
  }
  skipScriptWriterCrew(){
    this.isScriptWriterSkipped=true;
    this.showActress = "supportingMaleActor";
  } 
  skipSupportingMaleActor(){
    this.isSupportingActorMaleSkipped=true;
    this.showActress = "supportingFemaleActor";
  }
  
  skipSupportingFemaleActor(){
    this.isSupportingActorFemaleSkipped=true;
    this.showActress = "dubbingMaleArtist";
  }  
  skipDubbingMaleArtist(){
    this.isDubbingMaleArtistSkipped=true;
    this.showActress = "dubbingFemaleArtist";
  } 
  skipDubbingFemaleArtist(){
    this.isDubbingFemaleArtistSkipped=true;
    this.showActress = "choreographer";
  } 
  skipChoreographer(){
    this.isChoreographerSkipped=true;
    this.showActress = "STUD";
  }   
  /**skipEquipmentCrew(){
    this.isEquipmentSkipped=true;
    this.showActress = "STUD";
  }**/
  skipStudioCrew(){
    this.isStudioskipped=true;
    this.showActress = "EQMT";
  } 
  checkMusicSelected(selectedVal){
    if (this.selectedMusic != "") {
      this.showActress = selectedVal;
    } else {
      this.presentToast('Please select 1 Music Director ...', 'toast-primary');
      this.selectedActress="";
      this.selectedActor="";
      this.selectedMusic="";
      return true;
    }
  }

  ngOnInit(): void {
    this.postData = this.navParams.data.paramID;
    console.table(this.navParams);    
    const slideOpts = {
      slidesPerView: 4,
      coverflowEffect: {
        rotate: 60,
        stretch: 200,
        depth: 20,
        modifier: 1,
        slideShadows: true,
      },

    }
    this.slideOpts = slideOpts;
  }
  async presentToast(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      animated: true,
      cssClass: type,
      position: 'middle',
      duration: 1000,
      buttons: [{
        text: 'Close',
        role: 'cancel'
      }]
    });
    toast.present();
  }
  mapTechniciane(){
    this.isMapped = true;
    this.postData['isAtleastOneMappingDone'] = false;
    this.userData.mappedCrews =[];
    if (this.selectedEditor == "" && this.selectedDOP =="" && this.selectedScriptWriter =="" && this.selectedAssistantDirector =="" &&
        this.selectedSupportMaleActor =="" && this.selectedSupportFemaleActor=="" && this.selectedDubbingArtistFemale ==""  && this.selectedDubbingArtistMale ==""  &&
         this.selectedChoregpr =="" && this.selectedStudio =="" && this.selectedequipment =="") {
      this.presentToast('Please select atleast 1 Technician ...', 'toast-primary');
      this.isMapped = false;
      return true;
    }
      
    this.users.forEach(e => {
       if (this.selectedDOP == e['id']) {
          this.userData.mappedCrews.push('dop'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          this.fireBaseService.filterActorByName(e['actorName']).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.postData['isAtleastOneMappingDone'] =true;
              this.postData['dop']=[];
              this.postData['dop'].push(element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+(element['docs'][0].data().image + '***@@@shirdi&&&saibaba@@@^^^!!!' + this.username+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().mobile));
              this.fireBaseService.updatePost(this.postData['id'], this.postData);
            }
            this.fireBaseService.updateActros(e['id'], e);
          });         
        }
        if (this.selectedEditor == e['id']) {
          this.userData.mappedCrews.push('editor'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          this.fireBaseService.filterActorByName(e['actorName']).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.postData['isAtleastOneMappingDone'] =true;
              this.postData['editor']=[];
              this.postData['editor'].push(element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+(element['docs'][0].data().image + '***@@@shirdi&&&saibaba@@@^^^!!!' + this.username+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().mobile));
              this.fireBaseService.updatePost(this.postData['id'], this.postData);
            }
            this.fireBaseService.updateActros(e['id'], e);
          });
         
        }
        if (this.selectedAssistantDirector == e['id']) {
          this.userData.mappedCrews.push('assistantDirector'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          this.fireBaseService.filterActorByName(e['actorName']).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.postData['isAtleastOneMappingDone'] =true;
              this.postData['assistantDirector']=[];
              this.postData['assistantDirector'].push(element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+(element['docs'][0].data().image + '***@@@shirdi&&&saibaba@@@^^^!!!' + this.username+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().mobile));
              this.fireBaseService.updatePost(this.postData['id'], this.postData);
            }
            this.fireBaseService.updateActros(e['id'], e);
          });
         
        }
        if (this.selectedScriptWriter == e['id']) {
          this.userData.mappedCrews.push('scriptWriter'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          this.fireBaseService.filterActorByName(e['actorName']).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.postData['isAtleastOneMappingDone'] =true;
              this.postData['scriptWriter']=[];
              this.postData['scriptWriter'].push(element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+(element['docs'][0].data().image + '***@@@shirdi&&&saibaba@@@^^^!!!' + this.username+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().mobile));
              this.fireBaseService.updatePost(this.postData['id'], this.postData);
            }
            this.fireBaseService.updateActros(e['id'], e);
          });
         
        }
        if (this.selectedSupportMaleActor == e['id']) {
          this.userData.mappedCrews.push('supportingActorMale'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          this.fireBaseService.filterActorByName(e['actorName']).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.postData['isAtleastOneMappingDone'] =true;
              this.postData['supportingActorMale']=[];
              this.postData['supportingActorMale'].push(element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+(element['docs'][0].data().image + '***@@@shirdi&&&saibaba@@@^^^!!!' + this.username+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().mobile));
              this.fireBaseService.updatePost(this.postData['id'], this.postData);
            }
            this.fireBaseService.updateActros(e['id'], e);
          });
         
        }
        if (this.selectedSupportFemaleActor == e['id']) {
          this.userData.mappedCrews.push('supportingActorFemale'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          this.fireBaseService.filterActorByName(e['actorName']).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.postData['isAtleastOneMappingDone'] =true;
              this.postData['supportingActorFemale']=[];
              this.postData['supportingActorFemale'].push(element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+(element['docs'][0].data().image + '***@@@shirdi&&&saibaba@@@^^^!!!' + this.username+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().mobile));
              this.fireBaseService.updatePost(this.postData['id'], this.postData);
            }
            this.fireBaseService.updateActros(e['id'], e);
          });
         
        }
        if (this.selectedDubbingArtistMale == e['id']) {
          this.userData.mappedCrews.push('dubbingArtistMale'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          this.fireBaseService.filterActorByName(e['actorName']).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.postData['isAtleastOneMappingDone'] =true;
              this.postData['dubbingArtistMale']=[];
              this.postData['dubbingArtistMale'].push(element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+(element['docs'][0].data().image + '***@@@shirdi&&&saibaba@@@^^^!!!' + this.username+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().mobile));
              this.fireBaseService.updatePost(this.postData['id'], this.postData);
            }
            this.fireBaseService.updateActros(e['id'], e);
          });
         
        }
        if (this.selectedDubbingArtistFemale == e['id']) {
          this.userData.mappedCrews.push('dubbingArtistFemale'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          this.fireBaseService.filterActorByName(e['actorName']).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.postData['isAtleastOneMappingDone'] =true;
              this.postData['dubbingArtistFemale']=[];
              this.postData['dubbingArtistFemale'].push(element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+(element['docs'][0].data().image + '***@@@shirdi&&&saibaba@@@^^^!!!' + this.username+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().mobile));
              this.fireBaseService.updatePost(this.postData['id'], this.postData);
            }
            this.fireBaseService.updateActros(e['id'], e);
          });         
        }
        if (this.selectedChoregpr == e['id']) {
          this.userData.mappedCrews.push('choreographer'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          this.fireBaseService.filterActorByName(e['actorName']).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.postData['isAtleastOneMappingDone'] =true;
              this.postData['choreographer']=[];
              this.postData['choreographer'].push(element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+(element['docs'][0].data().image + '***@@@shirdi&&&saibaba@@@^^^!!!' + this.username+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().mobile));
              this.fireBaseService.updatePost(this.postData['id'], this.postData);
            }
            this.fireBaseService.updateActros(e['id'], e);
          });
         
        }
        if (this.selectedStudio == e['id']) {
          this.userData.mappedCrews.push('studio'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          this.fireBaseService.filterActorByName(e['actorName']).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.postData['isAtleastOneMappingDone'] =true;
              this.postData['studio']=[];
              this.postData['studio'].push(element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+(element['docs'][0].data().image + '***@@@shirdi&&&saibaba@@@^^^!!!' + this.username+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().mobile));
              this.fireBaseService.updatePost(this.postData['id'], this.postData);
            }
            this.fireBaseService.updateActros(e['id'], e);
          });
         
        } 
        if (this.selectedequipment == e['id']) {
          this.userData.mappedCrews.push('equipment'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          this.fireBaseService.filterActorByName(e['actorName']).then(element => {
            if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.postData['isAtleastOneMappingDone'] =true;
              this.postData['equipment']=[];
              this.postData['equipment'].push(element['docs'][0].data().actorName+'***@@@shirdi&&&saibaba@@@^^^!!!'+(element['docs'][0].data().image + '***@@@shirdi&&&saibaba@@@^^^!!!' + this.username+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().skills+'***@@@shirdi&&&saibaba@@@^^^!!!'+element['docs'][0].data().mobile));
              this.fireBaseService.updatePost(this.postData['id'], this.postData);
            }
            this.fireBaseService.updateActros(e['id'], e);
          });
         
        }
        
      });
      
       setTimeout(() => {
        this.fireBaseService.updatePost(this.postData['id'], this.postData);
        this.closeModal();
        this.presentToast("Your choice(s) are saved","toast-success");
        this.router.navigateByUrl('/app/tabs/about');
       // this.closeModal();
      }, 200);
    
    /**if (this.q2 && this.q2.length === 2) {
      this.q2.forEach(e => {
        e['associatedStories'].push(this.postData['id']);
        this.fireBaseService.updateActros(e['id'], e);
        if (e['gender'] === 'M') {
          this.postData['actors'].push(e['id'] + '_' + this.username);
        } else if (e['gender'] === 'F') {
          this.postData['actress'].push(e['id'] + '_' + this.username);
        }
      });
      setTimeout(() => {
        this.fireBaseService.updatePost(this.postData['id'], this.postData);
        this.closeModal();
        this.isActressSkipped=false;
        this.isActorSkipped=false;
      }, 200);
    } */

  }
  mapActors() {
    if (this.selectedActor == "" && this.selectedActress =="" && this.selectedMusic =="" && this.selectedFemaleSinger =="" && this.selectedMaleSinger =="")  {
      this.presentToast('Please select atleast 1 Cast ...', 'toast-primary');
      this.isMapped = false;
      return true;
    }
    this.isMapped = true;
    this.userData.mappedCrews =[];
    /**if (this.selectedMusic == "") {
      this.presentToast('Please select 1 Music Director ...', 'toast-primary');
      this.isMapped = false;
      return true;
    } */
      
   /** if (this.selectedActress == "" && (this.isActorSkipped==true && this.isActressSkipped==true)) {
      this.presentToast('Please select  Actress...', 'toast-primary');
      this.isMapped = false;
      return true;
    } else {*/
      this.users.forEach(e => {
        if (this.selectedActor == e['id']) {
          this.userData.mappedCrews.push('actor'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
        if(this.postData['actors'] !== undefined && this.postData['actors'].length > 0) { 
                    const index: number = this.postData['actors'].indexOf(e['id']+"_"+this.username);
                    if(index == 0 || (this.postData['actors'].some(s => s.includes(this.username)))){
                          this.postData['actors'].forEach(e1 =>{ 
                            if(e1.split('_')[1] == this.username){  
                              const index1: number = this.postData['actors'].indexOf(e1);
                                  if(index1 !== -1){
                                this.postData['actors'].splice(index1, 1);
                                this.postData['actors'].push(e['id']+"_"+this.username); 
                                  }                   
                            }
                          }); 
                    }else{
                      this.postData['actors'].push(e['id'] + '_' + this.username);
                  }
        }else{
            this.postData['actors'] = [];
            this.postData['actors'].push(e['id'] + '_' + this.username);
        }         
          this.fireBaseService.updateActros(e['id'], e);
        }
        if (this.selectedActress == e['id']) {
         this.userData.mappedCrews.push('actress'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
         e['associatedStories'].push(this.postData['id']);          
        if(this.postData['actress'] !== undefined && this.postData['actress'].length > 0 ) {
                const index = this.postData['actress'].indexOf(e['id']+"_"+this.username);                
                if(index == 0 || (this.postData['actress'].some(s => s.includes(this.username)))){
                              this.postData['actress'].forEach(e1 =>{
                                if(e1.split('_')[1] == this.username){
                                  const index1: number = this.postData['actress'].indexOf(e1);
                                  if(index1 !== -1){
                                    this.postData['actress'].splice(index1, 1);
                                    this.postData['actress'].push(e['id']+"_"+this.username);
                                  }
                                } 
                              }); 
                      }else{
                      this.postData['actress'].push(e['id'] + '_' + this.username);
                  }
        }else{
             this.postData['actress'] = [];
             this.postData['actress'].push(e['id'] + '_' + this.username);          
        }         
          this.fireBaseService.updateActros(e['id'], e);
        }
        if(this.selectedMusic == e['id']){
          this.userData.mappedCrews.push('musicdirector'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          if(this.postData['music'] !== undefined && this.postData['music'].length > 0) { 
            const index = this.postData['music'].indexOf(e['id']+"_"+this.username); 
            if(index == 0 || (this.postData['music'].some(s => s.includes(this.username)))){
                  this.postData['music'].forEach(e1 =>{
                    if(e1.split('_')[1] == this.username){
                      const index1: number = this.postData['music'].indexOf(e1);
                                  if(index1 !== -1){
                        this.postData['music'].splice(index1, 1);
                        this.postData['music'].push(e['id']+"_"+this.username); 
                                  }
                    } 
                  }); 
              }else{
                this.postData['music'].push(e['id'] + '_' + this.username);
              }  
          }else{
              this.postData['music'] = [];
              this.postData['music'].push(e['id'] + '_' + this.username);
          }         
            this.fireBaseService.updateActros(e['id'], e);
        }
        if(this.selectedMaleSinger == e['id']){
          this.userData.mappedCrews.push('maleSinger'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
         if(this.postData['maleSinger'] !== undefined && this.postData['maleSinger'].length > 0 ) { 
          const index = this.postData['maleSinger'].indexOf(e['id']+"_"+this.username); 
          if(index == 0 || (this.postData['maleSinger'].some(s => s.includes(this.username)))){
                  this.postData['maleSinger'].forEach(e1 =>{
                    if(e1.split('_')[1] == this.username){
                      const index1: number = this.postData['maleSinger'].indexOf(e1);
                                  if(index1 !== -1){
                        this.postData['maleSinger'].splice(index1, 1);
                        this.postData['maleSinger'].push(e['id']+"_"+this.username);
                                  }
                       }
                  }); 
                }else{
                  this.postData['maleSinger'].push(e['id'] + '_' + this.username);
                }   
          }else{
            this.postData['maleSinger'] = [];
             this.postData['maleSinger'].push(e['id'] + '_' + this.username);            
          }         
            this.fireBaseService.updateActros(e['id'], e);
          
        }
        if(this.selectedFemaleSinger == e['id']){
          this.userData.mappedCrews.push('femaleSinger'+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['actorName']+'***@@@shirdi&&&saibaba@@@^^^!!!'+e['image']);
          e['associatedStories'].push(this.postData['id']);
          if(this.postData['femaleSinger'] !== undefined && this.postData['femaleSinger'].length > 0 ) { 
            const index = this.postData['femaleSinger'].indexOf(e['id']+"_"+this.username); 
            if(index == 0 || (this.postData['femaleSinger'].some(s => s.includes(this.username)))){ 
                this.postData['femaleSinger'].forEach(e1 =>{
                    if(e1.split('_')[1] == this.username){ 
                      const index1: number = this.postData['femaleSinger'].indexOf(e1);
                                  if(index1 !== -1){                     
                        this.postData['femaleSinger'].splice(index1, 1);
                        this.postData['femaleSinger'].push(e['id']+"_"+this.username);
                                  } 
                    }
                  });
              }else{
                this.postData['femaleSinger'].push(e['id'] + '_' + this.username);
              } 
          }else{
            this.postData['femaleSinger'] = [];
             this.postData['femaleSinger'].push(e['id'] + '_' + this.username);          
          }         
            this.fireBaseService.updateActros(e['id'], e);
        }
 
      });
      
      setTimeout(() => {
        this.fireBaseService.updatePost(this.postData['id'], this.postData);
        this.closeModal();
      }, 200);
    //}

    if (this.q2 && this.q2.length === 2) {
      this.q2.forEach(e => {
        e['associatedStories'].push(this.postData['id']);
        this.fireBaseService.updateActros(e['id'], e);
        if (e['gender'] === 'M') {
          this.postData['actors'].push(e['id'] + '_' + this.username);
        } else if (e['gender'] === 'F') {
          this.postData['actress'].push(e['id'] + '_' + this.username);
        }
      });
      setTimeout(() => {
        this.fireBaseService.updatePost(this.postData['id'], this.postData);
        this.closeModal();
        this.isActressSkipped=false;
        this.isActorSkipped=false;
      }, 200);


    }
  }
  addTodo() {
    switch (this.selectedQuadrant) {
      case 'q1':
        this.todo.color = 'primary';
        break;
      case 'q2':
        this.todo.color = 'secondary';
        break;
      case 'q3':
        this.todo.color = 'tertiary';
        break;
      case 'q4':
        this.todo.color = 'warning';
        break;
      case 'q4':
        this.todo.color = 'danger';
        break;
        
    }
    this[this.selectedQuadrant].push(this.todo);
    this.todo = { value: '', color: '' };
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(this.postData);
  }
  closeModal2() {
    const onClosedData: string = "Wrapped Up!";
    this.modalController.dismiss(null);
  }
  dismiss(data?: any) {    
    this.modalController.dismiss(data);
  }
  actorModalpopup(eachObj){
    this.fireBaseService.filterActorByName(eachObj.actorName).then(async element => {
      if(!(_.isEmpty(element['docs'][0].data().actorName))){
              this.confData.actorData = element['docs'][0].data();
              //this.router.navigateByUrl('actordetails-popup');
              const modal = await this.modalController.create({
                component: ActordetailsPopupPage,
                componentProps: {
                  "paramID": this.confData.actorData,
                  "paramTitle": "Test Title"
                }
              });
              modal.onDidDismiss().then((dataReturned) => {
                if (dataReturned !== null) {
                  
                }
              });
              return await modal.present();
             // this.dismiss(this.confData);
           } 
      });

   /** this.mediaFile ="";
    this.profile ="";
    this.forWardisplay ='none';
    this.popup=true;
    this.popupActorName = eachObj.actorName.charAt(0).toUpperCase()+eachObj.actorName.slice(1);
    this.popupActorSkills = eachObj.skills;
    this.mappedCount = eachObj.associatedStories.length;
    this.mediaFile = eachObj.mediaFile;
    this.safeURLs = [];
    eachObj.profilesArray.forEach( (element) => {
      let profile=element?element.split('=')[1]:element;
      console.log("each profile::",profile); 
      this.safeURLs.push(this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+profile));
  }); 
  console.log("this.safeURLs::",this.safeURLs);*/
    //this.profile= eachObj.profiles?eachObj.profiles.split('=')[1]:eachObj.profiles;
    //this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+this.profile);
    }
  /** actorModalClosepopup(){   
    this.forWardisplay =''; 
    this.popup=false;
    this.popupActorName = "";
    this.popupActorSkills = "";
  } */

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

next() {
  this.ionSlides.slideNext();
}

prev() {
  this.ionSlides.slidePrev();
}

}