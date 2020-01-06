export class StreamState {
  playing: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  canplay: boolean;
  error: boolean;

  reset() {
    this.playing = false;
    this.duration = undefined;
    this.currentTime = undefined;
    this.canplay = false;
    this.error = false;
  }
}
