import { Component, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth, Song, SongResponse, Artists, PlayResponse } from '../../services/auth';
import { CommonModule, NgClass, NgStyle, } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-play-song',
  imports: [CommonModule, MatIconModule, FormsModule, NgClass, NgStyle],
  templateUrl: './play-song.html',
  styleUrl: './play-song.css',
})
export class PlaySong {
  constructor(private route: ActivatedRoute, private auth: Auth, private cdr: ChangeDetectorRef, private router: Router) {}
  song!: Song
  loading :boolean = true
  imgUrl: String = ''

  topSongs: Song[] = []

  playsongapi: string = ''

  animate: boolean = true

  songn?: Song
  queue: Song[] = []
  currentIndex = 0;

  ngOnInit() {
    this.playsongapi = this.auth.PlaySong()

    // const id = this.route.snapshot.paramMap.get('id')
    const title = this.route.snapshot.paramMap.get('title')
    console.log("name", title)
    this.imgUrl = this.auth.Imamg()
    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));

      this.loadSong(id);

    });

    const savedIndex = localStorage.getItem('currentIndex');

    if (savedIndex !== null) {
      this.currentIndex = Number(savedIndex);
    }
  }

  loadSong(id: number) {

    this.loading = true;

    this.auth.PlayQueue(id).subscribe({
      next: (data) => {

        this.song = data.song;
        this.queue = data.next || [];
        
        // if (this.currentIndex >= this.queue.length) {
        //   this.currentIndex = 0;
        // }
        this.loading = false;

        this.cdr.detectChanges();
         setTimeout(() => {
                this.auth.PostHistory(Number(this.song.id)).subscribe({
                  next: (re) => {
                    console.log("thisOK")
                  },
                  error: (err) => {
                    console.error(err)
                  }
                  
                })
          }, 10000);

      },
      error: (err) => {
        console.log(err);
      }
    });

  }
  libermat_icon(){
    if (this.song.is_liked){
     return  {
        'font-size': '30px',
        'height': '30px',
        'width': '30px',
        'color': 'rgb(247, 4, 4)',
      }
    }
    return{
      'font-size': '30px',
      'height': '30px',
      'width': '30px',
      'color': 'white'
    }
  }

  liber:boolean = false
  LiberySave(song: any) {
   if(!song.is_liked){
       this.auth.SaveLibrary(song.id).subscribe({
      next: (res) => {
        song.is_liked = res.is_liked;
        this.cdr.detectChanges()
        this.animate = true;

        setTimeout(() => {
          this.animate = false;
        }, 300);

      },
      error: (err) => {
        console.log(err)
      }
    })
   }
   else{
      this.auth.DeleteLibrary(song.id).subscribe({
        next: (res) => {
          song.is_liked = false; 
          this.cdr.detectChanges()
        },
        error: (err) => {console.log(err)}
      })
   }
  }
  onImgError(event: any) {
    event.target.src = 'assets/default.jpg';
  }

   @ViewChild('player') player!: ElementRef<HTMLAudioElement>;

    isPlaying = true;
    progress = 0;
    currentTime = '0:00';
    duration = '0:00';
    volume = 1; 

  updateProgress() {
    const audio = this.player.nativeElement;

    if (!audio.duration) return;

    this.progress = (audio.currentTime / audio.duration) * 100;
    this.currentTime = this.formatTime(audio.currentTime);
  }

  setDuration() {
    const audio = this.player.nativeElement;
    this.duration = this.formatTime(audio.duration);
  }
  ngAfterViewInit() {
    const audio = this.player.nativeElement;

    const savedVolume = localStorage.getItem('volume');
    console.log(savedVolume)
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
      audio.volume = this.volume;
    }

    audio.ontimeupdate = () => {
      this.progress = (audio.currentTime / audio.duration) * 100;
      this.currentTime = this.formatTime(audio.currentTime);
      this.duration = this.formatTime(audio.duration);
    };
  }

  togglePlay() {
    const audio = this.player.nativeElement;

    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    this.isPlaying = !this.isPlaying;
  }

  seek(event: any) {
    const audio = this.player.nativeElement;
    const value = event.target.value;

    audio.currentTime = (value / 100) * audio.duration;
  }

  changeVolume(event: any) {
    const vol = event.target.value;

    this.volume = vol;
    this.player.nativeElement.volume = vol;

    console.log(vol)
    localStorage.setItem('volume', vol);
  }

  formatTime(time: number): string {
    if (!time || isNaN(time)) return '0:00';

    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);

    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }

  back() {}

  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')     
      .replace(/[^\w\-]+/g, '') 
      .replace(/\-\-+/g, '-');   
  }

  playNextSong() {

    if (!this.queue.length) return;

    const nextSong = this.queue[this.currentIndex];

    this.currentIndex++;

    if (this.currentIndex >= this.queue.length) {
      this.currentIndex = 0;
    }

    localStorage.setItem('currentIndex', String(this.currentIndex));

    this.goPlays(nextSong);

  }

  next() {
  this.playNextSong();
}


  goPlay(song: Song) {

    this.song = song;
    const id = this.route.snapshot.paramMap.get('id')
    this.auth.PlayQueue(Number(song.id)).subscribe({
      next: (data) => {
        this.song = data.song;
        this.queue = data.next || [];

        this.cdr.detectChanges();

        setTimeout(() => {
          const audio = this.player.nativeElement;
          audio.load();
          audio.play();

          this.isPlaying = false;
        }, 100);
      },
      error: (err) => console.log(err)
    });

  }
  goPlays(song: Song) {
    this.router.navigate(['/playsong', song.id, song.title]);
  }

  clickLink = (artists?: Artists) => {
    this.router.navigate(['/artist', artists?.ID, artists?.Name])
  }

}
