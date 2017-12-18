import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button
} from 'react-native';
import {Footer} from 'native-base';
import Controls from './../Controls';
import EventEmitter from "react-native-eventemitter";
import Icon from 'react-native-vector-icons/Ionicons';
import Dimensions from 'Dimensions';
import TrackPlayer from 'react-native-track-player';
console.log(TrackPlayer);
let mapTracksForPlayer = (show) => {
  let tracks = show.tracks;
  return tracks.map(track => ({
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

const mapCurrentTrack = (track, show) => {
  return ({
    id: track.id,
    url: track.mp3,
    title: track.title,
    artist: 'Phish',
    album: show.date,
    genre: 'Phish',
    artwork: 'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'
  });
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      loading: true,
      currentShow: null,
      tracks: null,
      currentTrack: null
    }

    EventEmitter.addListener('play', (show, track) => {
      this.setShowAndTrack(show, track);
    });

    EventEmitter.addListener('remotePause', () => {
      alert('pause');
      TrackPlayer.pause();
    });

    EventEmitter.addListener('remotePlay', () => {
      alert('play');
      TrackPlayer.play();
    });

    EventEmitter.addListener('pause', () => {
      // this.pause();
    });
  }

  setShowAndTrack = (show, track) => {
    let currentShow = this.state.currentShow;
    let currentTrack = this.state.currentTrack;
    let tracksForPlayer = mapTracksForPlayer(show);

    TrackPlayer.setupPlayer().then(async () => {
      console.log(TrackPlayer);
      TrackPlayer.CAPABILITY_PLAY = 0;
      TrackPlayer.CAPABILITY_PAUSE = 1;
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT = 3;
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS = 4;
      TrackPlayer.updateOptions({
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        ]
      })
      await TrackPlayer.add(tracksForPlayer);

      console.log(TrackPlayer);
      TrackPlayer.skip(track.id.toString());
      TrackPlayer.play();
  
    });


    this.setState({
      currentShow: show,
      currentTrack: track,
      tracks: tracksForPlayer
    });
    
    // console.log(tracksForPlayer);

    // console.log(tracksForPlayer);
    // TrackPlayer.add(tracksForPlayer).then(function() {
    //   console.log(e, tracksForPlayer);
    //   // TrackPlayer.skip(track.id);
    //   TrackPlayer.play();
    // });
    // } else {
    //   if (currentShow.id === show.id) {
    //     if (currentTrack.id === track.id) {
    //       return;
    //     } else {
          
    //     }
    //   }
    // }

    
  }

  componentWillMount() {
    // TrackPlayer.setupPlayer()
  }

  render() {
    if (!this.state.currentShow) {
      return null;
    }

    return (
      <Footer style={{height: 75}}>
        {this.state.play ?
        <Icon name="ios-pause" 
          size={50} 
          color="#4F8EF7" 
          onPress={() => {
            // this.pause()
          }}
        />
        :
        <Icon name="ios-play" 
          size={50} 
          color="#4F8EF7" 
          onPress={() => {
            // this.play()
          }}
        />
        }
      </Footer>
    )
  }
}
