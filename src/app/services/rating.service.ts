import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RatingRequest, RatingResponse } from '../interfaces/rating';

const URI = 'http://34.89.117.96/song-rating/v1/song-rating'

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(
    private http: HttpClient
  ) { }

  getRatingForSong(id) {
    return this.http.get<RatingResponse>(`${URI}/${id}`);
  }

  updateRating(data: RatingRequest) {
    return this.http.put<RatingResponse>(URI, data);
  }
}
