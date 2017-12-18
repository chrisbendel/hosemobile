import EventEmitter from "react-native-eventemitter";

class Controls {
  constructor() {
    this.show = null;
    this.track = null;
    this.position = null;
    this.playing = false;

    EventEmitter.addListener('play', (show, track) => {
      
    });
  }

  getInfo = () => {
    return {
      show: this.show,
      track: this.track,
      position: this.position,
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

  getPosition = () => {
    return this.position;
  }

  setShow = (s) => {
    this.show = s;
  }

  setTrack = (t) => {
    this.track = t;
  }

  setPosition = (p) => {
    this.position = p;
  }

  setPlaying = (p) => {
    this.playing = p;
  }

  getPlaying = () => {
    return this.playing;
  }

  pause = () => {
    this.playing = false;
    emitter.emit('pause');
  }

  play = () => {
    this.playing = true;
    emitter.emit('play');
  }

  updateShowAndPosition = (e, s, p = 1) => {
    if (e) {
      e.stopPropagation();
    }
    emitter.emit('playlistUpdate', s, p - 1);
  }
}

export default new Controls();