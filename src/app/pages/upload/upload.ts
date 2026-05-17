import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth, ArtistsIndividual, Song } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-upload',
  imports: [CommonModule, FormsModule, NgStyle],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class UploadComponent {
  song: Song = {
    title: '',
    songtime: 0,
    category: '',
    sub: '-',
    artistid: 0,
    file: '',
    cover: '',
    country: '-',
  };

  title = '';
  category = '';
  artistId = '';
  artist: ArtistsIndividual[] = []

  songFile!: File;
  coverFile!: File;

  categories: string[] = [];

  text: string = ''
  style: any = ''

  checkData: boolean = false

  audioPreview: string | null = null;
  coverPreview: string | null = null;


  constructor(private auth: Auth, private cdr: ChangeDetectorRef) {}

  //GetArtist
  ngOnInit() {
    this.auth.ShowArtist().subscribe({
      next: (data) => {
        this.artist = data;
        this.cdr.detectChanges()
      },
      error: (err) => console.log(err)
    });

    this.auth.Categories().subscribe(data => {
      this.categories = data
      })
    }
  
  //ImageShow
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDropCover(event: DragEvent) {
    event.preventDefault();
      const file = event.dataTransfer?.files[0];
      if (!file) return; 
      this.setCover(file);
  }

  setCover(file: File) {
    if (!file || !file.type.startsWith('image/')) return;

    this.coverFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.coverPreview = reader.result as string;
      this.cdr.markForCheck();
    }
    reader.readAsDataURL(file);
  }
  
  onCoverChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.setCover(file);
  }

  //SongShow
  // onSongChange(event: any) {
  // const file = event.target.files[0];
  // this.songFile = file;

  // const audio = new Audio();
  // audio.src = URL.createObjectURL(file);

  //   audio.onloadedmetadata = () => {
  //     const duration = Math.floor(audio.duration); 

  //     this.song.songtime = duration; 

  //     URL.revokeObjectURL(audio.src);
  //   };
  // }

  onDropSong(event: DragEvent) {
    event.preventDefault();

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    this.setSong(file);
  }

  setSong(file: File){
    if (!file || !file.type.startsWith('audio/')) return;

    this.songFile = file

    this.audioPreview = URL.createObjectURL(file)

    const audio = new Audio(this.audioPreview)

    audio.onloadedmetadata = () => {
      this.song.songtime = Math.floor(audio.duration)
    }
  }

  onSongChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.setSong(file);
  }
  //time
  // formatTime(time: number): string {
  //   const min = Math.floor(time / 60);
  //   const sec = Math.floor(time % 60);
  //   return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  // }
  upload() {
    this.checkTexttoApi()
    if (this.checkData){
      Swal.fire({
        title: "คุณต้องการเพิ่มเพลงหรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "เพิ่มเพลงเลย",
        cancelButtonText: "ไม่เพิ่ม"
      }).then((result) => {
        if (result.isConfirmed) {
          this.postapiupdate()
        }
      });
    }else{
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: "ข้อมูลไม่ครบครับ!",
    });
    }
  }

  postapiupdate() {
    console.log(this.artistId)
    const formData = new FormData();
      formData.append('title', this.song.title);
      formData.append('duration', this.song.songtime.toString());
      formData.append('category', this.song.category);
      formData.append('sub', this.song.sub)
      formData.append('artist_id', String(this.artistId));

      formData.append('song', this.songFile);
      formData.append('cover', this.coverFile);
      formData.append('country', this.song.country);

        this.auth.PostSong(formData).subscribe({
        next: (res) => {
          Swal.fire({
            title: "บันทึกเพลงเรียบร้อยแล้ว",
            icon: "success",
            confirmButtonText: "ตกลง"
          }).then((result) => {

            if (result.isConfirmed) {
              setTimeout(() => {
                window.location.reload();
              }, 500);

            }
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "500",
            text: "เกิดข้อผิดพลาดทางServer!",
            // footer: "<a href=\"#\">Why do I have this issue?</a>"
          });
        }
      })
  }

  checkTexttoApi(){
    this.style = {
      color: 'rgb(250, 37, 37)',
      fontSize: '12px'
    }
    
    if (this.song.title == ""){
        this.text = "ไม่มีข้อมูลในชื่อเพลง"

    }else if (this.song.category == ""){
        this.text = "ไม่มีข้อมูลประเภทของของเพลง(เพลงแนวไหน)"

    }else if (this.artistId == ''){
      this.text = "ไม่มีข้อมูลศิลปิน"
    }else if (this.coverFile == null){
      this.text = "ไม่มีรูปเพลงที่จะอัพโหลด"

    }else if (this.songFile == null){
      this.text = "ไม่มีเพลงที่จะอัพโหลด"
    }else{
      this.checkData = true
    }
  }
}
