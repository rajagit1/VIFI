
export interface UserOptions {
  username: string;
  password: string;
}
export class User {
  userName: string;
  password: string;
  emailId:string;
  userFlag:string;
  id:string;
}
export class Ticket{
  storyId:string;
  ticketId:string;
  updatedBy:string;
  updatedOn:string;
}
export class Actor {
  actorName: string;
  id:string;
  gender: string;
  mobile:string;
  skills:string;
  profiles:string;
  image:string;
  associatedStories:number;
  createdOn:string;

}
export class Post{
  $key: string;
  synopsis:string;
  id:string;
  title:string;
  generType:string;
  uploadedBy:string;
  uploadedOn:string;
  image:string;
  budget:string;
  storyId:string;
  comments:[];
  likes:[];
  views:number;
}

