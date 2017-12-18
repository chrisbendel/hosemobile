import EventEmitter from "react-native-eventemitter";

export default PlayerHandler = async (data) => {
  // console.log(data);
  if(data.type == 'playback-state') {
    console.log('playback state');
      // Update the UI with the new state
  } else if(data.type == 'remote-play') {
    // The play button was pressed, we can forward this command to the player using
    console.log('play');
    EventEmitter.emit('remotePlay');
  } else if (data.type == 'remote-pause') {
    console.log('pause');
    EventEmitter.emit('remotePause');
  } else if(data.type == 'remote-seek') {
      // Again, we can forward this command to the player using
      //TrackPlayer.seekTo(data.position);
  }
};