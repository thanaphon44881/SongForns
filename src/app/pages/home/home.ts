import { Component, ChangeDetectorRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Auth, Song,SongResponse, SongViwes } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { format } from 'timeago.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor(private auth: Auth, private cdr: ChangeDetectorRef, private router: Router) {}

  topSongs: Song[] = []
  newSongs: Song[] = []
  songviews: SongViwes[] = []
  isSongn_t: boolean = false
  loading = true;

  baseUrl: string = ''
  showMenu = false;

  getTimeAgo(time: string) {
    return format(time, 'th')
  }

  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')     
      .replace(/[^\w\-]+/g, '') 
      .replace(/\-\-+/g, '-');   
  }
  goPlay(song: any) {
    this.router.navigate(['/playsong', song.id, this.slugify(song.title)]);
  }

//  getTimeAgo(time: string): string {
//   const now = new Date().getTime();
//   const past = new Date(time).getTime();
//   const diff = (now - past) / 1000;

//   if (diff < 60) return 'เมื่อสักครู่';
//   if (diff < 3600) return Math.floor(diff / 60) + ' นาทีที่แล้ว';
//   if (diff < 86400) return Math.floor(diff / 3600) + ' ชั่วโมงที่แล้ว';
//   return Math.floor(diff / 86400) + ' วันที่แล้ว';
// }

  ngOnInit() {
    this.baseUrl = this.auth.Imamg()
    this.songNew_top();
    this.SongViews()
  }

  SongViews() {
    this.auth.SongViwe().subscribe({
      next: (data) => {
        this.songviews = data
        this.cdr.markForCheck()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  songNew_top() {
    this.auth.ShowTop_NewSong().subscribe({
      next: (data: SongResponse) => {
        this.newSongs = data?.new || [];
        this.topSongs = data?.top || [];
        this.loading = false;
        this.cdr.markForCheck()
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  checktop_new(n: boolean){
    if (n){
      this.isSongn_t = true
    }else{
      this.isSongn_t = false
    }
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  onImgError(event: any) {
    event.target.src = 'assets/default.jpg';
  }

  @ViewChild('menuBox') menuBox!: ElementRef;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.menuBox.nativeElement.contains(event.target)) {
      this.showMenu = false;
    }
  }
}