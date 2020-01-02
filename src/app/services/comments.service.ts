import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RootComment } from '../interfaces/comment';

const URI = 'http://34.89.117.96/comments/v1'

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private http: HttpClient
  ) { }

  getCommentsBySong(id) {
    return this.http.get<RootComment[]>(`${URI}/comment/${id}`);
  }

  createSubcomment(data) {
    return this.http.post<any>(`${URI}/comment`, data);
  }
}
