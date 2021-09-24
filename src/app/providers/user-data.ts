import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class UserData {
  favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  currentLoggedInUser;
  email:string="";
  userType:string="";
  userName: any;
  mappedCrews:string[]=[];
  actor_img: string="";
  actoress_img: string="";
  musicDir_img:string="";
  isCertified:boolean=false;
  isVifi:boolean=false;
  userMob: any;
  isFromAbout: boolean=false;
  isFromSpeakerListPage:boolean=false;
  fromSpeakerListData:{};
  aboutData: {};
  profilecompletionPercentage:number=0;
  constructor(
    public storage: Storage
  ) { }

  hasFavorite(sessionName: string): boolean {
    return (this.favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    this.favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this.favorites.indexOf(sessionName);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }

  login(username: string,role:string,isCertified:boolean,isVifi:boolean): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      this.setIsVifi(isVifi);
      this.setIsCertified(isCertified);
      this.storage.set('role', role);
      return window.dispatchEvent(new CustomEvent('user:login'));
    });
  }

  signup(username: string): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);      
      return window.dispatchEvent(new CustomEvent('user:signup'));
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      this.storage.remove('username');
      this.storage.remove('role');
      this.storage.remove('isCertified');
      return; 
    }).then(() => {
      window.dispatchEvent(new CustomEvent('user:logout'));
    });
  }  
  setDisplayName(username: string): Promise<any> {
    return this.storage.set('displayName', username);
  }
  setUsername(username: string): Promise<any> {
    return this.storage.set('username', username);
  }
  getDisplayName(): Promise<string> {
    return this.storage.get('displayName').then((value) => {
      return value;
    });
  }
  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }
  getRole(): Promise<string> {
    return this.storage.get('role').then((value) => {
      return value;
    });    
  }
  setIsCertified(isCertified: boolean): Promise<any> {
    return this.storage.set('isCertified', isCertified);
  }
  getIsCertified(): Promise<boolean> {
    return this.storage.get('isCertified').then((value) => {
      return value;
    });
  }
  setIsVifi(isVifi: boolean): Promise<any> {
    return this.storage.set('isVifi', isVifi);
  }
  getIsVifi(): Promise<boolean> {
    return this.storage.get('isVifi').then((value) => {
      return value;
    });
  }
  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }
}
