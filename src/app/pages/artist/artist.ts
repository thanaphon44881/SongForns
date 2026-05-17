import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth, ArtistsIndividual } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artist',
  imports: [CommonModule],
  templateUrl: './artist.html',
  styleUrl: './artist.css',
})
export class Artist {
  artist: ArtistsIndividual[] = []
  isMobile: boolean = false

  imgurl: string = ''

  constructor(private auth: Auth, private cdr: ChangeDetectorRef, private router: Router){}

  ngOnInit() {
    this.imgurl = this.auth.Imamg()

    this.auth.artistFint().subscribe({
      next: (data) => {
        this.artist = data
        this.isMobile = true
        this.cdr.markForCheck()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  clickLink = (artists: ArtistsIndividual) => {
    this.router.navigate(['/artist', artists.id, artists.name])
  }
}
