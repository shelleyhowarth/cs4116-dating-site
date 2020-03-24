import { Component, OnInit } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { Observable, Observer } from 'rxjs';
import * as firebase from 'firebase';


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

  loading = false;
  avatarUrl:string;
  selectedFile = null;
  fileObj = null;

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
    private msg: NzMessageService
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

  //if(this.form.value.smoker == "smoker") 

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
      favMovie: this.form.value.favMovie,
    }
    this.authService.SignUp(user.email, user.password);
    console.log(user);
    this.upload(user.email);

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

beforeUpload = (file: File) => {
  return new Observable((observer: Observer<boolean>) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      this.msg.error('You can only upload JPG file!');
      observer.complete();
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('Image must smaller than 2MB!');
      observer.complete();
      return;
    }
    // check height
    this.checkImageDimension(file).then(dimensionRes => {
      if (!dimensionRes) {
        this.msg.error('Image only 300x300 above');
        observer.complete();
        return;
      }

      observer.next(isJPG && isLt2M && dimensionRes);
      observer.complete();
    });
  });
};

private checkImageDimension(file: File): Promise<boolean> {
  return new Promise(resolve => {
    const img = new Image(); // create image
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      window.URL.revokeObjectURL(img.src!);
      resolve(width === height && width >= 300);
    };
  });
}

handleChange(event){
  this.fileObj = event.fileList[0].originFileObj;
  console.log(event);
}

upload(email: string){
  var storageRef = firebase.storage().ref("profilePics");
  var uploadTask = storageRef.child(email).put(this.fileObj);
}

}
