import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}
export interface User{
  id: number;
  username: string;
  email: string;
  password: string;
  biaoname: string;
  image: string;
}
export interface SongResponse {
  new: Song[];
  top: Song[];
}

export interface SongViwes{
  played_at: string;
  user: number;
  song: Song
}

export interface Song {
  id?: number;
  title: string;
  file: string;
  cover: string;
  songtime: number;
  category: string;
  views?: number;
  artistid: number;
  Up?: string;       
  sub: string;
  slug?: string;
  artist?: Artists;
  is_liked?: boolean;
  country: string;
}

export interface Artists {
  ID: number;
  Name: string;
  Image?: string;
  Bio: string;
  Songs: Song[] | null;
}

export interface ArtistsIndividual {
  id?: number;
  name?: string;
  image?: string;
  bio?: string;
  songs: Song[] | null;
}

export interface Libery{
  is_liked : boolean
}

export interface PlayResponse{
  song: Song;
  next: Song[]
}

@Injectable({
  providedIn: 'root'
})

export class Auth {
  constructor(private http: HttpClient) {}
   private apiUrl = 'https://song-backend-beige.vercel.app';

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.apiUrl + '/login',
      data,
      {withCredentials: true}
    )
  }

  ShowUser(): Observable<User>{
    return this.http.get<User>(this.apiUrl + '/me', {
      withCredentials: true
  });
  }

  ShowTop_NewSong(): Observable<SongResponse>{
    return this.http.get<SongResponse>(
      this.apiUrl + '/songnew',
      {withCredentials: true}
    )
  }

  SongViwe(): Observable<SongViwes[]>{
    return this.http.get<SongViwes[]>(
      this.apiUrl + "/history",
      {withCredentials: true}
    )
  }

  Imamg(): string{
    return this.apiUrl
  }

  SongID(id: number, title: string): Observable<Song> {
    return this.http.get<Song>(this.apiUrl + "/song"+"/"+id +"/"+title, {withCredentials: true})
  }
  
  SaveLibrary(song_id: number): Observable<Libery>{
    return this.http.post<Libery>(this.apiUrl + "/library", {song_id: song_id}, {withCredentials: true})
  }
  DeleteLibrary(userid: number){
    return this.http.delete(this.apiUrl+"/library"+"/"+userid, {withCredentials: true})
  }

  ShowArtist(): Observable<ArtistsIndividual[]>{
    return this.http.get<ArtistsIndividual[]>(this.apiUrl+"/artist", {withCredentials: true})
  }

  PostSong(formdata: FormData) {
    return this.http.post(this.apiUrl + "/song",formdata, {withCredentials: true})
  }

  Categories(): Observable<string[]>{
    return this.http.get<string[]>("assets/categories.json")
  }

  PlaySong(): string{
    return this.apiUrl + "/" + "music"
  }

  artistFint(): Observable<ArtistsIndividual[]>{
    return this.http.get<ArtistsIndividual[]>(this.apiUrl + "/" + "artist", {withCredentials: true})
  }

  artistANDsong(id: number): Observable<ArtistsIndividual>{
    return this.http.get<ArtistsIndividual>(this.apiUrl + "/" + "artist" + "/" + id, {withCredentials: true})
  }

  PlayQueue(id: number): Observable<PlayResponse>{
    return this.http.get<PlayResponse>(this.apiUrl + "/" + "song" + "/" + "play" +  "/" + id, {withCredentials: true})
  }

  PostHistory(song_id: number) {
    return this.http.post(this.apiUrl + "/" + "history" , song_id, {withCredentials: true})
  }

  logout(){
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
