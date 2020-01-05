import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { ListComponent } from './list/list.component';
import { Sec2minPipe } from './sec2min.pipe';
import { SeekComponent } from './seek/seek.component';
import { SongCommentComponent } from './song-comment/song-comment.component';
import { SongComponent } from './song/song.component';
import { AddSongComponent } from './add-song/add-song.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    SongComponent,
    SongCommentComponent,
    SeekComponent,
    Sec2minPipe,
    AddSongComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GraphQLModule,
    FormsModule,
    ReactiveFormsModule,
    LottieModule.forRoot({ player: () => player })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
