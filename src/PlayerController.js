import TrackPlayer from 'react-native-track-player';
import EventEmitter from 'react-native-eventemitter';

const mapTracksForPlayer = (show) => {
  return show.tracks.map(track => ({
    id: track.id.toString(),
    url: track.mp3,
    date: show.date,
    title: track.title,
    artist: 'Phish',
    album: show.date,
    genre: 'Phish',
    artwork: 'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'
  }));
}

class PlayerController {
  constructor() {
    this.show = null;
    this.track = null;
    this.playing = false;

    TrackPlayer.setupPlayer({
      maxCacheFiles: 40,
      maxBuffer: 0,
      minBuffer: 0
    }).then(() => {
      TrackPlayer.updateOptions({
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        ],
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        ]
      });
    });

    EventEmitter.addListener('playlistUpdate', data => {
      let nextTrackId = data.nextTrack;
      let tracks = this.show.tracks;
      let newTrack = tracks.find(track => {
        return track.id.toString() === nextTrackId;
      });

      this.track = newTrack;
      EventEmitter.emit('current', this.show, this.track, this.playing);
    });
  }

  getTrack = () => {
    return this.track;
  }

  getPlaying = () => {
    return this.playing;
  }

  setShowAndTrack = (show, track) => {
    if (!this.show || this.show.id != show.id) {
      this.addTracks(show).then(() => {
        this.show = show;
        this.setTrack(track);
        EventEmitter.emit('current', this.show, this.track, this.playing);
      });
    } else {
      this.setTrack(track);
      EventEmitter.emit('current', this.show, this.track, this.playing);
    }
  }

  setShow = (show) => {
    if (!this.show || this.show.id != show.id) {
      this.show = show;
      this.addTracks(show);
    }
  }

  setTrack = (track) => {
    if (!this.track || this.track.id != track.id) {
      this.track = track;
      this.skip(track.id);
    } else {
      this.play();
    }
  }

  addTracks = async (show) => {
    let playlist = mapTracksForPlayer(show);
    await TrackPlayer.add(playlist);
  }

  skip = (id) => {
    TrackPlayer.skip(id.toString());
    this.play();
  }

  play = () => {
    this.playing = true;
    TrackPlayer.play();
    EventEmitter.emit('current', this.show, this.track, this.playing);
  }

  pause = () => {
    this.playing = false;
    TrackPlayer.pause();
    EventEmitter.emit('current', this.show, this.track, this.playing);
  }

  skipToNext = () => {
    TrackPlayer.skipToNext().then(() => {
      this.play();
    });
  }

  skipToPrevious = () => {
    TrackPlayer.skipToPrevious().then(() => {
      this.play();
    });
  }
}

export default new PlayerController();