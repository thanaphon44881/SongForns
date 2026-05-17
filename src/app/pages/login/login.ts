import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth, LoginRequest } from '../../services/auth';
import { Router } from '@angular/router';
import { NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [MatIconModule,FormsModule, NgStyle],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  username = '';
  password = '';

  text = '';
  styleTest: any = {};
  imoji = '😊';
  inputstyle1: any = {};
  inputstyle2: any = {};

  constructor(private auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  resetState() {
    this.text = '';
    this.imoji = '';
    this.inputstyle1 = {};
    this.inputstyle2 = {};
    this.styleTest = {};
  }

  errorInput() {
    return {
      border: '2px solid red',
      borderRadius: '8px'
    };
  }

  handleAuthError(message: string) {
    this.imoji = '😑';

    this.styleTest = {
      color: 'rgb(250, 37, 37)',
      textAlign: 'center',
      fontSize: '12px'
    };

    if (message === 'user not found') {
      this.text = 'ชื่อผู้ใช้ไม่ถูกต้องครับ';
      this.inputstyle1 = this.errorInput();
    } 
    else if (message === 'wrong password') {
      this.text = 'รหัสผ่านไม่ถูกต้องครับ';
      this.inputstyle2 = this.errorInput();
    } 
    else {
      this.text = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้องครับ';
      this.inputstyle1 = this.errorInput();
      this.inputstyle2 = this.errorInput();
    }
  }

  loings() {
    const data: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.resetState();

    this.auth.login(data).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']);
      },

      error: (err) => {
        if (err.status === 401) {
          this.handleAuthError(err.error?.error);
          this.cdr.detectChanges(); 
        } else {
          this.text = 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์';
          this.cdr.detectChanges(); 
        }
      }
    });
  }
}
