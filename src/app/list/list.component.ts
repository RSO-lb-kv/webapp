import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CatalogService } from '../services/catalog.service';

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  songs;

  constructor(private catalogService: CatalogService, private router: Router) {}

  ngOnInit() {
    this.catalogService.getSongs().subscribe(data => {
      this.songs = data;
    });
  }

  openSong(id: string) {
    this.router.navigate(["song", id]);
  }

  openAddSong() {
    this.router.navigate(["new"]);
  }
}
