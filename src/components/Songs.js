import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import {Container, Header, Item, Icon, Input, Button, Text, List, ListItem, Left, Body, Right, Content} from 'native-base';
import {songFilters, trackJamcharts} from './../Filters';
import {tracksForSong, show} from './../api/phishin';
import AutoComplete from 'react-native-autocomplete';
import Spinner from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import Controls from './../Controls';

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
      loading: false,
      likesOrder: false,
      timeOrder: false,
      dateOrder: false,
      jamcharts: false
    }
  }

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
            <Icon fontSize={40} active name="play" onPress={() => {
              show(track.show_id).then(show => {
                Controls.play(show, track);
              });
            }}/>
          </Left>
          <Body>
            <TouchableOpacity onPress={() => {
              Actions.show({id: track.show_id});
            }}>
              <Text active note>{track.show_date}</Text>
            </TouchableOpacity>
          </Body>
          <Right style={styles.listItemContent}>
            <Text note>{isJamchart(track.id) ? "Jamcharts" : ""}</Text>
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
      <Container>
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
          autoCompleteTableBorderColor="lightblue"
          autoCompleteTableBackgroundColor="azure"
          autoCompleteTableCornerRadius={8}
          autoCompleteTableBorderWidth={1}
          autoCompleteFontSize={25}
          autoCompleteRegularFontName="Helvetica Neue"
          autoCompleteBoldFontName="Helvetica Bold"
          autoCompleteTableCellTextColor={"dimgray"}
          autoCompleteRowHeight={60}
          autoCompleteFetchRequestDelay={100}
          maximumNumberOfAutoCompleteRows={10}
        />
        <ListItem key="filters" icon style={styles.listItem}>
          <Left>
            <Icon/>
          </Left>
          <Body>
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
              <Text active>Jamcharts</Text>
            </TouchableOpacity>
          </Right>
          <Right style={styles.listItemContent}>
            <TouchableOpacity onPress={() => {
                  this.sortSongs('duration');
                }}>
              <Icon fontSize={100} name="clock"/>
            </TouchableOpacity>
          </Right>
          <Right style={styles.listItemContent}>
            <TouchableOpacity onPress={() => {
                this.sortSongs('likes_count');
              }}>
              <Icon fontSize={100} active name="heart" />
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

const styles = StyleSheet.create({
  autocomplete: {
    alignSelf: "stretch",
    height: 50,
    margin: 10,
    backgroundColor: "#FFF",
    borderColor: "lightblue",
    textAlign: 'center',
    borderWidth: 1
  },
  listItem: {
    backgroundColor: 'transparent'
  },
  listItemContent: {
    marginLeft: 5
  },
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  }
});
