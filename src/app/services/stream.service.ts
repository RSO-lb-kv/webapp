import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StreamState } from '../interfaces/stream-state';

@Injectable({
  providedIn: "root"
})
export class StreamService {
  private stop$ = new Subject();
  private audio = new Audio();
  private state$ = new BehaviorSubject<StreamState>(new StreamState());
  private AUDIO_EVENTS = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];

  playStream(url) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.stop$.next();
  }

  seekTo(seconds) {
    this.audio.currentTime = seconds;
  }

  setVolume(value: number) {
    this.audio.volume = value;
  }

  private streamObservable(url): Observable<Event> {
    return new Observable<Event>(observer => {
      this.audio.src = url;
      this.audio.autoplay = true;
      this.audio.load();
      this.audio.play().catch(err => {
        const state = this.state$.value;
        state.autoplayFailed = true;
        this.state$.next(state);
      });

      const handler = (event: Event) => {
        this.updateState(event);
        observer.next(event);
      };

      this.AUDIO_EVENTS.forEach(event => {
        this.audio.addEventListener(event, handler);
      });

      // Teardown logic
      return () => {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.AUDIO_EVENTS.forEach(event => {
          this.audio.removeEventListener(event, handler);
        });
        this.state$.value.reset();
      };
    });
  }

  private updateState(event: Event): void {
    const state = this.state$.value;
    state.volume = this.audio.volume;
    switch (event.type) {
      case "canplay":
        state.duration = this.audio.duration;
        state.canplay = true;
        break;
      case "playing":
        state.playing = true;
        break;
      case "pause":
        state.playing = false;
        break;
      case "timeupdate":
        state.currentTime = this.audio.currentTime;
        break;
      case "error":
        state.reset();
        state.error = true;
        break;
    }
    this.state$.next(state);
  }

  get state(): Observable<StreamState> {
    return this.state$.asObservable();
  }
}
