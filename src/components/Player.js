import React, { Component } from 'react';
import {View, TouchableOpacity, AppState} from 'react-native';
import {Footer, Text, ListItem, Right, Body, Left, Content} from 'native-base';
import Controls from './../Controls';
import Dimensions from 'Dimensions';
import EventEmitter from "react-native-eventemitter";
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {ProgressComponent} from 'react-native-track-player';
import { Actions } from 'react-native-router-flux';
import {CachedImage} from "react-native-img-cache";
import MarqueeText from 'react-native-marquee';
import Modal from 'react-native-modal'

const msToSec = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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

export default class Player extends ProgressComponent {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      loading: true,
      currentShow: null,
      tracks: null,
      currentTrack: null,
      appState: AppState.currentState,
      isModalVisible: false
    }

    EventEmitter.addListener('play', (show, track) => {
      let currentShow = this.state.currentShow;
      let currentTrack = this.state.currentTrack;

      if (!currentShow) {
        return this.setShowAndTrack(show, track);
      }

      if (currentShow.id === show.id) {
        if (track.id === currentTrack.id) {
          return;
        } else {
          TrackPlayer.skip(track.id.toString());
          this.setState({currentTrack: track});
        }
      } else {
        this.setShowAndTrack(show, track);
      }

      this.setState({
        playing: true
      });
    });

    EventEmitter.addListener('pause', () => {
      this.setState({playing: false});
      TrackPlayer.pause();
    });
  }

  _showModal = () => this.setState({ isModalVisible: true });

  _hideModal = () => this.setState({ isModalVisible: false });

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      let show = this.state.currentShow;
      if (show && show.tracks) {
        TrackPlayer.getCurrentTrack().then(track => {
          let current = show.tracks.find(showTrack => {
            return track === showTrack.id.toString();
          });
          this.setState({currentTrack: current});
        });
      }
    } else {
      this.setState({appState: nextAppState});  
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  setShowAndTrack = async (show, track) => {
    let currentShow = this.state.currentShow;
    let currentTrack = this.state.currentTrack;
    let tracksForPlayer = mapTracksForPlayer(show);

    TrackPlayer.setupPlayer({
      maxCacheFiles: 40,
      maxBuffer: 0,
      minBuffer: 0
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
      });

      await TrackPlayer.add(tracksForPlayer);

      TrackPlayer.skip(track.id.toString());
      TrackPlayer.play();
      console.log(TrackPlayer);
    });

    this.setState({
      currentShow: show,
      currentTrack: track,
      playing: true,
      tracks: tracksForPlayer
    });
  }

  renderTracksForSet = (show, set) => {
    return show.tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <ListItem key={track.id} icon style={{backgroundColor: 'transparent'}}>
          <Left>
            <Icon active name="ios-play" onPress={() => {
              Controls.play(show, track);
            }}/>
          </Left>
          <Body>
            <Text style={{fontSize: 12}}>{track.title}</Text>
          </Body>
          <Right>
            <Text note> {msToSec(track.duration)} </Text>
          </Right>
          <Right>
            <Icon active name="ios-heart">
              <Text> {track.likes_count} </Text>
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
          <ListItem style={{backgroundColor: 'transparent'}}>
            <Body>
              <Text>{set}</Text>
            </Body>
          </ListItem>
          {this.renderTracksForSet(show, set)}
        </View>
      );
    });
  }

  render() {
    let show = this.state.currentShow;
    let track = this.state.currentTrack;

    if (!show || !track) {
      return null;
    }

    let showTracks = this.state.currentShow.tracks;

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
            <View style={styles.imageContainer}>
              <CachedImage
                source={{uri: 'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}}
                style={styles.showImage}
              />
            </View>
            <View style={styles.center}>
              <Text style={{fontSize: 12, fontWeight: 'bold'}} numberOfLines={1}> {track.title} </Text>
              <MarqueeText
                style={{ fontSize: 12 }}
                duration={8000}
                marqueeOnStart
                loop
                marqueeDelay={4000}
                marqueeResetDelay={0}
              >
                {show.date} - {show.venue.name}, {show.venue.location}
              </MarqueeText>
              <View style={styles.controls}>
                <Icon name="ios-skip-backward"
                  size={40}
                  color="#61A2DA" 
                  style={styles.controlButton}
                  onPress={() => {
                    TrackPlayer.skipToPrevious().then(() => {
                      TrackPlayer.play();
                    });
                    TrackPlayer.getCurrentTrack().then(track => {
                      let current = showTracks.find(showTrack => {
                        return track === showTrack.id.toString();
                      })
                      this.setState({currentTrack: current});
                    });
                  }}
                />
                {this.state.playing ?
                  <TouchableOpacity onPress={() => {
                    this.setState({playing: false});
                    TrackPlayer.pause();
                  }}>
                    <Icon name="ios-pause"
                      size={40} 
                      color="#61A2DA" 
                      style={styles.controlButton}
                    />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => {
                    this.setState({playing: true});
                    TrackPlayer.play();
                  }}>
                    <Icon name="ios-play" 
                      size={40} 
                      color="#61A2DA" 
                      style={styles.controlButton}
                    />
                  </TouchableOpacity>
                }
                <Icon name="ios-skip-forward"
                  size={40}
                  color="#61A2DA"
                  style={styles.controlButton}
                  onPress={() => {
                    TrackPlayer.skipToNext().then(() => {
                      TrackPlayer.play();
                    });
                    TrackPlayer.getCurrentTrack().then(track => {
                      let current = showTracks.find(showTrack => {
                        return track === showTrack.id.toString();
                      })
                      this.setState({currentTrack: current});
                    });
                  }}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.playlistContainer}
              onPress={() => {
                this._showModal();
              }}>
              <Icon 
                name="ios-list-outline"
                color="#61A2DA" 
                size={60}
              />
            </TouchableOpacity>
          </View>
        </Footer>
      </View>
    )
  }
}

const styles = {
  modalContainer: {
    height: height / 1.5,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#61A2DA'
  },
  footer: {
    backgroundColor: '#DCDDD8',
    height: 75
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  center: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playlistContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  showImage: {
    width: 75,
    height: 75
  },
  controlButton: {
    paddingLeft: 20,
    paddingRight: 20
  }
}
