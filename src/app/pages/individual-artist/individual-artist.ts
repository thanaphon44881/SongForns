import { Component, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth, ArtistsIndividual, Song} from '../../services/auth';
import { CommonModule, NgClass, NgStyle, } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-individual-artist',
  imports: [CommonModule, NgStyle],
  templateUrl: './individual-artist.html',
  styleUrl: './individual-artist.css',
})
export class IndividualArtist {
  imgUrl: string = ''
  artist?: ArtistsIndividual
  isApidf: boolean = false
  showFullBio = false;

  isMobile = false;   

  constructor(private auth: Auth, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private router: Router){}
  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id')
    // const name = this.route.snapshot.paramMap.get('name')
    this.imgUrl = this.auth.Imamg()
    this.isArtist(Number(id))
  }

  isArtist(id: number) {
    this.auth.artistANDsong(id).subscribe({
      next: (data) => {
        this.artist = data
        this.isApidf = true
        console.log(this.artist)
        this.cdr.markForCheck()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  toggleBio() {
    this.showFullBio = !this.showFullBio;
  }

  formatTime(time: number): string {
    if (!time || isNaN(time)) return '0:00';

    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);

    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }

  @HostListener('window:resize')

    checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }

  // slugify(text: string): string {
  //   return text
  //     .toLowerCase()
  //     .replace(/\s+/g, '-')     
  //     .replace(/[^\w\-]+/g, '') 
  //     .replace(/\-\-+/g, '-');   
  // }
  goPlay(song: Song) {
    this.router.navigate(['/playsong', song.id,song.title]);
  }

}
