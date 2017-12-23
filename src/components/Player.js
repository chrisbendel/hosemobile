import React, { Component } from 'react';
import {View, TouchableOpacity, AppState} from 'react-native';
import {Footer, Text, ListItem, Right, Body, Left, Content} from 'native-base';
import Dimensions from 'Dimensions';
import EventEmitter from "react-native-eventemitter";
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer from 'react-native-track-player';
import { Actions } from 'react-native-router-flux';
import {CachedImage} from "react-native-img-cache";
import Modal from 'react-native-modal'
import Slider from "react-native-slider";
import PlayerController from './../PlayerController';

const msToSec = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const secToMin = (time) => {
  return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Player extends TrackPlayer.ProgressComponent {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      show: null,
      track: null,
      appState: AppState.currentState,
      isModalVisible: false
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

  _showModal = () => this.setState({ isModalVisible: true });

  _hideModal = () => this.setState({ isModalVisible: false });

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      let show = this.state.show;
      if (show && show.tracks) {
        TrackPlayer.getCurrentTrack().then(track => {
          let current = show.tracks.find(showTrack => {
            return track === showTrack.id.toString();
          });
          this.setState({track: current});
        });
      }
    } else {
      this.setState({appState: nextAppState});  
    }
  }

  componentDidMount() {
    this.mounted = true;
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    this.mounted = false;
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  renderTracksForSet = (show, set) => {
    return show.tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <ListItem key={track.id} style={{borderColor: "#D77186", backgroundColor: 'transparent'}} onPress={() => {
          PlayerController.setShowAndTrack(show, track);
          this._hideModal();
        }}>
          <Left>
            <Text numberOfLines={1} style={{fontSize: 14, color: "#FFF"}}>{track.title}</Text>
          </Left>
          <Body>
            <Text style={{color: "#FFF"}}> {msToSec(track.duration)} </Text>
          </Body>
          <Right>
            <Icon active color={"#D77186"} name="ios-heart">
              <Text style={{color: "#D77186"}}> {track.likes_count} </Text>
            </Icon>
          </Right>
        </ListItem>
      );
    });
  }

  renderTrackContainer = (show) => {
    const sets = [...new Set(show.tracks.map(track => track.set_name))];
    return sets.map(set => {
      return (
        <View key={set}>
          <ListItem style={{borderColor: "#4080B0", backgroundColor: 'transparent'}}>
            <Body>
              <Text style={{color: "#FFF"}}>{set}</Text>
            </Body>
          </ListItem>
          {this.renderTracksForSet(show, set)}
        </View>
      );
    });
  }

  render() {
    let show = this.state.show;
    let track = this.state.track;

    if (!show || !track) {
      return null;
    }

    let tracks = this.state.show.tracks;

    return (
      <View style={{display: 'flex'}}>
        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this._hideModal()}
          onBackButtonPress={() => this._hideModal()}
        >
          <View style={styles.modalContainer}>
            <Content style={{width: width - 50}}>
              {this.renderTrackContainer(show)}
            </Content>
          </View>
        </Modal>
        <Footer style={styles.footer}>
          <View style={styles.footerContainer}>
            <View style={styles.center}>
              <TouchableOpacity style={styles.showInfo} onPress={() => {
                Actions.show({id: show.id, title: show.date});
              }}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}} numberOfLines={1}>{track.title}</Text>
                <Text note style={{fontSize: 12}} numberOfLines={1}>{show.date} - {show.venue.name}, {show.venue.location}</Text>
              </TouchableOpacity>

              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => {
                    PlayerController.skipToPrevious();
                  }}
                >
                  <Icon name="ios-skip-backward"
                    size={40}
                    color="#4080B0" 
                  />
                </TouchableOpacity>
                {this.state.playing ?
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={() => {
                      PlayerController.pause();
                    }}>
                    <Icon name="ios-pause"
                      size={35} 
                      color="#4080B0" 
                    />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={() => {
                      PlayerController.play();
                    }}>
                    <Icon name="ios-play" size={35} color="#4080B0"/>
                  </TouchableOpacity>
                }
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => {
                    PlayerController.skipToNext();
                  }}>
                  <Icon name="ios-skip-forward" size={35} color="#4080B0"/>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => {
                    this._showModal();
                  }}>
                  <Icon 
                    name="ios-list-outline"
                    color="#4080B0" 
                    size={40}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.sliderContainer}>
                <Text note style={styles.sliderTimerPosition}> {secToMin(~~this.state.position)} </Text>
                <View style={styles.slider}>
                  <Slider
                    minimumTrackTintColor="#4080B0"
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    minimumValue={0}
                    maximumValue={~~this.state.duration}
                    value={~~this.state.position}
                    onValueChange={value => {
                      TrackPlayer.seekTo(value);
                      this.setState({position: value})
                    }}
                  />
                </View>
                <Text note style={styles.sliderTimerDuration}> {secToMin(~~this.state.duration)} </Text>
              </View>
            </View>
          </View>
        </Footer>
      </View>
    );
  }
}

const styles = {
  sliderContainer: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  sliderTimerPosition: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: '#4080B0'
  },
  sliderTimerDuration: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: '#4080B0'
  },
  slider: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: '#D77186',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.35,
  },
  track: {
    height: 10,
    borderRadius: 2,
    backgroundColor: 'white',
    borderColor: '#4080B0',
    borderWidth: 1,
  },
  modalContainer: {
    height: height / 1.5,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#4080B0'
  },
  footer: {
    backgroundColor: '#FFF',
    height: 100
  },
  footerContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  controls: {
    flex: 1,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  showInfo: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  center: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlButton: {
    paddingLeft: 20,
    paddingRight: 20
  }
}
