import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class CatalogService {
  constructor(private apollo: Apollo) {}

  getSongs() {
    return this.apollo
      .query<any>({
        query: gql`
          {
            songs(page: 1, perPage: 100) {
              id
              title
              imageUrl
            }
          }
        `
      })
      .pipe(map(res => res.data && res.data.songs));
  }

  getSong(id: number) {
    return this.apollo
      .query<any>({
        query: gql`{
        song(id: ${id}) {
          id,
          title,
          description,
          uploadedBy,
          uri,
          bpm,
          imageUrl,
          created
        }
      }`
      })
      .pipe(map(res => res.data && res.data.song));
  }
}
