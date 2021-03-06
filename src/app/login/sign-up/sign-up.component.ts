import { Component, OnInit, Input } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzModalService, NzMessageService} from 'ng-zorro-antd';
import { UploadFile } from 'ng-zorro-antd/upload';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { Observable, Observer } from 'rxjs';
import * as firebase from 'firebase';
import { InterestsComponent } from './interests/interests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  @Input() entry;
  
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
  today = new Date("1965");
  form: FormGroup;
  isSmoker: boolean;
  isDrinker: boolean;
  ActualAge: number;
  _db:AngularFirestore;
  users:  Observable<any[]>;
  validateForm: any;
  

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

  ngOnInit(): void {
    this.setUpForm();
    
  }

  setUpForm() {
    this.form = this.fb.group({
      email:[null, [Validators.email, Validators.required]],
      password: ['', [Validators.required, this.noWhitespaceValidator,Validators.maxLength(11), Validators.minLength(6)]],
      firstName: [null,[Validators.required, this.noWhitespaceValidator, Validators.maxLength(15)]],
      lastName: ['',[Validators.required, this.noWhitespaceValidator,Validators.maxLength(15)]],
      age: ['', Validators.required],
      county: ['', Validators.required],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(250), this.noWhitespaceValidator])],
      gender: ['', Validators.required],
      occupation: ['', [Validators.required, this.noWhitespaceValidator, Validators.maxLength(15)]],
      maritalStatus: ['', Validators.required],
      smoker: ['', Validators.required],
      drinker: ['', Validators.required],
      favoriteSong: ['', [Validators.required, this.noWhitespaceValidator, Validators.maxLength(40)]],
      favoriteMovie: ['', [Validators.required, this.noWhitespaceValidator, Validators.maxLength(40)]]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {

    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    if(this.fileObj == null) {
      window.alert("Please Add A Valid Profile Picture!");
    }
    else {
    const user = {
      email: this.form.value.email,
      password: this.form.value.password,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      age: this.form.value.age,
      county: this.form.value.county,
      description: this.form.value.description,
      gender: this.form.value.gender,
      occupation: this.form.value.occupation,
      maritalStatus: this.form.value.maritalStatus,
      smoker: this.form.value.smoker,
      drinker: this.form.value.drinker,
      favoriteSong: this.form.value.favoriteSong,
      favoriteMovie: this.form.value.favoriteMovie,
    }
    this.authService.SignUp(user.email, user.password);
    this.upload(user.email);

    this.form.reset;
    this.modalService.closeAll();   
    this.createInterestsComponent(user);
    }
  }

  createInterestsComponent(user) {
    this.modalService.create({
        nzContent: InterestsComponent,
        nzClosable: false,
        nzMaskClosable: false,
        nzComponentParams: {
          entry: user
        },
    });
  }

  public CalculateAge(birthdate: number) { }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      
      if (!isJPG) {
        this.msg.error('You can only upload JPG file!' + " Image file type: " + file.type);
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      // check heightw
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error('Image width and height must be equal and above 300px or above');
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
        this.msg.info("Image width: "+ width + "  height: "+height + " type: " + file.type);
      };
    });
  }

  handleChange(event){
    var size = event.fileList.length;
    this.fileObj = event.fileList[size - 1].originFileObj;
    
    this.getBase64(event.file!.originFileObj!, (img: string) => {
      this.loading = false;
      this.avatarUrl = img;
    });
  }

  upload(email: string){
    var storageRef = firebase.storage().ref("profilePics");
    storageRef.child(email).put(this.fileObj);
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

}

