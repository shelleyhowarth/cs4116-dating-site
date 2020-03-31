import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  id;
  user: User;
  constructor(private route: ActivatedRoute, private router: Router, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.id = this.router.url.substring(this.router.url.indexOf("=") + 1, this.router.url.length);
    this.db.collection('Users').doc(this.id).ref.get().then(function (doc) {
      if (doc.exists) {
        this.user = {  
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          age: doc.data().age,
          description: doc.data().description,
          gender: doc.data().gender,
          email: doc.data().email,
          favoriteSong: doc.data().favoriteSong,
          favoriteMovie: doc.data().favoriteMovie,
          county: doc.data().county,
          drinker: doc.data().drinker,
          maritalStatus: doc.data().maritalStatus,
          occupatio: doc.data().occupation,
          smoker: doc.data().smoker,
          interests: doc.data().interests,
          uid: doc.data().uid
        };
        console.log(this.doc.data().firstName);
        console.log(this.user);
      } else {
        console.log("There is no document!");
      }
    }).catch(function (error) {
      console.log("There was an error getting your document:", error);
    });
  }

  }
