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
  uid;


  constructor(private modal: NzModalRef, public router: Router, private modalService: NzModalService, private fs: AngularFirestore) { }

  ngOnInit(): void {
    this.user = this.modal.getInstance().nzComponentParams.entry;
    this.currentBio = this.modal.getInstance().nzComponentParams.current;
    this.uid = this.modal.getInstance().nzComponentParams.uid;
    this.defaultOption = this.currentBio;
  }

  update(){
    let userCollection = this.fs.collection<User>('Users');
    userCollection.doc(this.uid).update({
      description:this.defaultOption
    });
    this.modalService.closeAll();
  }
}