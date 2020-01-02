import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private apollo: Apollo) { }

  getSongs() {
    return this.apollo.watchQuery<any>({
      //TODO: add imageUrl
      query: gql`{
      songs(page:1, perPage:100) {
        id,
        title
      }
    }`}).valueChanges.pipe(
        map(res => res.data && res.data.songs)
      );
  }

  getSong(id: string) {
    return this.apollo.watchQuery<any>({
      query: gql`{
        song(id: ${id}) {
          title,
          description,
          uploadedBy,
          uri,
          created
        }
      }`
    }).valueChanges.pipe(
      map(res => res.data && res.data.song)
    );
  }
}
