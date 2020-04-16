import { Component, OnInit, Input, NgZone } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/model/user.model';


@Component({
  selector: 'app-edit-bio',
  templateUrl: './edit-bio.component.html',
  styleUrls: ['./edit-bio.component.scss']
})
export class EditBioComponent implements OnInit {
  @Input() entry;
  @Input() current;
  currentBio;
  user;
  defaultOption;
  _db: AngularFirestore;

  constructor(private modal: NzModalRef, public router: Router, private modalService: NzModalService, private fs: AngularFirestore) { this._db = fs;}


  ngOnInit(): void {
    this.user = this.modal.getInstance().nzComponentParams.entry;
    this.currentBio = this.modal.getInstance().nzComponentParams.current;
    this.defaultOption = this.currentBio

    console.log("User "+ this.user);
    console.log("Bio "+ this.currentBio);
    console.log("default "+ this.defaultOption);
  }

  update(){
    let uid = firebase.auth().currentUser.uid
    let userCollection = this._db.collection<User>('Users');
    userCollection.doc(uid).update({description:this.defaultOption})
    this.modalService.closeAll();
  }

}