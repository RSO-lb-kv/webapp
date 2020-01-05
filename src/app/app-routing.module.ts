import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddSongComponent } from './add-song/add-song.component';
import { ListComponent } from './list/list.component';
import { SongComponent } from './song/song.component';


const routes: Routes = [
  { path: 'home', component: ListComponent },
  { path: 'song/:id', component: SongComponent },
  { path: 'new', component: AddSongComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
