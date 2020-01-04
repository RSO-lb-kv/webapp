import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class SongComponent implements OnInit, OnDestroy {
  @ViewChild('mainContainer', { static: true }) private mainContainer: ElementRef;

  pageLoaded: boolean;
  songId;
  song;
  comments: RootComment[];

  showNewComment: boolean;
  commentForm: FormGroup;

  constructor(
    private catalogService: CatalogService,
    private streamService: StreamService,
    private commentsService: CommentsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
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

    this.commentForm = this.formBuilder.group({
      author: ["", Validators.required],
      text: ["", Validators.required]
    });
  }

  ngOnDestroy() {
    this.streamService.stop();
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

  addNewComment() {
    this.showNewComment = true;
  }

  cancelNewComment() {
    this.showNewComment = false;
  }

  sendNewComment() {
    this.commentsService.createComment({
      songId: +this.songId,
      author: this.commentForm.get('author').value,
      text: this.commentForm.get('text').value
    }).subscribe(
      res => {
        this.comments.unshift(res);
        this.showNewComment = false;
      }
    );
  }

}
