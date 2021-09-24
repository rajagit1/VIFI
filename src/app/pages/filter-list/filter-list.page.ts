import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, IonReorderGroup, ToastController, LoadingController,ActionSheetController } from '@ionic/angular';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { FireBaseService } from '../../services/firebase.service';
import { UserdetailschildPopupPage } from '../userdetailschild-popup/userdetailschild-popup.page';
import * as _ from "lodash";
import { FilterActordetailsPage } from '../filter-actordetails/filter-actordetails.page';
@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.page.html',
  styleUrls: ['./filter-list.page.scss'],
})
export class FilterListPage implements OnInit {

  filteredValues:any;
  filterList:any;
  isActor:boolean = false;
  q1= [

  ];
  queryText_age:string = "";
  queryText_experience:string="";
  queryText_Name:string="";
  queryText_Color:string="";
  queryText_Height:string="";
  queryText_Weight:string="";
  queryText_paidOption:string="";
  queryText_Language:string="";
  noRecords={title:"No Records Found",image:''};
  constructor(private navParams: NavParams,public modalCtrl: ModalController,
    private toastCtrl: ToastController,private confData: ConferenceData,private fireBaseService: FireBaseService,public userData: UserData,) { }

  ngOnInit() {
    
    this.filterList = this.navParams.data.paramID;
    if(this.filterList[0].userType == 'A'){
      this.isActor =true;
    }
    this.q1 = this.filterList;
  }
  dismiss(data?: any) {    
    this.isActor = false;
    this.modalCtrl.dismiss(data);
  }
  
  setFilteredItemsExperience() {    
      if (this.queryText_experience !== "") {
       let noRecObj = [];
       noRecObj.push({"noRec":"No Records Found"});
       this.q1 = this.useExperienceFilter(this.queryText_experience);       
       this.q1 = this.q1.length == 0 ? noRecObj  : this.q1; 
      }else{
        this.q1 = this.filterList ;
       
      } 
  }
  setFilteredItemsAge() {    
    if (this.queryText_age !== "") {
      let noRecObj = [];
      noRecObj.push({"noRec":"No Records Found"});
      this.q1 = this.useAgeFilter(this.queryText_age);  
      this.q1 = this.q1.length == 0 ? noRecObj  : this.q1;      
     }else{
      this.q1 = this.filterList ;      
    } 
    
}
setFilteredItemsName() {    
  if (this.queryText_Name !== "") {
    let noRecObj = [];
    noRecObj.push({"noRec":"No Records Found"});
    this.q1 = this.useNameFilter(this.queryText_Name);       
    this.q1 = this.q1.length == 0 ? noRecObj  : this.q1;   
  }else{
    this.q1 = this.filterList ;
   
  } 
}
setFilteredItemsColor() {    
  if (this.queryText_Color !== "") {
    let noRecObj = [];
    noRecObj.push({"noRec":"No Records Found"});
    this.q1 = this.useColorFilter(this.queryText_Color);       
    this.q1 = this.q1.length == 0 ? noRecObj  : this.q1; 
  }else{
    this.q1 = this.filterList ;
   
  } 
}
setFilteredItemsHeight() {    
  if (this.queryText_Height !== "") {
    let noRecObj = [];
    noRecObj.push({"noRec":"No Records Found"});
    this.q1 = this.useHeightFilter(this.queryText_Height);       
    this.q1 = this.q1.length == 0 ? noRecObj  : this.q1; 
  }else{
    this.q1 = this.filterList ;
   
  } 
}
setFilteredItemsWeight() {    
  if (this.queryText_Weight !== "") {
    let noRecObj = [];
    noRecObj.push({"noRec":"No Records Found"});
    this.q1 = this.useWeightFilter(this.queryText_Weight);       
    this.q1 = this.q1.length == 0 ? noRecObj  : this.q1; 
  }else{
    this.q1 = this.filterList ;
   
  } 
}
setFilteredItemspaidOption() {    
  if (this.queryText_paidOption !== "") {
    let noRecObj = [];
    noRecObj.push({"noRec":"No Records Found"});
    this.q1 = this.usePaidOptionFilter(this.queryText_paidOption);       
    this.q1 = this.q1.length == 0 ? noRecObj  : this.q1; 
  }else{
    this.q1 = this.filterList ;
   
  } 
}
setFilteredItemsLanguage() {    
  if (this.queryText_Language !== "") {
    let noRecObj = [];
    noRecObj.push({"noRec":"No Records Found"});
    this.q1 = this.uselanguageFilter(this.queryText_Language);       
    this.q1 = this.q1.length == 0 ? noRecObj  : this.q1; 
  }else{
    this.q1 = this.filterList ;
   
  } 
}
  useAgeFilter(arg) {
   
    let list:any = [];
    list = this.filterList.filter(item => {     
      return item.age == arg;
    });
    return list;
  }
  useExperienceFilter(arg) {
    let list:any = [];
    list = this.filterList.filter(item => {     
      return item.experience == arg;
    });
    return list;
   /** return this.filterList.filter(item => {
      return item.experience == arg;
    }); */
  }
  useNameFilter(arg) {
    let list:any = [];
    list = this.filterList.filter(item => {     
      return item.displayName == arg;
    });
    return list;
    /** return this.filterList.filter(item => {
      return item.displayName == arg;
    }); */
  }
  useColorFilter(arg) {
    let list:any = [];
    list = this.filterList.filter(item => {     
      return item.color == arg;
    });
    return list;
    /** return this.filterList.filter(item => {
      return item.color == arg;
    }); */
  }
  useHeightFilter(arg) {
    let list:any = [];
    list = this.filterList.filter(item => {     
      return item.height == arg;
    });
    return list;
    /** return this.filterList.filter(item => {
      return item.height == arg;
    }); */
  }
  useWeightFilter(arg) {
    let list:any = [];
    list = this.filterList.filter(item => {     
      return item.weight == arg;
    });
    return list;
    /** return this.filterList.filter(item => {
      return item.weight == arg;
    }); */
  }
  usePaidOptionFilter(arg) {
    let list:any = [];
    list = this.filterList.filter(item => {     
      return item.paidOption == arg;
    });
    return list;
    /** return this.filterList.filter(item => {
      return item.paidOption == arg;
    }); */
  }
  uselanguageFilter(arg) {
    let list:any = [];
    list = this.filterList.filter(item => {     
      return item.language == arg;
    });
    return list;
    /** return this.filterList.filter(item => {
      return item.language == arg;
    }); */
  }
  paidOptionChange(obj){
    if(obj.target.value !== 'Select Paid Option'){
    this.queryText_paidOption = obj.target.value;
    this.setFilteredItemspaidOption();
    }else{
      this.queryText_paidOption = "";
      this.setFilteredItemspaidOption();
    }
  }
  languageChange(obj){
    if(obj.target.value !== 'Select Language'){
      this.queryText_Language = obj.target.value;
      this.setFilteredItemsLanguage();
      }else{
        this.queryText_Language = "";
        this.setFilteredItemsLanguage();
      }
  }
  colorChange(obj){
    if(obj.target.value !== 'Select Color'){
      this.queryText_Color = obj.target.value;
      this.setFilteredItemsColor();
      }else{
        this.queryText_Color = "";
        this.setFilteredItemsLanguage();
      }
  }
  async showActorDetailsPopup(actorName){
 
      this.fireBaseService.filterActorByName(actorName).then(async element => {
        if(!(_.isEmpty(element['docs'][0].data().actorName))){
                this.confData.actorData = element['docs'][0].data();
                //this.router.navigateByUrl('actordetails-popup');
                const modal = await this.modalCtrl.create({
                  component: FilterActordetailsPage,
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
    } 
    async presentToast(msg, type) {
      const toast = await this.toastCtrl.create({
        message: msg,
        animated: true,
        cssClass: type,
        position: 'middle',
        duration: 500
      });
      toast.present();
    }
    clear(){
      this.queryText_age= "";
      this.queryText_experience="";
      this.queryText_Name="";
      this.queryText_Color="";
      this.queryText_Height="";
      this.queryText_Weight="";
      this.queryText_paidOption="";
      this.queryText_Language="";
    }
}
