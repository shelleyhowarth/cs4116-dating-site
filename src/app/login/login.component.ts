import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  constructor(
      private modalService: NzModalService,
      private fb: FormBuilder,
      public authService: AuthService
    ) { }

  ngOnInit() {
    this.authService.SignOut();
    this.setUpForm();
  }

  createSignUpComponent() {
    this.modalService.create({
        nzContent: SignUpComponent,
    });
  }

  setUpForm() {
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  submit() {
    const loginDetails = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.authService.SignIn(loginDetails.email, loginDetails.password)
    return loginDetails;
  }

}
