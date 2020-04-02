import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  genders = ["male", "female"];
  ranges = ["55-60", "61-65", "66-70", "71-75", "76-80", "81-85", "85+"];
  interests = ["gardening", "painting", "reading", "walking", "cooking", "baking", "chess"];
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
          this.users.push(object);
        });
       });
  }

  getName(user) {
    return user.firstName;
  }

  getAgeAndLocation(user) {
    return " " + user.age + ", " + user.county + " ";
  }

  search() {
    this.noResults = true;
    this.searchArray = [];
    console.log(this.filter);
      this.users.forEach(user => {
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
    console.log(this.searchArray);
   }

   getAgeRange(userAge) {
    let firstNumber = +this.filter.ageRange.substring(0, this.filter.ageRange.indexOf("-"));
    let secondNumber = +this.filter.ageRange.substring(this.filter.ageRange.indexOf("-") + 1, this.filter.ageRange.length);
    return (userAge >= firstNumber && userAge <= secondNumber);
    }


}
