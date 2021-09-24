import { Injectable } from '@angular/core';
import { User, Post, Actor } from '../interfaces/user-options';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { AngularFireStorageModule, AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  userList: AngularFireList<any>;
  userData;
 whatsAppNoRequestDetails :any =[];
  user: AngularFireObject<any>;
  posts: AngularFireObject<any>;
  childEvents = new Subject();
  postData: any = {};
  playersRef = this.db.database.ref("users/");
  postRef = this.db.database.ref("posts/");
  actorRef = this.db.database.ref("actors/");
  whatsappRef = this.db.database.ref("whatsapp/");
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  actorData: any = {};
  constructor(private db: AngularFireDatabase, private firestore: AngularFirestore,
    private toastCtrl: ToastController, private afStorage: AngularFireStorage,public ngFireAuth: AngularFireAuth) {



  }
  getwhatsAppNumber(userName){
    return new Promise((resolve,reject) => {
      this.ngFireAuth.currentUser.then(user => {
        this.firestore.collection("users").ref.where("userName","==",userName).limit(1).get().then(snap =>
          {
            if(snap.docs[0]) {
              resolve(snap.docs[0].data())
            }else{
              reject({message: "User not found"})
            }
          }).catch((err) => {
            reject(err);
          })
      }).catch((err) => {
        reject(err);
      })
    })
  }
  getCurrentUser(){
    return new Promise((resolve,reject) => {
      this.ngFireAuth.currentUser.then(user => {
        this.firestore.collection("users").ref.where("uid","==",user.uid).limit(1).get().then(snap =>
          {
            if(snap.docs[0]) {
              resolve(snap.docs[0].data())
            }else{
              reject({message: "User not found"})
            }
          }).catch((err) => {
            reject(err);
          })
      }).catch((err) => {
        reject(err);
      })
    })
  }
  signInFireAuth(email,password){
     //preventDefault();
      this.ngFireAuth.signInWithEmailAndPassword(email, password).then(()=>{
      console.log('logged in:');
      //return user;
     }).catch(error => {
         console.log("signin error:::",error);
         return error;
     });
    }
  registerUser(email, password) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }
  upload(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
  }
  createPost(record) {
    return this.firestore.collection('posts').add(record);
  }
  readAdsUnit(){ 
    return this.firestore.collection('adsUnit').snapshotChanges();
  }
  createActorComment(record) {
    return this.firestore.collection('actorComments').add(record);
  }
  createNotify(record) {
    return this.firestore.collection('notify').add(record);
  }
  readNoify() {
    return this.firestore.collection('notify').snapshotChanges();
  }
  readwhatsAppApproveNoify(){
    return this.firestore.collection('whatsapp').snapshotChanges();
  }
  updateAdsUnit(recordID,record){ 
    return this.firestore.doc('adsUnit/' + recordID).update(record);
  }
  updateNoify(recordID,record){
    this.firestore.doc('notify/' + recordID).update(record);
  }
  addOrupdateActivityComment(record){
    this.firestore.doc('activities/' + record.id).update(record);
  }
  addLikesForActorProfile(record){
    this.firestore.doc('actors/' + record.id).update(record);
  }
  trackVisitors(id,record){
    this.firestore.doc('actors/' + id).update(record);
  }
  deletePost(postId) {
    this.firestore.doc('posts/' + postId).delete();
  }
  readPosts() {
    return this.firestore.collection('posts').snapshotChanges();
  }
  readActivities(){
    return this.firestore.collection('activities').snapshotChanges();
  }

  updatePost(recordID, record) {
    this.firestore.doc('posts/' + recordID).update(record);
  }
  updateVifiNotify(recordID, record) {
    this.firestore.doc('vifiNotify/' + recordID).update(record);
  }
  updateYoutubeLink(recordID, record) {
    this.firestore.doc('actors/' + recordID).update(record);
  }
  createActors(record) {
    return this.firestore.collection('actors').add(record);
  }
  createUsers(record) {
    return this.firestore.collection('users').add(record);
  }
 
  whatsAppNoRequest(record){
    return this.firestore.collection('whatsapp').add(record);
  }
  readUsers(){

    return this.firestore.collection('users').snapshotChanges();
  }
  readSpecificUsers(docid){

    return this.firestore.collection('actors').doc(docid).snapshotChanges();
  }
 
  WhatappNoNotifyByDocId(docid){
    return this.firestore.collection('whatsapp', ref =>
    ref.where('actorDocId', '==', docid).where('status', '==', 'P').orderBy('updateOn','desc')
    );
  }
  getRequestDetails(userName){
    
    return this.firestore.collection('whatsapp', ref =>
    ref.where('actorName', '==', userName)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data:any = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  } 
  getWhatappNoRequestedDetails(userName){
    
    return this.firestore.collection('whatsapp', ref =>
    ref.where('requestedUserEmail', '==', userName)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data:any = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  } 
  updateWhatsAppNotifiedStatus(docid,notifiedObj){     
    this.firestore.doc('whatsapp/' + docid).update(notifiedObj);
  }
  updateWhatsAppNoStatus(docid,status){
    this.firestore.doc('whatsapp/' + docid).update({status:status,updateOn: moment().format('YYYY-MM-DD hh:mm:ss A').toString()});
  }
  getApprovedWhatappNo(usermail){    
    return this.firestore.collection('whatsapp', ref =>
    ref.where('requestedUserEmail', '==', usermail).where('status', '==', 'A').where('notify_status', '==', 'A').orderBy('updateOn','desc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data:any = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  } 
  filterUsers(userName) {
 
    return this.firestore.collection('users', ref =>
      ref.where('userName', '==', userName)
    );
  }
  filterPosts(storycreator) {
 
    return this.firestore.collection('posts', ref =>
      ref.where('uploadedBy', '==', storycreator)
    );
  }
  listOfApproveRejectStories(userName) { 
    return this.firestore.collection('posts', ref =>
      ref.where('uploadedBy', '==', userName)
    );
  }
  getUserByMailid(mailid:string){
    return this.firestore.collection('users', ref =>
    ref.where('emailId', '==', mailid)
    );
  }
  filterPostByActorName(actorName){
    return new Promise((resolve,reject) => {
      this.ngFireAuth.currentUser.then(user => {
        this.firestore.collection("posts").ref.where("uploadedBy","==",actorName).get().then(snap =>
          {
            if(snap.docs[0]) {
              resolve(snap)
            }else{
              reject({message: "User Not Found"})
            }
          }).catch((err) => {
            reject(err);
          })
      }).catch((err) => {
        reject(err);
      })
    })
  }
  readCommentsActors(actorId){
    return new Promise((resolve,reject) => {
      this.ngFireAuth.currentUser.then(user => {
        this.firestore.collection("actorComments").ref.where("actorId","==",actorId).get().then(snap =>
          {
            if(snap.docs[0]) {
              resolve(snap)
            }else{
              reject({message: "User Not Found"})
            }
          }).catch((err) => {
            reject(err);
          })
      }).catch((err) => {
        reject(err);
      })
    })
  }
  filterActors(userName){
 
    return this.firestore.collection('actors', ref =>    
      ref.where('actorName', '==', userName)
 
    );
  }
  filterActorByName(name){
    console.log("name from fibase:::",name);
    return new Promise((resolve,reject) => {
     // this.ngFireAuth.currentUser.then(user => {
        this.firestore.collection("actors").ref.where("actorName","==",name).limit(1).get().then(snap =>
          {
            if(snap.docs[0]) {
              resolve(snap)
            }else{
              reject({message: "User Not Found"})
            }
          }).catch((err) => {
            reject(err);
          })
      /** }).catch((err) => {
        reject(err);
      })*/
    })
  }
  filterActorById(id){
    return new Promise((resolve,reject) => {
      this.ngFireAuth.currentUser.then(user => {
        this.firestore.collection("actors").ref.where("id","==",id).limit(1).get().then(snap =>
          {
            if(snap.docs[0]) {
              resolve(snap)
            }else{
              reject({message: "User Not Found"})
            }
          }).catch((err) => {
            reject(err);
          })
      }).catch((err) => {
        reject(err);
      })
    })
  }
  readActors() {
    return this.firestore.collection('actors').snapshotChanges();
  }
  readActorsProfileComments() {
    return this.firestore.collection('actorComments').snapshotChanges();
  }
  updateActros(recordID, record) {
    this.firestore.doc('actors/' + recordID).update(record);
  }
  
  createActor(actor: Actor) {
    this.actorRef = this.db.database.ref("actors/");

    return this.actorRef.push({
      actorName: actor.actorName,
      gender: actor.gender,
      mobile: actor.mobile,
      skills: actor.skills,
      profiles: actor.profiles,
      image: actor.image,
      createdOn: actor.createdOn,
      associatedStories: actor.associatedStories,
      id: Math.floor((Math.random() * 100000000) + 1),
    })
  }
  uploadFile(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
  }
  createTicket(record) {
    return this.firestore.collection('ticketnumber').add(record);
  }
  filterTicket(userName) {
    return this.firestore.collection('ticketnumber', ref =>
      ref.where('updatedBy', '==', userName)
    );
  }
  
  // Create
  createUser(apt: User) {
    this.playersRef = this.db.database.ref("users/");

    return this.playersRef.push({
      userName: apt.userName,
      emailId: apt.emailId,
      password: apt.password,
      userFlag: apt.userFlag,
      id: Math.floor((Math.random() * 100000000) + 1),
    })
  }


  // Get Single
  getSelectedUsers(id: string) {
    this.user = this.db.object('/users/' + id);

    return this.user;
  }
  // Get Single
  getSelectedPost(id: string) {
    this.posts = this.db.object('/posts/' + id);

    return this.user;
  }
  fetchPost() {

    var postRef = this.db.database.ref("/posts");


    return postRef;
  }
  read_Students() {
    return this.firestore.collection('Students').snapshotChanges();
  }
  create_NewStudent(record) {
    return this.firestore.collection('Students').add(record);
  }

  // Get List
  getUserList() {
    this.userList = this.db.list('/users');
    return this.userList;
  }

  // Update
  updateBooking(id, apt: User) {
    return this.user.update({
      userName: apt.userName,
      emailId: apt.emailId,
      password: apt.password,
    })
  }

  // Delete
  deleteBooking(id: string) {
    this.user = this.db.object('/users/' + id);
    this.user.remove();
  } 
  //Get ViFi notification to send global message to all
  getVifiNotifications(){
    return this.firestore.collection('vifiNotify').snapshotChanges();
  }
  createVifiNotifications(record) {
    return this.firestore.collection('vifiNotify').add(record);
  }
  deleteVifiNotify(recordId) {
    this.firestore.doc('vifiNotify/' + recordId).delete();
    return;
  }
  updateSynopsis(docid,obj){ 
    this.firestore.doc('posts/' + docid).update(obj);
  }
  updateAdManagement(docid,obj){ 
    this.firestore.doc('adManagement/' + docid).update(obj);
  }
  createSubscription(subscription){
    //this.firestore.doc('storySubscription/').update(subscription);
    return this.firestore.collection('storySubscription/').add(subscription);
  }
  readAdManagement(){ 
    return this.firestore.collection('adManagement').snapshotChanges();
  }
  createActivity(activityObj){
    return this.firestore.collection('activities/').add(activityObj);
  }
  updateSubscription(docid,subscription){ 
    this.firestore.doc('storySubscription/' + docid).update(subscription);
   //return this.firestore.collection('storySubscription/').add(subscription);
  }
  filterSubscription(title){
    return this.firestore.collection('storySubscription', ref =>
    ref.where('storyTitle', '==', title)
  );
  }

  filterSubscription1(title){
    return new Promise((resolve,reject) => {
      this.ngFireAuth.currentUser.then(user => {
        this.firestore.collection("storySubscription").ref.where("storyTitle","==",title).limit(1).get().then(snap =>
          {
            if(snap.docs[0]) {
              resolve(snap)
            }else{
              reject({message: "Title not found"})
            }
          }).catch((err) => {
            reject(err);
          })
      }).catch((err) => {
        reject(err);
      })
    })
  }

  getUsersCount(){
      return this.firestore.collection('users').snapshotChanges();
    }   
}
