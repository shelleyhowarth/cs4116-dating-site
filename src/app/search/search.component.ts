import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  genders = ["male", "female"];
  ranges = ["55-60", "61-65", "66-70", "71-75", "76-80", "81-85", "85+"];
  interests = ["Gardening", "Painting", "Reading", "Walking", "Cooking", "Baking", "Puzzles", "Music", "Exercising"];
  counties = [
    "Antrim",
    "Armagh",
    "Carlow",
    "Cavan",
    "Clare",
    "Cork",
    "Derry",
    "Donegal",
    "Down",
    "Dublin",
    "Fermanagh",
    "Galway",
    "Kerry",
    "Kildare",
    "Kilkenny",
    "Laois",
    "Leitrim",
    "Limerick",
    "Longford",
    "Louth",
    "Mayo",
    "Meath",
    "Monaghan",
    "Offaly",
    "Roscommon",
    "Sligo",
    "Tipperary",
    "Tyrone",
    "Waterford",
    "Westmeath",
    "Wexford",
    "Wicklow"
  ];
  form: FormGroup;
  filter = { gender: '', ageRange: '', county: '', interests: '' };
  users: Array<User> = [];
  searchArray = [];
  noResults = true;
  userId = firebase.auth().currentUser.uid
  disabledUsers = [];
  admin;

  constructor(private fb: FormBuilder, private firestore: AngularFirestore, private usersService: UsersService) { }

  ngOnInit(): void {
    const snapshot = this.firestore.collection('Users').get();
    snapshot.subscribe(snap => {
       snap.forEach(doc => {
          let object = new User();
          object.firstName = doc.data().firstName;
          object.lastName = doc.data().lastName;
          object.age = doc.data().age;
          object.description = doc.data().description;
          object.gender = doc.data().gender;
          object.email = doc.data().email;
          object.favoriteSong = doc.data().favoriteSong;
          object.favoriteMovie = doc.data().favoriteMovie;
          object.county =  doc.data().county;
          object.drinker = doc.data().drinker;
          object.maritalStatus = doc.data().maritalStatus;
          object.occupation = doc.data().occupation;
          object.smoker = doc.data().smoker;
          object.interests = doc.data().interests;
          object.uid = doc.data().uid;
          object.profilePic = doc.data().profilePic;
          object.admin = doc.data().admin;
          object.disabled = doc.data().disabled;
          this.users.push(object);
        });

        this.users.forEach(user => {
          if(user.uid === this.userId) {
            this.users.splice(this.users.indexOf(user), 1);
            this.admin = user.admin;
          }
        })
       });
  }

  search() {
    this.noResults = true;
    this.searchArray = [];
      this.users.forEach(user => {
        console.log(user);
          if(user.gender === this.filter.gender || this.filter.gender === '')
          {
            if(user.county === this.filter.county || this.filter.county === '')
            {
              if(user.interests.find(interest => interest == this.filter.interests) || this.filter.interests === '') {
                if(this.getAgeRange(user.age) || this.filter.ageRange === '') {
                  
                  this.searchArray.push(user);
                  if(this.searchArray.length > 0) {
                    this.noResults = false;
                  }
                  else if(this.searchArray.length == 0) {
                    this.noResults = true;
                }
              }
            }
          }
        }
      });
   }

  getAgeRange(userAge) {
    let firstNumber = +this.filter.ageRange.substring(0, this.filter.ageRange.indexOf("-"));
    let secondNumber = +this.filter.ageRange.substring(this.filter.ageRange.indexOf("-") + 1, this.filter.ageRange.length);
    let eightyFive = +this.filter.ageRange.substring(0, this.filter.ageRange.indexOf("+"));

    if(firstNumber !== 85 && userAge >= firstNumber && userAge <= secondNumber) {
      return true;
    }
    else if(eightyFive == 85 && userAge >= eightyFive) {
      return true;
      }
  }

  reset() {
    this.filter = { gender: '', ageRange: '', county: '', interests: '' };
    this.search();
  }

  getDisabled() {
    this.searchArray = [];
    this.users.forEach(user => {
      console.log(user);
      if (user.disabled === true) {
        this.searchArray.push(user);
      }
      if(this.searchArray.length !== 0) {
        this.noResults = false;
      }
    });
  }
}
