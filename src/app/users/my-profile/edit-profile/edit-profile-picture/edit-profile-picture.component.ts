import { Component, OnInit, Input, NgZone } from '@angular/core';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/model/user.model';
import { Observable,  Observer } from 'rxjs';

@Component({
  selector: 'app-edit-profile-picture',
  templateUrl: './edit-profile-picture.component.html',
  styleUrls: ['./edit-profile-picture.component.scss']
})
export class EditProfilePictureComponent implements OnInit {

    @Input() entry;
    @Input() current;
    user;
    email;
    avatarUrl;
    selectedFile = null;
    fileObj = null;
    loading = false;
  
    constructor(private modal: NzModalRef, public router: Router, private modalService: NzModalService,private msg: NzMessageService) {}
  
  
    ngOnInit(): void {
      this.user = this.modal.getInstance().nzComponentParams.entry;
      this.email = this.modal.getInstance().nzComponentParams.current;
      this.getProfilePicture();
  
      console.log("User "+ this.user);
      console.log("Bio "+ this.email);
    }

    getProfilePicture(){
      var picLocation = "profilePics/"  + this.email;
      console.log(picLocation);
      var picRef = firebase.storage().ref(picLocation);
      
      picRef.getDownloadURL().then(picUrl => {
        this.avatarUrl = picUrl;
      });
    }
  
    update(){
      let uid = firebase.auth().currentUser.uid
      var storageRef = firebase.storage().ref("profilePics");
      var uploadTask = storageRef.child(this.email).put(this.fileObj);
      this.modalService.closeAll();
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
      var size = event.fileList.length;
      console.log(size);
      this.fileObj = event.fileList[size - 1].originFileObj;
      console.log(event);
      
      this.getBase64(event.file!.originFileObj!, (img: string) => {
        this.loading = false;
        this.avatarUrl = img;
      });
    }
    
    private getBase64(img: File, callback: (img: string) => void): void {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result!.toString()));
      reader.readAsDataURL(img);
    }
    
    }
  