import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import * as firebase from "firebase";
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn;
  signUp = false;
  signUpFinished = false;
  users;
  uid;
  _db: AngularFirestore;
  admin = false;
  disabled = false;
  
  constructor(public afAuth: AngularFireAuth,
              public router: Router,
              private fs: AngularFirestore,
              private userService: UsersService
              ) { 
                this._db = fs;
    }

  SignUp(email, password) {
    this.signUp = true;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        window.alert("You have been successfully registered!");
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign in with email/password
  SignIn(email, password) {
    var isUser = false
    var isDisabled = false;
    const snapshot = this.fs.collection('Users').get();
    snapshot.subscribe(snap => {
      snap.forEach(doc => {
        if (doc.data().disabled === true && doc.data().email === email) {
            isDisabled = true;
            if (isDisabled) {
              window.alert("Account is disabled");
            }
          }
          else if (doc.data().email === email) {
            console.log(isUser);
            isUser = true;
            if (isUser) {
              console.log("here");
              return this.afAuth.auth.signInWithEmailAndPassword(email, password)
                .then((result) => {
                  this.router.navigate(['home']);
                }).catch((error) => {
                  window.alert(error.message)
                })
            }
            else {
              window.alert("No Account");
            }
          }
      });
    });
  }

  /* Sign out */
  SignOut() {
    this.signUp = false;
    this.signUpFinished = false;
    this.afAuth.auth.signOut();
  }

  isAuthenticated() {
    if (this.signUp && this.signUpFinished) {
      this.loggedIn = true;
    }
    else if (this.signUp && !this.signUpFinished) {
      this.loggedIn = false;
    }
    else if(firebase.auth().currentUser != null) {
      this.loggedIn = true;
    }
    else {
      this.loggedIn = false;
    }
    return this.loggedIn;
  }


  addUser(fName: string, lName: string, fAge: number, fEmail: string,
          fGender: string, fDescription: string, fcounty: string,
          foccupation: string, fmaritalStatus: string, fSmoker: string,
          fDrinker: string, fFavSong: string, fFavMovie: string, fInterests: [], fUid: string, fProfilePic: string) {
      let userCollection = this._db.collection<User>('Users');

      userCollection.doc(fUid).set({ firstName: fName, lastName: lName, age: fAge, email: fEmail,
      gender: fGender, description: fDescription, county: fcounty,
      occupation: foccupation, maritalStatus: fmaritalStatus, smoker: fSmoker,
      drinker: fDrinker, favoriteSong: fFavSong, favoriteMovie: fFavMovie, interests: fInterests, uid: fUid,
      profilePic: fProfilePic, admin: this.admin, disabled: this.disabled});
      
    this.signUpFinished = true;
  }

  updateInterests(updatedInterests:[] ,userId:string){
    let userCollection = this._db.collection<User>('Users');
    userCollection.doc(userId).update({interests:updatedInterests})
  }

}
