import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';
const routes: Routes = [
   
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
  },
  
  {
    path: 'signUp',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'vifi',
    loadChildren: () => import('./vifi/vifi.module').then(m => m.VifiNotifyPageModule)
  },
  {
    path: 'mapTechnicians',
    loadChildren: () => import('./pages/map-technicians/map-technicians.module').then(m => m.MapTechniciansPageModule)
  },
  { // Here I changes the forgot password page path
    path: 'forgot-password',
    loadChildren: () => import('./pages/signup/forgotpass-pageModule').then( m => m.ForgotPasswordModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
 
  {
    path: 'app/tabs/create-post',
    loadChildren: () => import('./pages/create-post/create-post.module').then( m => m.CreatePostPageModule),
    // canLoad: [CheckUser]
  },
  {
    path: 'app/tabs/decision',
    loadChildren: () => import('./pages/decision/decision.module').then( m => m.DecisionPageModule)
  },
  {
    path:'apps/tabs/schdule',
    loadChildren: () => import('./pages/schedule/schedule.module').then( m => m.ScheduleModule)  
  },
  {
    path: 'create-actor',
    loadChildren: () => import('./pages/create-actor/create-actor.module').then( m => m.CreateActorPageModule)
  },
  {
    path: 'actor-add',
    loadChildren: () => import('./modals/actor-add/actor-add.module').then( m => m.ActorAddPageModule)
  },
  {
    path: 'activity-comment',
    loadChildren: () => import('./pages/activity-comments/activity-comments.module').then( m => m.ActivityCommentsPageModule)
  },
  {
    path: 'technician-details',
    loadChildren: () => import('./modals/technician-details/technician-details.module').then( m => m.TechnicianDetailsPageModule)
  },
  {
    path: 'crew-details',
    loadChildren: () => import('./modals/crew-details/crew-details.module').then( m => m.CrewDetailsPageModule)
  },
  {
    path: 'actor-details',
    loadChildren: () => import('./pages/actor-details/actor-details.module').then( m => m.ActorDetailsPageModule)
  },
  {
    path: 'prod-direct-details',
    loadChildren: () => import('./pages/producer-director-details/prod-direct-details.module').then( m => m.ProdDirectDetailsPageModule)
  },
  {
    path: 'post-list',
    loadChildren: () => import('./pages/post-list/post-list.module').then( m => m.PostListPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'actor-list',
    loadChildren: () => import('./pages/actor-list/actor-list.module').then( m => m.ActorListPageModule)
  },
  {
    path: 'musicDirector-dropdownRoute',
    loadChildren: () => import('./pages/create-actor/create-actor.module').then( m => m.CreateActorPageModule)
  },  
  // {
  //   path: 'daily-activities',
  //   loadChildren: () => import('./pages/daily-activities/daily-activities.module').then( m => m.DailyActivitiesPageModule)
  // },
  {
    path: 'post-activities',
    loadChildren: () => import('./pages/post-activities/post-activities.module').then( m => m.PostActivitiesPageModule)
  },
  {
    path: 'activity-comments',
    loadChildren: () => import('./pages/activity-comments/activity-comments.module').then( m => m.ActivityCommentsPageModule)
  },
  {
    path: 'upload-more',
    loadChildren: () => import('./upload-more/upload-more.module').then( m => m.UploadMorePageModule)
  },
  {
    path: 'userdetails-popup',
    loadChildren: () => import('./pages/userdetails-popup/userdetails-popup.module').then( m => m.UserdetailsPopupPageModule)
  },
  {
    path: 'actordetails-popup',
    loadChildren: () => import('./pages/actordetails-popup/actordetails-popup.module').then( m => m.ActordetailsPopupPageModule)
  },
  {
    path: 'userdetailschild-popup',
    loadChildren: () => import('./pages/userdetailschild-popup/userdetailschild-popup.module').then( m => m.UserdetailschildPopupPageModule)
  },
  {
    path: 'filter-list',
    loadChildren: () => import('./pages/filter-list/filter-list.module').then( m => m.FilterListPageModule)
  },
  {
    path: 'filter-actordetails',
    loadChildren: () => import('./pages/filter-actordetails/filter-actordetails.module').then( m => m.FilterActordetailsPageModule)
  },
  {
    path: 'ad-management',
    loadChildren: () => import('./pages/ad-management/ad-management.module').then( m => m.AdManagementPageModule)
  }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
