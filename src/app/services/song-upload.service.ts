import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SongUpload } from '../interfaces/song';

const URI = "http://34.89.117.96/upload/v1/upload";

@Injectable({
  providedIn: "root"
})
export class SongUploadService {
  constructor(private http: HttpClient) {}

  upload(song: SongUpload) {
    const uploadData = new FormData();
    uploadData.append("file", song.file);
    uploadData.append("title", song.title);
    uploadData.append("description", song.description);
    uploadData.append("uploadedBy", song.uploadedBy);
    if (song.imageUrl) uploadData.append("imageUrl", song.imageUrl);
    return this.http.post<any>(URI, uploadData);
  }
}
