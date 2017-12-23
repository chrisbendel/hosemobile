import React, { Component } from 'react';
import { Platform, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Container, List, ListItem, Separator, Header, Content, Card, CardItem, Thumbnail, Text, Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {randomShow, show} from './../api/phishin';
import {trackJamcharts} from './../Filters';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import {CachedImage} from "react-native-img-cache";
import EventEmitter from "react-native-eventemitter";
import TrackPlayer from 'react-native-track-player';
import PlayerController from './../PlayerController';

const isJamchart = (id) => {
  return (trackJamcharts.indexOf(id) !== -1);
}

const msToSec = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export default class Show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: null,
      track: null,
      loading: false,
      playing: false
    }

    EventEmitter.addListener('current', (show, track, playing) => {
      if (this.mounted) {
        this.setState({
          show: show,
          track: track,
          playing: playing
        });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillMount() {
    this.mounted = true;
    let playingTrack = PlayerController.getTrack();
    let playing = PlayerController.getPlaying();
    let id = this.props.id;
    this.setState({loading: true})
    switch (id) {
      case 'random':
        randomShow().then(show => {
          Actions.refresh({title: show.date});
          this.setState({
            show: show,
            loading: false,
            track: playingTrack,
            playing: playing
          });
        });
        break;

      default: 
        show(id).then(show => {
          Actions.refresh({title: show.date});
          this.setState({
            show: show,
            loading: false,
            track: playingTrack,
            playing: playing
          });
        });
        break;
    }
  }

  renderTracksForSet = (tracks, set) => {
    let show = this.state.show;
    return tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <ListItem key={track.id} icon style={{borderColor: "#D77186", backgroundColor: 'transparent'}}>
          <Left>
            {this.state.track && this.state.track.id == track.id && this.state.playing ? 
              <TouchableOpacity onPress={() => {
                PlayerController.pause();
              }}>
                <Icon color="#4080B0" size={30} name="ios-pause" />
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => {
                PlayerController.setShowAndTrack(show, track);
              }}>
                <Icon color="#4080B0" size={30} name="ios-play" />
              </TouchableOpacity>
            }
          </Left>
          <Body>
            <TouchableOpacity onPress={() => {
              if (this.state.track && this.state.track.id == track.id && this.state.playing) {
                PlayerController.pause();
              } else {
                PlayerController.setShowAndTrack(show, track);
              }
            }}>
              <Text numberOfLines={1} style={{fontSize: 14}}>{track.title}</Text>
            </TouchableOpacity>
          </Body>
          <Right style={styles.listItemContent}>
            <Text note>{isJamchart(track.id) ? "Jamcharts" : ""}</Text>
          </Right>
          <Right style={styles.listItemContent}>
            <Text note> {msToSec(track.duration)} </Text>
          </Right>
          <Right style={styles.listItemContent}>
            <Icon color="#D77186" name="ios-heart">
              <Text> {track.likes_count} </Text>
            </Icon>
          </Right>
        </ListItem>
      );
    });
  }

  renderTrackContainer = (tracks) => {
    const sets = [...new Set(tracks.map(track => track.set_name))];
    return sets.map(set => {
      return (
        <View key={set}>
          <ListItem style={{borderColor: "#4080B0", backgroundColor: 'transparent'}}>
            <Body>
              <Text>{set}</Text>
            </Body>
          </ListItem>
          {this.renderTracksForSet(tracks, set)}
        </View>
      );
    });
  }

  render() {
    let show = this.state.show;

    if (!show) {
      return (
        <Container>
          <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}} />
        </Container>
      );
    }

    return (
      <Container style={{backgroundColor: '#FFF'}}>
        <View style={styles.showContainer}>
          <CachedImage
            source={{uri: 'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}}
            style={styles.showImage}
          />
          <View style={styles.showInfo}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>{show.date}  </Text>
              <Icon size={20} color="#D77186" name="ios-heart"/>
              <Text style={{color: "#D77186"}}>{show.likes_count}</Text>
            </View>
            <Text numberOfLines={1}>{show.venue.name}</Text>
            <Text numberOfLines={1}>{show.venue.location}</Text>

            {show.tags && 
              show.tags.map(tag => {
                return <Text style={{color: "#4080B0"}} key={tag}>{tag}</Text>
              })
            }
          </View>
        </View>
        <Content>
          {this.renderTrackContainer(show.tracks)}
        </Content>
      </Container>
    );
  }
}

var styles = StyleSheet.create({
  showContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5
  },
  showInfo: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20
  },
  listItemContent: {
    marginLeft: 5
  },
  showImage: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
  }
});