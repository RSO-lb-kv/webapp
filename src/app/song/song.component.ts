import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { RootComment } from '../interfaces/comment';
import { RatingAction, RatingResponse } from '../interfaces/rating';
import { CatalogService } from '../services/catalog.service';
import { CommentsService } from '../services/comments.service';
import { RatingService } from '../services/rating.service';
import { StreamService } from '../services/stream.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit, OnDestroy {
  pageLoaded: boolean;
  showNewComment: boolean;
  ratingSelected = {
    like: false,
    dislike: false
  };

  song;
  comments: RootComment[];
  rating: RatingResponse;

  commentForm: FormGroup;

  constructor(
    private catalogService: CatalogService,
    private streamService: StreamService,
    private commentsService: CommentsService,
    private ratingService: RatingService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.pageLoaded = false;

    this.route.url.pipe(
      switchMap(data => forkJoin(
        {
          song: this.catalogService.getSong(+data[1].path).pipe(catchError(err => of(null))),
          comment: this.commentsService.getCommentsBySong(+data[1].path),
          rating: this.ratingService.getRatingForSong(+data[1].path)
        }
      ))
    ).subscribe(({ song, comment, rating }) => {
      this.song = song;
      this.comments = comment;
      this.rating = rating;
      this.startStream();
      this.pageLoaded = true;
    })

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

  addNewComment() {
    this.showNewComment = true;
  }

  cancelNewComment() {
    this.showNewComment = false;
  }

  sendNewComment() {
    this.commentsService.createComment({
      songId: this.song.id,
      author: this.commentForm.get('author').value,
      text: this.commentForm.get('text').value
    }).subscribe(
      res => {
        this.comments.unshift(res);
        this.showNewComment = false;
      }
    );
  }

  toogleRating(type: RatingAction) {

    if (type === "LIKE") {
      this.ratingSelected.like = !this.ratingSelected.like;
      if (this.ratingSelected.dislike) {
        this.ratingSelected.dislike = false;
        this.ratingService.updateRating({ songId: this.song.id, action: "REMOVE_DISLIKE" }).pipe(
          switchMap(() => this.ratingService.updateRating({ songId: this.song.id, action: this.ratingSelected.like ? "LIKE" : "REMOVE_LIKE" }))
        ).subscribe(
          data => this.rating = data
        );
      }
      else
        this.ratingService.updateRating({ songId: this.song.id, action: this.ratingSelected.like ? "LIKE" : "REMOVE_LIKE" }).subscribe(
          data => this.rating = data
        );
    }
    else {
      this.ratingSelected.dislike = !this.ratingSelected.dislike;
      if (this.ratingSelected.like) {
        this.ratingSelected.like = false;
        this.ratingService.updateRating({ songId: this.song.id, action: "REMOVE_LIKE" }).pipe(
          switchMap(() => this.ratingService.updateRating({ songId: this.song.id, action: this.ratingSelected.dislike ? "DISLIKE" : "REMOVE_DISLIKE" }))
        ).subscribe(
          data => this.rating = data
        );
      }
      else
        this.ratingService.updateRating({ songId: this.song.id, action: this.ratingSelected.dislike ? "DISLIKE" : "REMOVE_DISLIKE" }).subscribe(
          data => this.rating = data
        );
    }
  }

  home() {
    this.router.navigate(['/home']);
  }

}
