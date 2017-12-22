import EventEmitter from "react-native-eventemitter";
import TrackPlayer from 'react-native-track-player';

export default PlayerHandler = async (data) => {
  console.log(data);
  //handle playback-track-changed here
  if (data.type == 'remote-play') {
    TrackPlayer.play();
  } else if (data.type == 'remote-pause') {
    TrackPlayer.pause();
  } else if(data.type == 'remote-next') {
    TrackPlayer.skipToNext();
  } else if (data.type == 'remote-previous') {
    TrackPlayer.skipToPrevious();
  }
};