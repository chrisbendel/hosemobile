import EventEmitter from 'react-native-eventemitter';
import TrackPlayer from 'react-native-track-player';
// import PlayerController from './PlayerController';

export default PlayerHandler = async (data) => {
  if (data.type == 'playback-track-changed') {
    EventEmitter.emit('playlistUpdate', data);
  } else if (data.type == 'remote-play') {
    TrackPlayer.play();
  } else if (data.type == 'remote-pause') {
    TrackPlayer.pause();
  } else if(data.type == 'remote-next') {
    TrackPlayer.skipToNext();
  } else if (data.type == 'remote-previous') {
    TrackPlayer.skipToPrevious();
  }
};