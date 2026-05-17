import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink, } from '@angular/router';
import { Router } from '@angular/router';
import { Auth, User } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
   standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatIconModule, CommonModule, RouterLink,],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {

  isMobile = false;      
  menuOpen = false;     
  imgs: string = "https://jvvyuerxjgqaylbyfkqi.supabase.co/storage/v1/object/public/Songs/1778938189_1776164899_Screenshot%202026-04-14%20173717.png"
  user!: User;
  imageUrl!: string;

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.imageUrl = this.auth.Imamg()
    this.checkScreen()
  
    this.auth.ShowUser().subscribe({
      next: (res) => {
        this.user = res;
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  toggleMenu(sidenav: any) {
    sidenav.toggle();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }

  logouts() {
    this.auth.logout();
    location.reload();
  }
}
