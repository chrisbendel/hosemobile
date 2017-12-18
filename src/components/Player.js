import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button
} from 'react-native';
// import {
//   Player as Audio,
//   MediaStates
// } from 'react-native-audio-toolkit';
import Controls from './../Controls';
import MusicControl from 'react-native-music-control';
// import Sound from 'react-native-sound';
import EventEmitter from "react-native-eventemitter";
import Icon from 'react-native-vector-icons/Ionicons';
import Dimensions from 'Dimensions';
import TrackPlayer from 'react-native-track-player';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      play: false,
      loading: true
    }



    EventEmitter.addListener('play', (show, track) => {

    });

    EventEmitter.addListener('pause', () => {
      this.pause();
    });
  }

  componentWillMount() {
    TrackPlayer.setupPlayer().then(() => {
      console.log(TrackPlayer);
      // The player is ready to be used
    });

    MusicControl.enableBackgroundMode(true);
    this.player = new Audio();
    // this.whoosh = new Sound('https://phish.in/audio/000/019/097/19097.mp3', '', (error) => {
    //   if (error) {
    //     console.log('failed to load the sound', error);
    //   } else {
    //     this.setState({loading: false})
    //     console.log('Sound loaded');
    //   }
    // });

    MusicControl.on('play', this.play)
    MusicControl.on('pause', this.pause)
  }

  play = () => {
    this.whoosh.play((success) => {
      if (success) {
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });

    MusicControl.setNowPlaying({
      title: 'Billie Jean',
      artwork: 'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg',
      artist: 'Phish',
      album: 'Thriller',
      genre: 'Phish',
      duration: this.whoosh.getDuration(),
      description: 'Billie Jean is a song by American singer Michael Jackson. It is the second single from the singer\'s sixth solo album, Thriller (1982). It was written and composed by Jackson and produced by Jackson and Quincy Jones.',
      date: '1983-01-02T00:00:00Z',
      rating: 84
    })
    MusicControl.enableControl('play', false)
    MusicControl.enableControl('pause', true)


    this.setState({
      play: true
    })
  }

  playSomething = () => {
    let show = this.state.show;
    MusicControl.setNowPlaying({
      title: 'Rock With You',
      artwork: 'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg',
      artist: 'Phish',
      album: 'Off The Wall',
      genre: 'Phish',
      duration: this.whoosh.getDuration(),
      description: 'Billie Jean is a song by American singer Michael Jackson. It is the second single from the singer\'s sixth solo album, Thriller (1982). It was written and composed by Jackson and produced by Jackson and Quincy Jones.',
      date: '1983-01-02T00:00:00Z',
      rating: 84
    })
    MusicControl.enableControl('play', false)
    MusicControl.enableControl('pause', true)


    this.setState({
      play: true
    })
  }

  pause = () => {
    this.whoosh.pause()
    MusicControl.enableControl('play', true)
    MusicControl.enableControl('pause', false)
    this.setState({
      play: false
    })
  }

  displayInfo = () => {
    if(!this.state.play){
      this.play()
    } else {
      this.pause()
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <Text> Loading ... </Text>
      );
    }

    return (
      <View>
        {this.state.play ?
        <Icon name="ios-pause" 
          size={50} 
          color="#4F8EF7" 
          onPress={() => {
            this.pause()
          }}
        />
        :
        <Icon name="ios-play" 
          size={50} 
          color="#4F8EF7" 
          onPress={() => {
            this.play()
          }}
        />
        }
      </View>
    )
  }
}
