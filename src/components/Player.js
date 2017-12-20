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
import { Actions } from 'react-native-router-flux';

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

    // EventEmitter.addListener('pause', () => {
    //   // this.pause();
    // });
  }

  setShowAndTrack = async (show, track) => {
    let currentShow = this.state.currentShow;
    let currentTrack = this.state.currentTrack;
    let tracksForPlayer = mapTracksForPlayer(show);

    TrackPlayer.setupPlayer({
      maxCacheFiles: 20
    }).then(async () => {
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
      })
      await TrackPlayer.add(tracksForPlayer);

      TrackPlayer.skip(track.id.toString());
      TrackPlayer.play();
      console.log(TrackPlayer);
    });


    this.setState({
      currentShow: show,
      currentTrack: track,
      tracks: tracksForPlayer
    });
  }

  componentWillMount() {
    // TrackPlayer.setupPlayer()
  }

  render() {
    let show = this.state.currentShow;
    if (!show) {
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
            console.log(TrackPlayer);
            // this.play()
          }}
        />
        }
      </Footer>
    )
  }
}
