import { Component, OnInit } from '@angular/core';

import { StreamService } from './services/stream.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(private streamService: StreamService) {}

  ngOnInit() {
    this.streamService
      .playStream(
        "https://rso.s3.eu-central-1.amazonaws.com/9c3d32bf253bcd3109500d36f9516a67b55e6c98.flac"
      )
      .subscribe(console.log);
  }

  play() {
    this.streamService.play();
  }

  pause() {
    this.streamService.pause();
  }

  seek() {
    this.streamService.seekTo(110);
  }
}
