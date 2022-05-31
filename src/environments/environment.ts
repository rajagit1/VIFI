// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: true,
  //  firebaseConfig : {
   //   apiKey: "AIzaSyBHPFxg8GJqyDx1IcaSNi-K6cE7e0oQaIc",
    //  authDomain: "app-direct-a02bf.firebaseapp.com",
    //  databaseURL: "https://app-direct-a02bf.firebaseio.com",
    //  projectId: "app-direct-a02bf",
    //  storageBucket: "app-direct-a02bf.appspot.com",
    //  messagingSenderId: "491367035161",
    //  appId: "1:491367035161:web:505e4336594bab5adb1588",
    //  measurementId: "G-FVVWR51C70"
    
  //}
   firebaseConfig: {
     apiKey: "AIzaSyCJEe0sb4BFB9qlBDPfg4pR8_l7tr_C-mc",
     authDomain: "app-quick-direct.firebaseapp.com",
    databaseURL: "https://app-quick-direct.firebaseio.com",
     projectId: "app-quick-direct",
     storageBucket: "app-quick-direct.appspot.com",
     messagingSenderId: "74222281935",
     appId: "1:74222281935:android:12c1cb26421bb2c65843ba",
     measurementId: "G-XN40CTFJV2"
   },
   androidFirebaseConfig: {
    apiKey: "AIzaSyCJEe0sb4BFB9qlBDPfg4pR8_l7tr_C-mc",
    authDomain: "app-quick-direct.firebaseapp.com",
   databaseURL: "https://app-quick-direct.firebaseio.com",
    projectId: "app-quick-direct",
    storageBucket: "app-quick-direct.appspot.com",
    messagingSenderId: "74222281935",
    appId: "1:74222281935:android:12c1cb26421bb2c65843ba",
    measurementId: "G-XN40CTFJV2"
  }
};


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
