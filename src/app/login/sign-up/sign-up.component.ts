import { Component, OnInit } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

export interface User { FirstName: string; LastName: string; Age: number;
                        Gender: string; Description: string; county: string;
                        occupation: string; martialStatus: string; smoker: boolean;
                        drinker: boolean; FavoriteSong: string; FavoriteMovie: string }

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

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
  today = new Date();
  form: FormGroup;
  isSmoker: boolean;
  isDrinker: boolean;
  ActualAge: number;
 
  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    public authService: AuthService,
    private fs: AngularFirestore,
    ) { 
      this.users = fs.collection('User').valueChanges();
      this._db = fs;
    }

    _db:AngularFirestore;
    users:  Observable<any[]>;

  ngOnInit(): void {
    this.setUpForm();
  }

  addUser(FName: string, lName: string, fAge: number, 
          fGender: string, fDescription: string, fcounty: string,
          foccupation: string, fMartialStatus: string, fSmoker: boolean,
          fDrinker: boolean, fFavSong: string, fFavMovie: string){

    let userCollection = this._db.collection<User>('Users');
    userCollection.add({ FirstName: FName, LastName: lName, Age: fAge,
      Gender: fGender, Description: fDescription, county: fcounty,
      occupation: foccupation, martialStatus: fMartialStatus, smoker: fSmoker,
      drinker: fDrinker, FavoriteSong: fFavSong, FavoriteMovie: fFavMovie});
  }

  setUpForm() {
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      county: ['', Validators.required],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],
      gender: ['', Validators.required],
      occupation: ['', Validators.required],
      martialStatus: ['', Validators.required],
      smoker: ['', Validators.required],
      drinker: ['', Validators.required],
      favSong: ['', Validators.required],
      favMovie: ['', Validators.required]
    })
  }


  submit() {
    const user = {
      email: this.form.value.email,
      password: this.form.value.password,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      dateOfBirth: this.form.value.dateOfBirth,
      county: this.form.value.county,
      description: this.form.value.description,
      gender: this.form.value.gender,
      occupation: this.form.value.occupation,
      martialStatus: this.form.value.martialStatus,
      smoker: this.form.value.smoker,
      drinker: this.form.value.drinker,
      favSong: this.form.value.favSong,
      favMovie: this.form.value.favMovie
    }
    this.authService.SignUp(user.email, user.password);
    console.log(user);
    this.form.reset;
    this.modalService.closeAll();

    if(user.smoker == "smoker")
      this.isSmoker = true;
    else
      this.isSmoker = false;

    if(user.drinker == "drinker")
      this.isDrinker = true;
    else
     this.isDrinker = false;

    var timeDiff = Math.abs(Date.now() - new Date(user.dateOfBirth).getTime());
    this.ActualAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

    this.addUser(user.firstName, user.lastName,this.ActualAge, user.gender,
                  user.description, user.county,user.occupation, 
                  user.martialStatus, this.isSmoker, this.isDrinker, user.favSong,
                  user.favMovie);
                  
    return user;
  }

  public CalculateAge(birthdate: number) {
    
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
}

}
