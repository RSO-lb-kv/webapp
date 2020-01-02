import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { RootComment } from '../interfaces/comment';
import { CatalogService } from '../services/catalog.service';
import { CommentsService } from '../services/comments.service';
import { StreamService } from '../services/stream.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {

  pageLoaded: boolean;
  songId;
  song;
  comments: RootComment[];

  constructor(
    private catalogService: CatalogService,
    private streamService: StreamService,
    private commentsService: CommentsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.pageLoaded = false;
    this.route.url.pipe(
      switchMap(data => {
        this.songId = data[1].path;
        return this.catalogService.getSong(this.songId)
      })
    ).subscribe(
      data => {
        this.song = data;
        this.startStream();
        this.getComments(this.songId);
        this.pageLoaded = true;
      }
    );
  }

  startStream() {
    this.streamService.playStream(this.song.uri).subscribe()
  }

  play() {
    this.streamService.play();
  }

  pause() {
    this.streamService.pause();
  }

  getComments(id) {
    this.commentsService.getCommentsBySong(id).subscribe(
      res => this.comments = res
    );
  }

}
