import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button
} from 'react-native';
import {
  Player as Audio,
  MediaStates
} from 'react-native-audio-toolkit';
import MusicControl from 'react-native-music-control';
import Sound from 'react-native-sound';
import EventEmitter from "react-native-eventemitter";
import Icon from 'react-native-vector-icons/Ionicons';
import Dimensions from 'Dimensions';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      play: false,
      loading: true
    }
  }

  componentWillMount() {
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
      artwork: 'https://i.imgur.com/e1cpwdo.png',
      artist: 'Michael Jackson',
      album: 'Thriller',
      genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
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
    MusicControl.setNowPlaying({
      title: 'Rock With You',
      artwork: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Off_the_wall.jpg',
      artist: 'Michael Jackson',
      album: 'Off The Wall',
      genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
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

  changeCover = () => {
    MusicControl.setNowPlaying({
      title: 'Smooth Criminal',
      artwork: 'https://upload.wikimedia.org/wikipedia/en/5/51/Michael_Jackson_-_Bad.png',
      artist: 'Jackson, Michael',
      album: 'Bad',
      genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
      duration: this.whoosh.getDuration(),
      description: 'Billie Jean is a song by American singer Michael Jackson. It is the second single from the singer\'s sixth solo album, Thriller (1982). It was written and composed by Jackson and produced by Jackson and Quincy Jones.',
      date: '1983-01-02T00:00:00Z',
      rating: 84
    })
    MusicControl.enableControl('play', false)
    MusicControl.enableControl('pause', true)
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
