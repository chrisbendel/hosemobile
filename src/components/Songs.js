import React, { Component } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import {Container, Header, Item, Input, Button, Text, List, ListItem, Left, Body, Right, Content} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {songFilters, trackJamcharts} from './../Filters';
import {tracksForSong, show} from './../api/phishin';
import AutoComplete from 'react-native-autocomplete';
import Spinner from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import PlayerController from './../PlayerController';
import EventEmitter from 'react-native-eventemitter';
import ModalFilterPicker from 'react-native-modal-filter-picker';

const msToSec = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const isJamchart = (id) => {
  return (trackJamcharts.indexOf(id) !== -1);
}

export default class Songs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      songs: null,
      track: null,
      playing: false,
      loading: false,
      likesOrder: false,
      timeOrder: false,
      dateOrder: false,
      jamcharts: false,
      filterVisible: false
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

  componentWillMount() { 
    this.mounted = true;
    let playing = PlayerController.getPlaying();
    let playingTrack = PlayerController.getTrack();
    this.setState({
      playing: playing,
      track: playingTrack
    });
  }

  componentWillUnmount() { this.mounted = false }

  fetchTracks = (song) => {
    this.setState({loading: true});
    tracksForSong(song).then(songs => {
      this.setState({
        songs: songs,
        loading: false,
        trackId: song
      });
    });
  }

  sortSongs = (attr) => {
    let songs = this.state.songs;
    if (!songs) {
      return;
    }

    if (attr === 'date') {
      let sorted = songs.sort((a, b) => {
        var c = new Date(a.show_date);
        var d = new Date(b.show_date);
        if (this.state.dateOrder) {
          return c-d;
        } else {
          return d-c;
        }
      });

      this.setState({
        songs: sorted,
        dateOrder: !this.state.dateOrder
      })
    }

    if (attr === 'duration') {
      let sorted = songs.sort((a, b) => {
        if (this.state.timeOrder) {
          return parseFloat(a.duration) - parseFloat(b.duration);
        } else {
          return parseFloat(b.duration) - parseFloat(a.duration);
        }
      });

      this.setState({
        songs: sorted,
        timeOrder: !this.state.timeOrder
      });
    }
    
    if (attr === 'jamcharts') {
      if (!this.state.jamcharts) {
        let sorted = songs.filter(track => {
          return isJamchart(track.id);
        });

        this.setState({
          songs: sorted,
          jamcharts: !this.state.jamcharts
        });
      } else {
        this.setState({jamcharts: !this.state.jamcharts})
        this.fetchTracks(this.state.trackId);
      }
    }

    if (attr === 'likes_count') {
      let sorted = songs.sort((a, b) => {
        if (this.state.likesOrder) {
          return parseFloat(a.likes_count) - parseFloat(b.likes_count);
        } else {
          return parseFloat(b.likes_count) - parseFloat(a.likes_count);
        }
      });
      this.setState({
        songs: sorted,
        likesOrder: !this.state.likesOrder
      })
    }
  }

  onTyping = (text) => {
    const songs = songFilters.filter(song =>
      song.label.toLowerCase().startsWith(text.toLowerCase())
    ).map(song => song.label);

    this.setState({ data: songs });
  }
  
  onFilterSelect = (picked) => {
    songObj = songFilters.find(song => {
      console.log(picked, song);
      return picked === song.key;
    });
    Actions.refresh({title: songObj.label});
    this.setState({filterVisible: false});
    this.fetchTracks(songObj.key);
  }

  onSelect = (label) => {
    songObj = songFilters.find(song => {
      return label === song.label;
    });
    Actions.refresh({title: label});
    this.fetchTracks(songObj.key);
  }

  renderTracks = (tracks) => {
    return tracks.map(track => {
      return (
        <ListItem key={track.id} icon style={styles.listItem}>
          <Left style={{paddingLeft: 5, paddingRight: 5}}>
            {this.state.track && this.state.track.id == track.id && this.state.playing ? 
              <TouchableOpacity onPress={() => {
                PlayerController.pause();
              }}>
                <Icon color="#4080B0" size={35} name="ios-pause" />
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => {
                show(track.show_id).then(show => {
                  PlayerController.setShowAndTrack(show, track);
                });
              }}>
                <Icon color="#4080B0" size={45} name="ios-play" />
              </TouchableOpacity>
            }
          </Left>
          <Body style={styles.listItemContent}>
            <TouchableOpacity onPress={() => {
              Actions.show({id: track.show_id});
            }}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>{track.show_date}</Text>
            </TouchableOpacity>
          </Body>
          <Right style={styles.listItemContent}>
            <Text note>{isJamchart(track.id) && "Jamcharts"}</Text>
          </Right>
          <Right style={styles.listItemContent}>
            <Text note> {msToSec(track.duration)} </Text>
          </Right>
          <Right style={styles.listItemContent}>
            <Text note> {track.likes_count} </Text>
          </Right>
        </ListItem>
      );
    });
  }

  render() {
    let songs = this.state.songs;

    return (
      <Container style={{display: 'flex'}}>
        {Platform.OS === "ios" ?
          <AutoComplete
            style={styles.autocomplete}
            suggestions={this.state.data}
            onTyping={this.onTyping}
            onSelect={this.onSelect}
            placeholder="Search for a song"
            clearButtonMode="always"
            autoFocus={true}
            returnKeyType="go"
            textAlign="center"
            clearTextOnFocus
            autoCompleteTableTopOffset={0}
            autoCompleteTableLeftOffset={0}
            autoCompleteTableSizeOffset={0}
            autoCompleteTableBorderColor="#D77186"
            autoCompleteTableBackgroundColor="#FFF"
            autoCompleteTableCornerRadius={8}
            autoCompleteTableBorderWidth={1}
            autoCompleteFontSize={20}
            autoCompleteTableCellTextColor={"#4080B0"}
            autoCompleteRowHeight={60}
            autoCompleteFetchRequestDelay={100}
            maximumNumberOfAutoCompleteRows={10}
          />
          :
          <View style={{padding: 10, alignSelf: 'center'}}>
            <ModalFilterPicker
              visible={this.state.filterVisible}
              autoFocus
              onSelect={picked => {this.onFilterSelect(picked)}}
              onCancel={() => {this.setState({filterVisible: false})}}
              options={songFilters}
            />
            <Button style={styles.filterButton} onPress={() => {
              this.setState({filterVisible: true});
            }}>
              <Text>Search for a song</Text>
            </Button>
          </View>
        }

        <ListItem key="filters" icon style={{borderColor: "#4080B0", backgroundColor: 'transparent'}}>
          <Left>
            <Icon color="#4080B0" size={35} name="ios-play"/>
          </Left>
          <Body style={styles.listItemContent}>
            <TouchableOpacity onPress={() => {
              this.sortSongs('date');
            }}>
              <Text active>Date</Text>
            </TouchableOpacity>
          </Body>
          
          <Right style={styles.listItemContent}>
            <TouchableOpacity onPress={() => {
              this.sortSongs('jamcharts');
            }}>
              <Text>Jamcharts</Text>
            </TouchableOpacity>
          </Right>
          <Right style={styles.listItemContent}>
            <TouchableOpacity onPress={() => {
                  this.sortSongs('duration');
                }}>
              <Icon size={35} name="ios-clock"/>
            </TouchableOpacity>
          </Right>
          <Right style={styles.listItemContent}>
            <TouchableOpacity onPress={() => {
                this.sortSongs('likes_count');
              }}>
              <Icon size={35} color="#D77186" name="ios-heart" />
            </TouchableOpacity>
          </Right>
        </ListItem>
        {this.state.loading ? 
          <Container>
            <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}} />
          </Container>
        :
          <Content>
          {songs && 
            <List>
              {this.renderTracks(songs)}
            </List>
          }
          </Content>
        }
      </Container>
    );
  }
}

const styles = {
  autocomplete: {
    alignSelf: "stretch",
    height: 50,
    margin: 10,
    color: "#4080B0",
    backgroundColor: "#FFF",
    borderColor: "#D77186",
    textAlign: 'center',
    borderWidth: 1
  },
  listItem: {
    borderColor: "#D77186",
    backgroundColor: 'transparent'
  },
  listItemContent: {
    borderColor: "#D77186",
    display: 'flex',
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  filterButton: {
    backgroundColor: '#4080B0'
  },
};
