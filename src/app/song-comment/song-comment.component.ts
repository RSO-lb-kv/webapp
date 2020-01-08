import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Comment } from '../interfaces/comment';
import { CommentsService } from '../services/comments.service';

@Component({
  selector: 'app-song-comment',
  templateUrl: './song-comment.component.html',
  styleUrls: ['./song-comment.component.scss']
})
export class SongCommentComponent implements OnInit {

  @Input() comment: Comment;
  @Input() songCommentId: string;

  @Output() onCancel = new EventEmitter();

  commentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private commentsService: CommentsService
  ) { }

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      author: ["", Validators.required],
      text: ["", Validators.required]
    });
  }

  reply() {
    if (this.comment.comments.some(c => c.writing))
      return;
    this.comment.comments.push({
      author: "",
      text: "",
      commentId: this.comment.commentId,
      writing: true,
    })
  }

  cancelReply() {
    this.onCancel.emit();
  }

  removeLastComment() {
    this.comment.comments.pop();
  }

  sendReply() {
    if (this.commentForm.invalid) return;
    this.commentsService.createSubcomment({
      songCommentId: this.songCommentId,
      commentId: this.comment.commentId,
      author: this.commentForm.get('author').value,
      text: this.commentForm.get('text').value
    }).subscribe(
      res => {
        this.ngOnInit();
        this.comment.writing = false;
        this.comment.author = res.author;
        this.comment.commentId = res.commentId;
        this.comment.text = res.text;
        this.comment.comments = res.comments;
        this.comment.createdAt = new Date().toISOString();
      }
    );
  }
}
