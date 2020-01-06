import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { fromEvent, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { StreamState } from '../interfaces/stream-state';
import { StreamService } from '../services/stream.service';

@Component({
  selector: "app-seek",
  templateUrl: "./seek.component.html",
  styleUrls: ["./seek.component.scss"]
})
export class SeekComponent implements OnInit, OnDestroy {
  state: StreamState;
  options: AnimationOptions = {
    path: "/assets/215-play-pause.json",
    autoplay: false,
    loop: false
  };
  styles: Partial<CSSStyleDeclaration> = {
    cursor: "pointer"
  };

  private animationItem: AnimationItem;
  private destroy$ = new Subject();
  private pauseSubscription = false;

  @ViewChild("progress", { static: true }) progressElement: ElementRef;

  constructor(private streamService: StreamService, private ngZone: NgZone) {}

  ngOnInit() {
    this.streamService.state.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (this.pauseSubscription) {
        return;
      }
      this.state = { ...data } as StreamState;
    });

    fromEvent<MouseEvent>(this.progressElement.nativeElement, "mousedown")
      .pipe(
        switchMap(event => {
          event.preventDefault();
          this.pauseSubscription = true;
          return fromEvent<MouseEvent>(document, "mousemove").pipe(
            takeUntil(
              fromEvent<MouseEvent>(document, "mouseup").pipe(
                tap(event => {
                  this.onSeek(event);
                  this.pauseSubscription = false;
                })
              )
            )
          );
        })
      )
      .subscribe(event => {
        const offset =
          event.pageX -
          this.progressElement.nativeElement.getBoundingClientRect().left;
        const offsetPercentage =
          offset / this.progressElement.nativeElement.clientWidth;
        const seconds = this.state.duration * offsetPercentage;
        this.state.currentTime = Math.max(
          0,
          Math.min(seconds, this.state.duration)
        );
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onSeek(event: MouseEvent) {
    const offset =
      event.pageX -
      this.progressElement.nativeElement.getBoundingClientRect().left;
    const offsetPercentage =
      offset / this.progressElement.nativeElement.clientWidth;
    const seconds = this.state.duration * offsetPercentage;
    this.state.currentTime = seconds;
    this.streamService.seekTo(seconds);
  }

  animationCreated(animationItem: AnimationItem) {
    this.animationItem = animationItem;
  }

  domLoaded() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.state.autoplayFailed) {
        this.animationItem.playSegments([29, 30], true);
      }
    });
  }

  toggleplay() {
    if (this.state.playing) {
      this.pause();
      this.streamService.pause();
    } else {
      this.play();
      this.streamService.play();
    }
  }

  private play() {
    this.ngZone.runOutsideAngular(() =>
      this.animationItem.playSegments([0, 30], true)
    );
  }

  private pause() {
    this.ngZone.runOutsideAngular(() =>
      this.animationItem.playSegments([30, 60], true)
    );
  }
}
