import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const URI = 'http://34.89.117.96/image-upload/v1/upload'

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(
    private http: HttpClient
  ) { }

  public uploadFile(image): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('file', image);
    return this.http.post<any>(URI, uploadData);
  }
}
