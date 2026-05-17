import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {   path: 'login', 
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },

    {
        path: '',
        loadComponent: () => import('./layouts/main-layout/main-layout')
        .then(m => m.MainLayout),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/home/home').then(m => m.Home)
            },
            {
                path: 'users',
                loadComponent: () => import('./pages/users/users').then(m => m.Users)
            },
            {
                path: 'playsong/:id/:title',
                loadComponent: () => import('./pages/play-song/play-song')
                .then(m => m.PlaySong)
            },
            {
                path: 'upload',
                loadComponent: () => import('./pages/upload/upload')
                .then(m => m.UploadComponent)
            },
            {
                path: 'artist',
                loadComponent: () => import('./pages/artist/artist')
                .then(m => m.Artist)
            },
            {
                path: 'artist/:id/:name',
                loadComponent: () => import('./pages/individual-artist/individual-artist')
                .then(m => m.IndividualArtist)
            }
        ]
  }
];
