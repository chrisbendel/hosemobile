import EventEmitter from "react-native-eventemitter";

class Controls {
  constructor() {
    this.show = null;
    this.track = null;
    this.playing = false;

    EventEmitter.addListener('play', (show, track) => {
      this.show = show;
      this.track = track;
      this.playing = true;
    });
  }

  getInfo = () => {
    return {
      show: this.show,
      track: this.track,
      playing: this.playing
    }
  }

  isPlaying = () => {
    return this.playing;
  }

  getShow = () => {
    return this.show;
  }

  getTrack = () => {
    return this.track;
  }
  setShow = (s) => {
    this.show = s;
  }

  setTrack = (t) => {
    this.track = t;
  }

  getPlaying = () => {
    return this.playing;
  }

  pause = () => {
    this.playing = false;
    EventEmitter.emit('pause');
  }

  play = (show, track) => {
    this.playing = true;
    this.show = show;
    this.track = track;
    EventEmitter.emit('play', show, track);
  }
}

export default new Controls();